import LoadingProducts from "@/components/loadings/skeleton/SkeletonProducts";
import ProductLayouts from "@/components/product/ProductLayouts";
import { defaultSort, sorting } from "@/lib/constants";
import { getListPage } from "@/lib/contentParser";
import {
  getAllTags,
  getCollectionProducts,
  getCollections,
  getProducts,
  getVendors,
} from "@/lib/shopify";
import { PageInfo, Product } from "@/lib/shopify/types";
import CallToAction from "@/partials/CallToAction";
import ProductCardView from "@/partials/ProductCardView";
import ProductFilters from "@/partials/ProductFilters";
import ProductListView from "@/partials/ProductListView";
import { Suspense } from "react";

interface SearchParams {
  sort?: string;
  q?: string;
  b?: string;
  c?: string;
  t?: string;
}

const ShowProducts = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const {
    sort,
    q: searchValue,
    b: brand,
    c: category,
    t: tag,
  } = searchParams as {
    [key: string]: string;
  };

  const { layout, cursor } = searchParams as { [key: string]: string };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  let productsData: any;
  let vendorsWithCounts: { vendor: string; productCount: number }[] = [];
  let categoriesWithCounts: { category: string; productCount: number }[] = [];

  // Always fetch all products first to calculate accurate static counts
  const allProductsForCounts = await getProducts({ sortKey, reverse });

  if (searchValue || brand || category || tag) {
    let queryString = "";

    if (searchValue) {
      queryString += ` ${searchValue}`;
    }

    if (brand) {
      Array.isArray(brand)
        ? (queryString += `${brand.map((b) => `(vendor:${b})`).join(" OR ")}`)
        : (queryString += `vendor:"${brand}"`);
    }

    if (tag) {
      queryString += ` ${tag}`;
    }

    const query = {
      sortKey,
      reverse,
      query: queryString,
      cursor,
    };

    // Check if category exists before trying to fetch collection products
    if (category && category !== "all") {
      try {
        // First, get all collections to check if the category exists
        const allCollections = await getCollections();
        const categoryExists = allCollections.some(
          (collection) => collection.handle === category
        );

        if (categoryExists) {
          productsData = await getCollectionProducts({
            collection: category,
            sortKey,
            reverse,
          });
        } else {
          // If category doesn't exist, fall back to search with category name
          console.warn(`Collection "${category}" not found, falling back to search`);
          const searchQuery = queryString ? `${queryString} ${category}` : category;
          productsData = await getProducts({
            sortKey,
            reverse,
            query: searchQuery,
            cursor,
          });
        }
      } catch (error) {
        console.error(`Error fetching collection "${category}":`, error);
        // Fall back to search with category name
        const searchQuery = queryString ? `${queryString} ${category}` : category;
        productsData = await getProducts({
          sortKey,
          reverse,
          query: searchQuery,
          cursor,
        });
      }
    } else {
      productsData = await getProducts(query);
    }
  } else {
    // Fetch all products
    productsData = await getProducts({ sortKey, reverse, cursor });
  }

  // Calculate vendor counts from all products
  const uniqueVendors: string[] = [
    ...new Set(
      ((allProductsForCounts?.products as Product[]) || []).map((product: Product) =>
        String(product?.vendor || ""),
      ),
    ),
  ];

  vendorsWithCounts = uniqueVendors.map((vendor: string) => {
    const productCount = (allProductsForCounts?.products || []).filter(
      (product: Product) => product?.vendor === vendor,
    ).length;
    return { vendor, productCount };
  });
  
  // Fetch categories and vendors with error handling
  let categories: any[] = [];
  let vendors: any[] = [];
  
  try {
    categories = await getCollections();
    // Calculate category counts from actual collection data (like home page)
    categoriesWithCounts = categories.map((category: any) => ({
      category: category.title,
      productCount: category.products?.edges?.length || 0
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
  
  try {
    vendors = await getVendors({});
  } catch (error) {
    console.error("Error fetching vendors:", error);
  }

  // Fetch all available tags from all products
  let tags: string[] = [];
  try {
    tags = await getAllTags();
  } catch (error) {
    console.error("Error fetching all tags:", error);
    // Fallback to extracting tags from current products
    tags = [
      ...new Set(
        (
          productsData as { pageInfo: PageInfo; products: Product[] }
        )?.products?.flatMap((product: Product) => product.tags || []) || [],
      ),
    ];
  }

  // Debug logging for tags
  console.log("All available tags:", tags);
  console.log("Number of tags:", tags.length);
  console.log("Products count:", productsData?.products?.length || 0);

  return (
    <>
      <Suspense>
        <ProductLayouts
          categories={categories || []}
          vendors={vendors || []}
          tags={tags || []}
          vendorsWithCounts={vendorsWithCounts || []}
          categoriesWithCounts={categoriesWithCounts || []}
        />
      </Suspense>

      <div className="container">
        <div className="row">
          <div className="col-3 hidden lg:block -mt-14">
            <Suspense>
              <ProductFilters
                categories={categories || []}
                vendors={vendors || []}
                tags={tags || []}
                vendorsWithCounts={vendorsWithCounts || []}
                categoriesWithCounts={categoriesWithCounts || []}
              />
            </Suspense>
          </div>

          <div className="col-12 lg:col-9">
            {layout === "list" ? (
              <ProductListView searchParams={searchParams} />
            ) : (
              <ProductCardView searchParams={searchParams} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ProductsListPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  const searchParams = await props.searchParams;
  const callToAction = getListPage("sections/call-to-action.md");

  return (
    <div className="login-bg min-h-screen mobile-products-spacing">
      {/* <PageHeader title={"Products"} /> */}
      <Suspense fallback={<LoadingProducts />}>
        <ShowProducts searchParams={searchParams} />
      </Suspense>

      <CallToAction data={callToAction} />
    </div>
  );
};

export default ProductsListPage;
