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

    productsData =
      category && category !== "all"
        ? await getCollectionProducts({
          collection: category,
          sortKey,
          reverse,
        })
        : await getProducts(query);

    const uniqueVendors: string[] = [
      ...new Set(
        ((productsData?.products as Product[]) || []).map((product: Product) =>
          String(product?.vendor || ""),
        ),
      ),
    ];

    const uniqueCategories: string[] = [
      ...new Set(
        ((productsData?.products as Product[]) || []).flatMap(
          (product: Product) =>
            product.collections.nodes.map(
              (collectionNode: any) => collectionNode.title || "",
            ),
        ),
      ),
    ];

    // For query results, still calculate counts from ALL products to show accurate totals
    const allProductsForCounts = await getProducts({ sortKey, reverse });

    vendorsWithCounts = uniqueVendors.map((vendor: string) => {
      const productCount = (allProductsForCounts?.products || []).filter(
        (product: Product) => product?.vendor === vendor,
      ).length;
      return { vendor, productCount };
    });
    
    categoriesWithCounts = uniqueCategories.map((category: string) => {
      const productCount = ((allProductsForCounts?.products as Product[]) || []).filter(
        (product: Product) =>
          product.collections.nodes.some(
            (collectionNode: any) => collectionNode.title === category,
          ),
      ).length;
      return { category, productCount };
    });
  } else {
    // Fetch all products
    productsData = await getProducts({ sortKey, reverse, cursor });
    
  // Always calculate category and vendor counts from ALL products (not filtered)
  // This ensures counts remain accurate regardless of current filter
  const allProductsData = await getProducts({ sortKey, reverse });
  
  const uniqueVendors: string[] = [
    ...new Set(
      ((allProductsData?.products as Product[]) || []).map((product: Product) =>
        String(product?.vendor || ""),
      ),
    ),
  ];

  const uniqueCategories: string[] = [
    ...new Set(
      ((allProductsData?.products as Product[]) || []).flatMap(
        (product: Product) =>
          product.collections.nodes.map(
            (collectionNode: any) => collectionNode.title || "",
          ),
      ),
    ),
  ];

  vendorsWithCounts = uniqueVendors.map((vendor: string) => {
    const productCount = (allProductsData?.products || []).filter(
      (product: Product) => product?.vendor === vendor,
    ).length;
    return { vendor, productCount };
  });

  categoriesWithCounts = uniqueCategories.map((category: string) => {
    const productCount = ((allProductsData?.products as Product[]) || []).filter(
      (product: Product) =>
        product.collections.nodes.some(
          (collectionNode: any) => collectionNode.title === category,
        ),
    ).length;
    return { category, productCount };
  });
  }
  
  // Fetch categories and vendors with error handling
  let categories: any[] = [];
  let vendors: any[] = [];
  
  try {
    categories = await getCollections();
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
    <div className="login-bg min-h-screen">
      {/* <PageHeader title={"Products"} /> */}
      <Suspense fallback={<LoadingProducts />}>
        <ShowProducts searchParams={searchParams} />
      </Suspense>

      <CallToAction data={callToAction} />
    </div>
  );
};

export default ProductsListPage;
