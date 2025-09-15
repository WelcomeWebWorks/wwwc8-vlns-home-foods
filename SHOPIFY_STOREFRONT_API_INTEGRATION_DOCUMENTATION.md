# Shopify Storefront API Integration Documentation
## VLNS Home Foods E-commerce Application

### Table of Contents
1. [API Architecture Overview](#api-architecture-overview)
2. [Configuration & Authentication](#configuration--authentication)
3. [GraphQL Query Structure](#graphql-query-structure)
4. [Data Flow Workflow](#data-flow-workflow)
5. [TypeScript Type System](#typescript-type-system)
6. [Frontend Component Integration](#frontend-component-integration)
7. [Caching & Performance](#caching--performance)
8. [Error Handling](#error-handling)
9. [Server Actions & Cart Management](#server-actions--cart-management)

---

## API Architecture Overview

The VLNS Home Foods application uses a **headless e-commerce architecture** with Shopify as the backend and Next.js 15 as the frontend. The integration follows these key principles:

### Core Architecture Components:
- **Shopify Storefront API**: GraphQL-based API for headless commerce
- **Next.js 15 App Router**: Server-side rendering with React Server Components
- **TypeScript**: Full type safety across the entire data flow
- **Server Actions**: For cart operations and mutations
- **Edge Caching**: Next.js caching with revalidation tags

### API Endpoint Configuration:
```typescript
// src/lib/shopify/index.ts
const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
```

---

## Configuration & Authentication

### Environment Variables:
```env
SHOPIFY_STORE_DOMAIN="[your-store].myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN="your-storefront-access-token"
SHOPIFY_API_SECRET_KEY="your-api-secret-key"
```

### Authentication Headers:
```typescript
headers: {
  "Content-Type": "application/json",
  "X-Shopify-Storefront-Access-Token": key,
  ...headers,
}
```

### Configuration Constants:
```typescript
// src/lib/constants.ts
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";
export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
```

---

## GraphQL Query Structure

### Core Fetch Function:
```typescript
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
}): Promise<{ status: number; body: T } | never>
```

### Product Queries:

#### 1. Single Product Query:
```graphql
query getProduct($handle: String!) {
  product(handle: $handle) {
    ...product
  }
}
```

#### 2. Products List Query:
```graphql
query getProducts(
  $sortKey: ProductSortKeys
  $reverse: Boolean
  $query: String
  $cursor: String
) {
  products(
    sortKey: $sortKey
    reverse: $reverse
    query: $query
    first: 12
    after: $cursor
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
    }
    edges {
      node {
        ...product
      }
    }
  }
}
```

#### 3. Product Fragment:
```graphql
fragment product on Product {
  id
  handle
  availableForSale
  title
  description
  descriptionHtml
  options {
    id
    name
    values
  }
  priceRange {
    maxVariantPrice {
      amount
      currencyCode
    }
    minVariantPrice {
      amount
      currencyCode
    }
  }
  variants(first: 250) {
    edges {
      node {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
  featuredImage {
    ...image
  }
  images(first: 20) {
    edges {
      node {
        ...image
      }
    }
  }
  tags
  vendor
  collections(first: 100) {
    nodes {
      title
    }
  }
}
```

### Collection Queries:

#### 1. Collections List:
```graphql
query getCollections {
  collections(first: 100, sortKey: TITLE) {
    edges {
      node {
        ...collection
      }
    }
  }
}
```

#### 2. Collection Products:
```graphql
query getCollectionProducts(
  $handle: String!
  $sortKey: ProductCollectionSortKeys
  $reverse: Boolean
  $filterCategoryProduct: [ProductFilter!]
) {
  collection(handle: $handle) {
    products(
      sortKey: $sortKey
      reverse: $reverse
      first: 100
      filters: $filterCategoryProduct
    ) {
      edges {
        node {
          ...product
        }
      }
    }
  }
}
```

### Cart Operations:

#### 1. Cart Query:
```graphql
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    ...cart
  }
}
```

#### 2. Cart Fragment:
```graphql
fragment cart on Cart {
  id
  checkoutUrl
  note
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            product {
              ...product
            }
          }
        }
      }
    }
  }
  totalQuantity
}
```

#### 3. Cart Mutations:
```graphql
# Create Cart
mutation createCart($lineItems: [CartLineInput!]) {
  cartCreate(input: { lines: $lineItems }) {
    cart {
      ...cart
    }
  }
}

# Add to Cart
mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ...cart
    }
  }
}

# Update Cart
mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...cart
    }
  }
}

# Remove from Cart
mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...cart
    }
  }
}
```

---

## Data Flow Workflow

### 1. Server-Side Data Fetching (RSC):
```typescript
// src/app/products/[slug]/page.tsx
const ShowProductSingle = async ({ params }: { params: { slug: string } }) => {
  const product = await getProduct(params.slug);
  
  if (!product) return notFound();
  
  const {
    id,
    title,
    description,
    priceRange,
    images,
    variants,
    tags,
  } = product;
  
  // Render product details...
};
```

### 2. Data Transformation Pipeline:
```typescript
// Raw Shopify Response → Transformed Data
const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true): Product | undefined => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
  };
};

const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};
```

### 3. Frontend Component Consumption:
```typescript
// src/layouts/components/product/CustomizableProductCard.tsx
interface CustomizableProductCardProps {
  product: Product;
  className?: string;
}

const CustomizableProductCard: React.FC<CustomizableProductCardProps> = ({
  product,
  className = "",
}) => {
  const { title, handle, images, priceRange, variants } = product;
  
  return (
    <div className="product-card">
      <Link href={`/products/${handle}`}>
        <Image src={images[0]?.url} alt={title} />
        <h3>{title}</h3>
        <Price amount={priceRange.minVariantPrice.amount} />
      </Link>
    </div>
  );
};
```

---

## TypeScript Type System

### Core Data Types:
```typescript
// src/lib/shopify/types.ts

export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  tags: string[];
  vendor: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  compareAtPrice?: Money;
};

export type Cart = Omit<ShopifyCart, "lines"> & {
  lines: CartItem[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};
```

### Operation Types:
```typescript
export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};
```

---

## Frontend Component Integration

### 1. Product Listing Page:
```typescript
// src/app/products/page.tsx
const ShowProducts = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { sort, q: searchValue, c: category } = searchParams;
  
  let productsData: any;
  
  if (category && category !== "all") {
    productsData = await getCollectionProducts({
      collection: category,
      sortKey,
      reverse,
    });
  } else {
    productsData = await getProducts({ sortKey, reverse, cursor });
  }
  
  const { products, pageInfo } = productsData;
  
  return (
    <div className="product-grid">
      {products.map((product: Product) => (
        <CustomizableProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### 2. Product Detail Page:
```typescript
// src/app/products/[slug]/page.tsx
const ShowProductSingle = async ({ params }: { params: { slug: string } }) => {
  const product = await getProduct(params.slug);
  
  return (
    <div className="product-detail">
      <ProductGallery images={product.images} />
      <div className="product-info">
        <h1>{product.title}</h1>
        <DynamicPrice priceRange={product.priceRange} />
        <EnhancedVariantSelector 
          options={product.options}
          variants={product.variants}
        />
        <EnhancedCartButtons 
          variants={product.variants}
          availableForSale={product.availableForSale}
        />
      </div>
    </div>
  );
};
```

### 3. Cart Components:
```typescript
// src/layouts/components/cart/Cart.tsx
export default async function Cart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <OpenCart quantity={cart?.totalQuantity} />;
}
```

---

## Caching & Performance

### 1. Next.js Cache Tags:
```typescript
export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

// Usage in queries
const res = await shopifyFetch<ShopifyProductOperation>({
  query: getProductQuery,
  tags: [TAGS.products],
  variables: { handle },
});
```

### 2. Cache Revalidation:
```typescript
// src/lib/utils/cartActions.ts
export async function addItem(prevState: any, formData: FormData) {
  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}
```

### 3. Webhook Revalidation:
```typescript
// src/lib/shopify/index.ts
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true });
}
```

---

## Error Handling

### 1. Shopify Fetch Error Handling:
```typescript
export async function shopifyFetch<T>({ ... }): Promise<{ status: number; body: T } | never> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return { status: result.status, body };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw {
        error: new Error('Request timeout'),
        query,
      };
    }

    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "unknown",
        status: e.status || 500,
        message: e.message,
        query,
      };
    }

    throw { error: e, query };
  }
}
```

### 2. Type Guards:
```typescript
// src/lib/typeGuards.ts
export function isShopifyError(error: any): error is ShopifyError {
  return error && typeof error.message === 'string';
}
```

---

## Server Actions & Cart Management

### 1. Cart Server Actions:
```typescript
// src/lib/utils/cartActions.ts
"use server";

export async function addItem(prevState: any, formData: FormData) {
  const selectedVariantId = formData.get("selectedVariantId") as string;
  
  let cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    (await cookies()).set("cartId", cartId);
  }

  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}
```

### 2. Client-Side Cart State:
```typescript
// src/hooks/useCartState.ts
export const useCartState = (): CartState => {
  const [cartState, setCartState] = useState<CartState>({
    hasItems: false,
    itemCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    const checkCartState = async () => {
      const cartId = getCookie('cartId');
      
      if (!cartId) {
        setCartState({
          hasItems: false,
          itemCount: 0,
          isLoading: false,
        });
        return;
      }

      const response = await fetch('/api/cart');
      const cartData = await response.json();
      
      setCartState({
        hasItems: cartData.totalQuantity > 0,
        itemCount: cartData.totalQuantity || 0,
        isLoading: false,
      });
    };

    checkCartState();
  }, []);

  return cartState;
};
```

### 3. Cart API Route:
```typescript
// src/app/api/cart/route.ts
export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json({
        totalQuantity: 0,
        hasItems: false,
      });
    }

    const cart = await getCart(cartId);

    return NextResponse.json({
      totalQuantity: cart.totalQuantity || 0,
      hasItems: (cart.totalQuantity || 0) > 0,
      itemCount: cart.lines?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({
      totalQuantity: 0,
      hasItems: false,
    });
  }
}
```

---

## Summary

This documentation provides a complete overview of the Shopify Storefront API integration in the VLNS Home Foods e-commerce application. The architecture follows modern best practices with:

- **Type-safe GraphQL operations** with comprehensive TypeScript types
- **Server-side rendering** with React Server Components
- **Efficient caching** with Next.js revalidation tags
- **Robust error handling** with timeout and retry mechanisms
- **Real-time cart management** with server actions and client-side state
- **Performance optimization** through strategic data fetching and caching

The system provides a seamless, fast, and reliable e-commerce experience while maintaining full type safety and excellent developer experience.

---

## Complete Data Flow Examples

### Example 1: Product Listing Page Data Flow

#### Step 1: Server Component Data Fetching
```typescript
// src/app/products/page.tsx
const ShowProducts = async ({ searchParams }: { searchParams: SearchParams }) => {
  // 1. Parse search parameters
  const { sort, q: searchValue, c: category, t: tag } = searchParams;

  // 2. Determine sort configuration
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  // 3. Fetch data based on filters
  let productsData: any;

  if (searchValue || category || tag) {
    // Build GraphQL query string
    let queryString = "";
    if (searchValue) queryString += ` ${searchValue}`;
    if (category) queryString += `vendor:"${category}"`;
    if (tag) queryString += ` ${tag}`;

    // Fetch filtered products
    productsData = category && category !== "all"
      ? await getCollectionProducts({ collection: category, sortKey, reverse })
      : await getProducts({ sortKey, reverse, query: queryString });
  } else {
    // Fetch all products
    productsData = await getProducts({ sortKey, reverse });
  }

  // 4. Extract products and pagination info
  const { products, pageInfo } = productsData;

  // 5. Render components with data
  return (
    <div className="product-grid-responsive">
      {products.map((product: Product) => (
        <CustomizableProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

#### Step 2: GraphQL Query Execution
```typescript
// src/lib/shopify/index.ts
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
  // 1. Execute GraphQL query
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: { query, reverse, sortKey, cursor },
  });

  // 2. Extract and transform data
  const pageInfo = res.body.data?.products?.pageInfo;

  return {
    pageInfo,
    products: reshapeProducts(removeEdgesAndNodes(res.body.data.products)),
  };
}
```

#### Step 3: Data Transformation
```typescript
const reshapeProducts = (products: ShopifyProduct[]): Product[] => {
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

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true): Product | undefined => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants),
  };
};
```

#### Step 4: Frontend Component Rendering
```typescript
// src/layouts/components/product/CustomizableProductCard.tsx
const CustomizableProductCard: React.FC<CustomizableProductCardProps> = ({
  product,
  className = "",
}) => {
  // 1. Extract product data
  const { title, handle, images, priceRange, variants, availableForSale } = product;

  // 2. Calculate default variant
  const defaultVariantId = variants.length > 0 ? variants[0]?.id : null;

  // 3. Render product card
  return (
    <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Product Image */}
      <Link href={`/products/${handle}`}>
        <ProductImageWithHover
          images={images}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-dark mb-2">{title}</h3>
        <DynamicPrice priceRange={priceRange} currencySymbol="₹" />

        {/* Add to Cart */}
        <Suspense>
          <AddToCart
            variants={variants}
            availableForSale={availableForSale}
            handle={handle}
            defaultVariantId={defaultVariantId}
          />
        </Suspense>
      </div>
    </div>
  );
};
```

### Example 2: Cart Operations Data Flow

#### Step 1: Add to Cart Server Action
```typescript
// src/lib/utils/cartActions.ts
export async function addItem(prevState: any, formData: FormData) {
  // 1. Extract form data
  const selectedVariantId = formData.get("selectedVariantId") as string;

  // 2. Get or create cart
  let cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    (await cookies()).set("cartId", cartId);
  }

  // 3. Validate input
  if (!selectedVariantId) {
    return "Missing product variant ID";
  }

  // 4. Execute add to cart mutation
  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}
```

#### Step 2: GraphQL Cart Mutation
```typescript
// src/lib/shopify/index.ts
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  // 1. Execute GraphQL mutation
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  // 2. Transform and return cart data
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}
```

#### Step 3: Cart State Management
```typescript
// src/hooks/useCartState.ts
export const useCartState = (): CartState => {
  const [cartState, setCartState] = useState<CartState>({
    hasItems: false,
    itemCount: 0,
    isLoading: true,
  });

  useEffect(() => {
    const checkCartState = async () => {
      try {
        // 1. Check for cart ID in cookies
        const cartId = getCookie('cartId');

        if (!cartId) {
          setCartState({
            hasItems: false,
            itemCount: 0,
            isLoading: false,
          });
          return;
        }

        // 2. Fetch cart data from API
        const response = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 3. Update state based on response
        if (response.ok) {
          const cartData = await response.json();
          setCartState({
            hasItems: cartData.totalQuantity > 0,
            itemCount: cartData.totalQuantity || 0,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking cart state:', error);
        setCartState({
          hasItems: false,
          itemCount: 0,
          isLoading: false,
        });
      }
    };

    checkCartState();

    // 4. Listen for cart updates
    const handleCartUpdate = () => {
      checkCartState();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  return cartState;
};
```

### Example 3: Product Detail Page Data Flow

#### Step 1: Server-Side Product Fetching
```typescript
// src/app/products/[slug]/page.tsx
const ShowProductSingle = async ({ params }: { params: { slug: string } }) => {
  // 1. Fetch product data
  const product = await getProduct(params.slug);

  // 2. Handle not found
  if (!product) return notFound();

  // 3. Extract product properties
  const {
    id,
    title,
    description,
    descriptionHtml,
    priceRange,
    compareAtPriceRange,
    images,
    options,
    variants,
    tags,
  } = product;

  // 4. Fetch related data
  const paymentsAndDelivery = getListPage("sections/payments-and-delivery.md");
  const { payment_methods, estimated_delivery } = paymentsAndDelivery.frontmatter;

  // 5. Calculate default variant
  const defaultVariantId = variants.length > 0 ? variants[0]?.id : null;

  // 6. Render product detail page
  return (
    <section className="py-16">
      <div className="container">
        <div className="row">
          {/* Product Gallery */}
          <div className="col-12 lg:col-6">
            <Suspense fallback={<LoadingProductGallery />}>
              <ProductGallery images={images} />
            </Suspense>
          </div>

          {/* Product Information */}
          <div className="col-12 lg:col-6">
            <ProductDetailContent product={product}>
              <div></div>
            </ProductDetailContent>

            {/* Price Display */}
            <div className="mb-6">
              <DynamicPrice
                priceRange={priceRange}
                compareAtPriceRange={compareAtPriceRange}
                currencySymbol={currencySymbol}
              />
            </div>

            {/* Variant Selection */}
            <div className="mb-6">
              <EnhancedVariantSelector
                options={options}
                variants={variants}
                defaultVariantId={defaultVariantId}
              />
            </div>

            {/* Cart Buttons */}
            <div className="mb-8">
              <Suspense>
                <EnhancedCartButtons
                  variants={variants}
                  availableForSale={product.availableForSale}
                  handle={null}
                  defaultVariantId={defaultVariantId}
                />
              </Suspense>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h5 className="text-xl font-bold mb-4">Secure Payment Methods</h5>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {payment_methods?.map((payment: { name: string; image_url: string }) => (
                  <div key={payment.name} className="bg-white border rounded-2xl p-4">
                    <Image
                      src={payment.image_url}
                      alt={payment.name}
                      width={64}
                      height={48}
                      className="w-full h-[48px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

#### Step 2: Product Query Execution
```typescript
// src/lib/shopify/index.ts
export async function getProduct(handle: string): Promise<Product | undefined> {
  // 1. Execute GraphQL query
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: { handle },
  });

  // 2. Transform and return product data
  return reshapeProduct(res.body.data.product, false);
}
```

#### Step 3: Enhanced Variant Selector Component
```typescript
// src/layouts/components/product/EnhancedVariantSelector.tsx
export const EnhancedVariantSelector: React.FC<EnhancedVariantSelectorProps> = ({
  options,
  variants,
  defaultVariantId,
}) => {
  // 1. State management
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // 2. Initialize default selections
  useEffect(() => {
    if (options.length > 0 && variants.length > 0) {
      const defaultVariant = variants.find(v => v.id === defaultVariantId) || variants[0];

      if (defaultVariant) {
        const initialSelections: { [key: string]: string } = {};
        defaultVariant.selectedOptions.forEach(option => {
          initialSelections[option.name] = option.value;
        });
        setSelectedOptions(initialSelections);
        setSelectedVariant(defaultVariant);
      }
    }
  }, [options, variants, defaultVariantId]);

  // 3. Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    const newSelections = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newSelections);

    // Find matching variant
    const matchingVariant = variants.find(variant =>
      variant.selectedOptions.every(option =>
        newSelections[option.name] === option.value
      )
    );

    setSelectedVariant(matchingVariant || null);
  };

  // 4. Render option selectors
  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id} className="space-y-3">
          <h4 className="text-lg font-semibold text-text-dark">
            {option.name}
          </h4>

          {option.name.toLowerCase() === 'color' ? (
            // Color swatches
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    selectedOptions[option.name] === value
                      ? 'border-primary scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: value.toLowerCase() }}
                  title={value}
                />
              ))}
            </div>
          ) : (
            // Regular buttons
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`min-h-[60px] md:min-h-[65px] lg:min-h-[70px] px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                    selectedOptions[option.name] === value
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  <span className="text-sm md:text-base lg:text-lg font-semibold">
                    {value}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Selected variant info */}
      {selectedVariant && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            Selected: {selectedVariant.title}
          </p>
          <p className="text-lg font-bold text-primary">
            ₹{selectedVariant.price.amount}
          </p>
        </div>
      )}
    </div>
  );
};
```

---

## Performance Optimization Strategies

### 1. Strategic Caching Implementation
```typescript
// Different cache strategies for different data types
const productCache = {
  // Static product data - cache for 1 hour
  products: { cache: "force-cache", next: { revalidate: 3600 } },

  // Dynamic cart data - no cache
  cart: { cache: "no-store" },

  // Collection data - cache with tags for selective revalidation
  collections: { cache: "force-cache", tags: [TAGS.collections] }
};
```

### 2. Optimized GraphQL Queries
```typescript
// Fetch only required fields to minimize payload
const optimizedProductFragment = /* GraphQL */ `
  fragment productCard on Product {
    id
    handle
    title
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    availableForSale
  }
`;

// Use pagination for large datasets
const paginatedProductsQuery = /* GraphQL */ `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ...productCard
        }
      }
    }
  }
  ${optimizedProductFragment}
`;
```

### 3. Client-Side Performance
```typescript
// Lazy loading for non-critical components
const LazyProductRecommendations = lazy(() => import('./ProductRecommendations'));

// Optimistic updates for cart operations
const optimisticAddToCart = (product: Product) => {
  // Update UI immediately
  setCartItems(prev => [...prev, { ...product, quantity: 1 }]);

  // Then sync with server
  addToCartAction(product.variants[0].id)
    .catch(() => {
      // Revert on error
      setCartItems(prev => prev.filter(item => item.id !== product.id));
    });
};
```

---

## Advanced Integration Patterns

### 1. Real-time Cart Synchronization
```typescript
// Custom hook for cart synchronization across tabs
export const useCartSync = () => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartUpdated') {
        // Refresh cart data when updated in another tab
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
};

// Trigger cart sync across tabs
export const syncCartAcrossTabs = () => {
  localStorage.setItem('cartUpdated', Date.now().toString());
  localStorage.removeItem('cartUpdated');
};
```

### 2. Error Recovery Mechanisms
```typescript
// Retry mechanism for failed requests
const retryShopifyFetch = async <T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
};
```

### 3. Type-Safe Environment Configuration
```typescript
// Environment validation with TypeScript
interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiSecretKey: string;
}

const validateShopifyConfig = (): ShopifyConfig => {
  const config = {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
  };

  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  return config as ShopifyConfig;
};
```

This comprehensive documentation now provides complete understanding of the Shopify Storefront API integration workflow, from initial configuration through advanced optimization patterns. The system architecture ensures type safety, performance, and maintainability while delivering an excellent user experience for the VLNS Home Foods e-commerce application.
