"use server";
import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "@/lib/constants";
import { isShopifyError } from "@/lib/typeGuards";
import { ensureStartsWith } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
  updateCartNoteMutation,
} from "./mutations/cart";
import {
  createCustomerMutation,
  getCustomerAccessTokenMutation,
  getUserDetailsQuery,
} from "./mutations/customer";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getMenuQuery } from "./queries/menu";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getAllTagsQuery,
  getHighestProductPriceQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import { getVendorsQuery } from "./queries/vendor";
import {
  getBlogsQuery,
  getBlogQuery,
  getBlogByHandleQuery,
  getArticleQuery,
  getArticleByHandleQuery,
} from "./queries/blog";
import {
  getLocalizationQuery,
  getProductsWithContextQuery,
  getProductWithContextQuery,
  getCollectionProductsWithContextQuery,
} from "./queries/localization";
import {
  Cart,
  Collection,
  Connection,
  CustomerInput,
  Image,
  Menu,
  Page,
  PageInfo,
  Product,
  Blog,
  Article,
  BlogOperation,
  BlogByHandleOperation,
  ArticleOperation,
  ArticleByHandleOperation,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCartNoteUpdateOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  registerOperation,
  user,
  userOperation,
} from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

export async function shopifyFetch<T>({
  cache = "no-store",
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      signal: controller.signal,
      ...(tags && { next: { tags } }),
    });

    clearTimeout(timeoutId);

    // Check if the response is ok
    if (!result.ok) {
      console.warn(`Shopify API HTTP error: ${result.status} - ${result.statusText}`);
      // Return empty data instead of throwing error
      return { 
        status: result.status, 
        body: { 
          data: {} 
        } as T
      };
    }

    // Ensure we have a response body
    if (!result.body) {
      console.warn("No response body received from Shopify API");
      return { 
        status: 200, 
        body: { 
          data: {} 
        } as T
      };
    }

    const body = await result.json();

    if (body.errors) {
      console.warn("Shopify API errors:", body.errors);
      // Return empty data instead of throwing error
      return { 
        status: 200, 
        body: { 
          data: {} 
        } as T
      };
    }

    return { status: result.status, body };
  } catch (e) {
    // Handle AbortError specifically
    if (e instanceof Error && e.name === 'AbortError') {
      console.warn("Shopify API request timeout");
      return { 
        status: 408, 
        body: { 
          data: {} 
        } as T
      };
    }

    if (isShopifyError(e)) {
      console.warn("Shopify API error:", {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
      });
      return { 
        status: e.status || 500, 
        body: { 
          data: {} 
        } as T
      };
    }

    // Enhanced error logging
    console.warn("Shopify fetch error:", {
      error: e instanceof Error ? e.message : "Unknown error",
      query: query.substring(0, 100) + "...", // Log first 100 chars of query
    });

    // Return empty data instead of throwing error
    return { 
      status: 500, 
      body: { 
        data: {} 
      } as T
    };
  }
}

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = { amount: "0.0", currencyCode: "USD" };
  }

  return { ...cart, lines: removeEdgesAndNodes(cart.lines) };
};

const reshapeCollection = (
  collection: ShopifyCollection,
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return { ...collection, path: `/products/${collection.handle}` };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true,
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function updateCartNote(cartId: string, note: string): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCartNoteUpdateOperation>({
    query: updateCartNoteMutation,
    variables: { cartId, note },
    cache: "no-store",
  });

  return reshapeCart(res.body.data.cartNoteUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    tags: [TAGS.cart],
    cache: "no-store",
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  filterCategoryProduct,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  filterCategoryProduct?: any[]; // Update the type based on your GraphQL schema
}): Promise<{ pageInfo: PageInfo | null; products: Product[] }> {
  try {
    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getCollectionProductsQuery,
      tags: [TAGS.collections, TAGS.products],
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
        filterCategoryProduct, // Pass the filters variable to the query
      } as {
        handle: string;
        reverse?: boolean;
        sortKey?: string;
        filterCategoryProduct?: any[];
      },
    });

    if (!res.body.data.collection) {
      console.warn(`No collection found for \`${collection}\``);
      return { pageInfo: null, products: [] };
    }

    // return reshapeProducts(removeEdgesAndNodes(res.body.data.collection.products));
    const pageInfo = res.body.data?.collection?.products?.pageInfo;

    return {
      pageInfo,
      products: reshapeProducts(
        removeEdgesAndNodes(res.body.data.collection.products),
      ),
    };
  } catch (error) {
    console.warn(`Error fetching collection products for "${collection}":`, error);
    return { pageInfo: null, products: [] };
  }
}

export async function createCustomer(input: CustomerInput): Promise<any> {
  const res = await shopifyFetch<registerOperation>({
    query: createCustomerMutation,
    variables: { input },
    cache: "no-store",
  });
  // console.log(res.body.data.customerCreate.customerUserErrors)

  const customer = res.body.data?.customerCreate?.customer;
  const customerCreateErrors =
    res.body.data?.customerCreate?.customerUserErrors;

  return { customer, customerCreateErrors };
}

export async function getCustomerAccessToken({
  email,
  password,
}: Partial<CustomerInput>): Promise<any> {
  const res = await shopifyFetch<any>({
    query: getCustomerAccessTokenMutation,
    variables: { input: { email, password } },
  });

  const token =
    res.body.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
  const customerLoginErrors =
    res?.body?.data?.customerAccessTokenCreate?.customerUserErrors;

  return { token, customerLoginErrors };
}

export async function getUserDetails(accessToken: string): Promise<user> {
  const response = await shopifyFetch<userOperation>({
    query: getUserDetailsQuery,
    variables: { input: accessToken },
    cache: "no-store",
  });

  return response.body.data;
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await shopifyFetch<ShopifyCollectionsOperation>({
      query: getCollectionsQuery,
      tags: [TAGS.collections],
    });
    
    if (!res.body?.data?.collections) {
      console.warn("No collections data received from Shopify API");
      return [];
    }
    
    const shopifyCollections = removeEdgesAndNodes(res.body.data.collections);
    const collections = [
      // Filter out the `hidden` collections.
      // Collections that start with `hidden-*` need to be hidden on the search page.
      ...reshapeCollections(shopifyCollections).filter(
        (collection) => !collection.handle.startsWith("hidden"),
      ),
    ];

    return collections;
  } catch (error) {
    console.warn("Error fetching collections:", error);
    return [];
  }
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: { handle },
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: { handle },
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: { productId },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getVendors({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<{ vendor: string; productCount: number }[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getVendorsQuery,
    tags: [TAGS.products],
    variables: { query, reverse, sortKey },
  });

  const products = removeEdgesAndNodes(res.body.data.products);

  // Create an array to store objects with vendor names and product counts
  const vendorProductCounts: { vendor: string; productCount: number }[] = [];

  // Process the products and count them by vendor
  products.forEach((product) => {
    const vendor = product.vendor;
    if (vendor) {
      // Check if the vendor is already in the array
      const existingVendor = vendorProductCounts.find(
        (v) => v.vendor === vendor,
      );

      if (existingVendor) {
        // Increment the product count for the existing vendor
        existingVendor.productCount++;
      } else {
        // Add a new vendor entry
        vendorProductCounts.push({ vendor, productCount: 1 });
      }
    }
  });

  return vendorProductCounts;
}

export async function getTags({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: { query, reverse, sortKey },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getAllTags(): Promise<string[]> {
  try {
    const res = await shopifyFetch<any>({
      query: getAllTagsQuery,
      tags: [TAGS.products],
    });

    const allTags = new Set<string>();
    
    res.body.data.products.edges.forEach((edge: any) => {
      if (edge.node.tags && Array.isArray(edge.node.tags)) {
        edge.node.tags.forEach((tag: string) => {
          if (tag && tag.trim() !== "") {
            allTags.add(tag);
          }
        });
      }
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error("Error fetching all tags:", error);
    return [];
  }
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  cursor,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  cursor?: string;
}): Promise<{ pageInfo: PageInfo; products: Product[] }> {
  try {
    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      tags: [TAGS.products],
      variables: { query, reverse, sortKey, cursor },
    });

    if (!res.body?.data?.products) {
      console.warn("No products data received from Shopify API");
      return {
        pageInfo: null,
        products: [],
      };
    }

    const pageInfo = res.body.data.products.pageInfo;

    return {
      pageInfo,
      products: reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
    };
  } catch (error) {
    console.warn("Error fetching products:", error);
    return {
      pageInfo: null,
      products: [],
    };
  }
}

export async function getHighestProductPrice(): Promise<{
  amount: string;
  currencyCode: string;
} | null> {
  try {
    const res = await shopifyFetch<any>({ query: getHighestProductPriceQuery });

    // Extract and return the relevant data
    const highestProduct = res?.body?.data?.products?.edges[0]?.node;
    const highestProductPrice = highestProduct?.variants?.edges[0]?.node?.price;

    return highestProductPrice || null;
  } catch (error) {
    console.log("Error fetching highest product price:", error);
    throw error;
  }
}

// Blog API Functions
export async function getBlogs({
  first = 10,
}: {
  first?: number;
} = {}): Promise<{ blogs: Blog[] }> {
  try {
    // Try to fetch blogs, but if it fails, return empty array
    const res = await shopifyFetch<BlogOperation>({
      query: getBlogsQuery,
      variables: { first },
    });

    if (!res.body?.data?.blogs) {
      console.warn("No blogs data found in response");
      return { blogs: [] };
    }

    return {
      blogs: res.body.data.blogs.edges.map((edge) => edge.node),
    };
  } catch (error) {
    console.warn("Error fetching blogs:", error);
    // Return empty array as fallback
    return { blogs: [] };
  }
}

export async function getBlog({
  handle,
  first = 10,
}: {
  handle: string;
  first?: number;
}): Promise<{
  blog: {
    id: string;
    title: string;
    handle: string;
    url: string;
    seo: {
      title: string;
      description: string;
    };
  } | null;
  articles: Article[];
}> {
  try {
    const res = await shopifyFetch<BlogByHandleOperation>({
      query: getBlogQuery,
      variables: { handle, first },
    });

    if (!res.body?.data?.blog) {
      console.warn(`No blog found with handle: ${handle}`);
      return { blog: null, articles: [] };
    }

    return {
      blog: {
        id: res.body.data.blog.id,
        title: res.body.data.blog.title,
        handle: res.body.data.blog.handle,
        url: res.body.data.blog.url,
        seo: res.body.data.blog.seo,
      },
      articles: res.body.data.blog.articles.edges.map((edge) => edge.node),
    };
  } catch (error) {
    console.warn(`Error fetching blog with handle ${handle}:`, error);
    return { blog: null, articles: [] };
  }
}

export async function getArticle({
  id,
}: {
  id: string;
}): Promise<Article | null> {
  try {
    const res = await shopifyFetch<ArticleOperation>({
      query: getArticleQuery,
      variables: { id },
    });

    if (!res.body?.data?.article) {
      console.warn(`No article found with id: ${id}`);
      return null;
    }

    return res.body.data.article;
  } catch (error) {
    console.warn(`Error fetching article with id ${id}:`, error);
    return null;
  }
}

export async function getArticleByHandle({
  handle,
}: {
  handle: string;
}): Promise<Article | null> {
  try {
    const res = await shopifyFetch<ArticleByHandleOperation>({
      query: getArticleByHandleQuery,
      variables: { handle },
    });

    if (!res.body?.data?.articleByHandle) {
      console.warn(`No article found with handle: ${handle}`);
      return null;
    }

    return res.body.data.articleByHandle;
  } catch (error) {
    console.warn(`Error fetching article with handle ${handle}:`, error);
    return null;
  }
}

// Function to get articles from a specific blog (fallback approach)
export async function getBlogArticles({
  blogHandle = "news", // Default blog handle
  first = 10,
}: {
  blogHandle?: string;
  first?: number;
} = {}): Promise<{ blog: Blog | null; articles: Article[] }> {
  try {
    const res = await getBlog({ handle: blogHandle, first });
    return res;
  } catch (error) {
    console.warn(`Error fetching blog articles from ${blogHandle}:`, error);
    return { blog: null, articles: [] };
  }
}

// Context-aware functions for multi-currency support - Hidden for now
/*
export async function getLocalization(countryCode?: string) {
  try {
    const res = await shopifyFetch({
      query: getLocalizationQuery,
      cache: 'no-store',
    });

    const body = res.body as any;
    
    if (!body?.data?.localization) {
      console.warn('No localization data received from Shopify API');
      return null;
    }

    return body.data.localization;
  } catch (error) {
    console.warn('Error fetching localization data:', error);
    return null;
  }
}
*/

/*
export async function getProductsWithContext({
  query,
  reverse,
  sortKey,
  cursor,
  countryCode = 'IN',
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  cursor?: string;
  countryCode?: string;
}): Promise<{ pageInfo: PageInfo; products: Product[] }> {
  try {
    const res = await shopifyFetch({
      query: getProductsWithContextQuery,
      tags: [TAGS.products],
      variables: { query, reverse, sortKey, cursor, countryCode },
      cache: 'no-store',
    });

    if (!res.body?.data?.products) {
      console.warn('No products data received from Shopify API');
      return {
        pageInfo: null,
        products: [],
      };
    }

    const pageInfo = res.body.data.products.pageInfo;

    return {
      pageInfo,
      products: reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
    };
  } catch (error) {
    console.warn('Error fetching products with context:', error);
    return {
      pageInfo: null,
      products: [],
    };
  }
}
*/

/*
export async function getProductWithContext(
  handle: string,
  countryCode: string = 'IN'
): Promise<Product | undefined> {
  try {
    const res = await shopifyFetch({
      query: getProductWithContextQuery,
      tags: [TAGS.products],
      variables: { handle, countryCode },
      cache: 'no-store',
    });

    return reshapeProduct(res.body.data.product, false);
  } catch (error) {
    console.warn('Error fetching product with context:', error);
    return undefined;
  }
}
*/

/*
export async function getCollectionProductsWithContext({
  collection,
  reverse,
  sortKey,
  countryCode = 'IN',
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  countryCode?: string;
}): Promise<{ pageInfo: PageInfo | null; products: Product[] }> {
  try {
    const res = await shopifyFetch({
      query: getCollectionProductsWithContextQuery,
      tags: [TAGS.collections, TAGS.products],
      variables: {
        handle: collection,
        reverse,
        sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
        countryCode,
      },
      cache: 'no-store',
    });

    if (!res.body.data.collection) {
      console.warn(`No collection found for \`${collection}\``);
      return { pageInfo: null, products: [] };
    }

    const pageInfo = res.body.data?.collection?.products?.pageInfo;

    return {
      pageInfo,
      products: reshapeProducts(
        removeEdgesAndNodes(res.body.data.collection.products),
      ),
    };
  } catch (error) {
    console.warn(`Error fetching collection products with context for "${collection}":`, error);
    return { pageInfo: null, products: [] };
  }
}
*/

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_API_SECRET_KEY) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
