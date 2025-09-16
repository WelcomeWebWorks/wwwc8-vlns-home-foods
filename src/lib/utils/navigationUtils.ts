/**
 * Navigation utility functions for checking active states
 */

/**
 * Check if a category is currently active based on URL parameters
 * @param pathname - Current pathname
 * @param searchParams - URL search parameters
 * @param categoryKeywords - Keywords to match against
 * @returns boolean indicating if category is active
 */
export const isCategoryActive = (
  pathname: string,
  searchParams: URLSearchParams,
  categoryKeywords: string[]
): boolean => {
  // Check if we're on the products page
  if (pathname !== '/products') {
    return false;
  }

  // Get category parameter from URL
  const categoryParam = searchParams.get('c');
  if (!categoryParam) {
    return false;
  }

  // Check if any of the category keywords match the category parameter
  return categoryKeywords.some(keyword =>
    categoryParam.toLowerCase().includes(keyword.toLowerCase()) ||
    keyword.toLowerCase().includes(categoryParam.toLowerCase())
  );
};

/**
 * Check if a tag is currently active based on URL parameters
 * @param pathname - Current pathname
 * @param searchParams - URL search parameters
 * @param tagKeywords - Keywords to match against
 * @returns boolean indicating if tag is active
 */
export const isTagActive = (
  pathname: string,
  searchParams: URLSearchParams,
  tagKeywords: string[]
): boolean => {
  // Check if we're on the products page
  if (pathname !== '/products') {
    return false;
  }

  // Get tag parameter from URL
  const tagParam = searchParams.get('t');
  if (!tagParam) {
    return false;
  }

  // Check if any of the tag keywords match the tag parameter
  return tagKeywords.some(keyword =>
    tagParam.toLowerCase().includes(keyword.toLowerCase()) ||
    keyword.toLowerCase().includes(tagParam.toLowerCase())
  );
};

/**
 * Check if "All Products" should be highlighted
 * @param pathname - Current pathname
 * @param searchParams - URL search parameters
 * @returns boolean indicating if All Products is active
 */
export const isAllProductsActive = (
  pathname: string,
  searchParams: URLSearchParams
): boolean => {
  // Check if we're on the products page
  if (pathname !== '/products') {
    return false;
  }

  // Check if there are no category or tag filters
  const categoryParam = searchParams.get('c');
  const tagParam = searchParams.get('t');
  const searchParam = searchParams.get('q');
  const brandParam = searchParams.get('b');

  // All Products is active if we're on /products with no filters
  return !categoryParam && !tagParam && !searchParam && !brandParam;
};

/**
 * Create URL for category filtering
 * @param categoryHandle - Category handle to filter by
 * @returns URL string for category filtering
 */
export const createCategoryUrl = (categoryHandle: string): string => {
  const params = new URLSearchParams();
  params.set('c', categoryHandle);
  return `/products?${params.toString()}`;
};

/**
 * Create URL for tag filtering
 * @param tag - Tag to filter by
 * @returns URL string for tag filtering
 */
export const createTagUrl = (tag: string): string => {
  const params = new URLSearchParams();
  params.set('t', tag);
  return `/products?${params.toString()}`;
};
