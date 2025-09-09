"use client";

import SkeletonCards from "@/components/loadings/skeleton/SkeletonCards";
import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import useLoadMore from "@/hooks/useLoadMore";
import { defaultSort, sorting } from "@/lib/constants";
import { getCollectionProducts, getProducts } from "@/lib/shopify";
import { PageInfo, Product } from "@/lib/shopify/types";
import { titleify } from "@/lib/utils/textConverter";
import CustomizableProductListItem from "@/components/product/CustomizableProductListItem";
import { useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";

const ProductListView = ({ searchParams }: { searchParams: any }) => {
  const { currencySymbol } = config.shopify;
  const [isLoading, setIsLoading] = useState(true);
  const targetElementRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    products: Product[];
    pageInfo: PageInfo;
  }>({
    products: [],
    pageInfo: { endCursor: "", hasNextPage: false, hasPreviousPage: false },
  });

  const {
    sort,
    q: searchValue,
    b: brand,
    c: category,
    t: tag,
    cursor,
  } = searchParams as {
    [key: string]: string;
  };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        let productsData;

        if (
          searchValue ||
          brand ||
          category ||
          tag ||
          cursor
        ) {
          let queryString = "";
          let filterCategoryProduct = [];

          if (searchValue) {
            queryString += ` ${searchValue}`;
          }

          if (brand) {
            Array.isArray(brand)
              ? (queryString += `${brand
                .map((b) => `(vendor:${b})`)
                .join(" OR ")}`)
              : (queryString += `vendor:"${brand}"`);

            if (Array.isArray(brand) && brand.length > 0) {
              brand.forEach((b) => {
                filterCategoryProduct.push({
                  productVendor: titleify(b),
                });
              });
            } else {
              filterCategoryProduct.push({
                productVendor: titleify(brand),
              });
            }
          }

          if (tag) {
            queryString += ` ${tag}`;

            filterCategoryProduct.push({
              tag: tag.charAt(0).toUpperCase() + tag.slice(1),
            });
          }

          const query = {
            sortKey,
            reverse,
            query: queryString,
          };

          productsData =
            category && category !== "all"
              ? await getCollectionProducts({
                collection: category,
                sortKey,
                reverse,
                filterCategoryProduct:
                  filterCategoryProduct.length > 0
                    ? filterCategoryProduct
                    : undefined,
              })
              : await getProducts({ ...query, cursor });
        } else {
          // Fetch all products
          productsData = await getProducts({ sortKey, reverse, cursor });
        }

        setData({
          products: productsData.products || [],
          pageInfo: productsData.pageInfo || { endCursor: "", hasNextPage: false, hasPreviousPage: false },
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        setData({
          products: [],
          pageInfo: { endCursor: "", hasNextPage: false, hasPreviousPage: false },
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent too many rapid requests
    const timeoutId = setTimeout(fetchData, 100);
    return () => clearTimeout(timeoutId);
  }, [
    cursor,
    sortKey,
    searchValue,
    brand,
    category,
    tag,
    reverse,
  ]);

  const { products, pageInfo } = data;
  const endCursor = pageInfo?.endCursor || "";
  const hasNextPage = pageInfo?.hasNextPage || false;

  useLoadMore(targetElementRef as React.RefObject<HTMLElement>, () => {
    if (hasNextPage && !isLoading) {
      fetchDataWithNewCursor(endCursor);
    }
  });

  const fetchDataWithNewCursor = async (newCursor: string) => {
    // setIsLoading(true);

    try {
      const res = await getProducts({
        sortKey,
        reverse,
        query: searchValue,
        cursor: newCursor,
      });

      setData({
        products: [...products, ...res.products],
        pageInfo: res.pageInfo,
      });
    } catch (error) {
      console.error("Error fetching more products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="row space-y-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="col-12">
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="row">
                <div className="col-4">
                  <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="col-8 p-4 lg:p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <section>
      <div ref={targetElementRef} className="row">
        {searchValue ? (
          <div className="col-12 mb-6">
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-4 lg:p-6">
              <p className="text-text-dark dark:text-darkmode-text-dark text-lg">
                {products.length === 0
                  ? "There are no products that match "
                  : `Showing ${products.length} ${resultsText} for `}
                <span className="font-bold text-primary">&quot;{searchValue}&quot;</span>
              </p>
            </div>
          </div>
        ) : null}

        {products?.length === 0 && (
          <div className="col-12">
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-8 lg:p-12 text-center">
              <ImageFallback
                className="mx-auto mb-6 w-[211px] h-[184px]"
                src="/images/no-search-found.png"
                alt="no-search-found"
                width={211}
                height={184}
              />
              <h1 className="text-2xl lg:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                No Product Found!
              </h1>
              <p className="text-text-light dark:text-darkmode-text-light text-lg">
                We couldn&apos;t find what you filtered for. Try filtering again.
              </p>
            </div>
          </div>
        )}

        <div className="row space-y-6">
          {products?.map((product: Product) => (
            <CustomizableProductListItem key={product.id} product={product} />
          ))}
        </div>

        <div className="col-12 mt-8">
          <div
            className={
              hasNextPage || isLoading
                ? "opacity-100 flex justify-center"
                : "opacity-0 hidden"
            }
          >
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-6">
              <BiLoaderAlt className="animate-spin text-primary" size={30} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListView;
