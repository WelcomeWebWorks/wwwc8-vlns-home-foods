export const getLocalizationQuery = /* GraphQL */ `
  query getLocalization {
    localization {
      availableCountries {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
      country {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
    }
  }
`;

export const getProductsWithContextQuery = /* GraphQL */ `
  query getProductsWithContext(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $cursor: String
    $countryCode: CountryCode
  ) @inContext(country: $countryCode) {
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
          compareAtPriceRange {
            maxVariantPrice {
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
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
          images(first: 20) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          seo {
            title
            description
          }
          tags
          updatedAt
          vendor
          collections(first: 100) {
            nodes {
              title
              products(first: 100) {
                edges {
                  node {
                    title
                    vendor
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductWithContextQuery = /* GraphQL */ `
  query getProductWithContext($handle: String!, $countryCode: CountryCode) @inContext(country: $countryCode) {
    product(handle: $handle) {
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
      compareAtPriceRange {
        maxVariantPrice {
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
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      seo {
        title
        description
      }
      tags
      updatedAt
      vendor
      collections(first: 100) {
        nodes {
          title
          products(first: 100) {
            edges {
              node {
                title
                vendor
              }
            }
          }
        }
      }
    }
  }
`;

export const getCollectionProductsWithContextQuery = /* GraphQL */ `
  query getCollectionProductsWithContext(
    $handle: String!
    $reverse: Boolean
    $sortKey: String
    $countryCode: CountryCode
  ) @inContext(country: $countryCode) {
    collection(handle: $handle) {
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: 12
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
        }
        edges {
          node {
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
            compareAtPriceRange {
              maxVariantPrice {
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
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            featuredImage {
              url
              altText
              width
              height
            }
            images(first: 20) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            seo {
              title
              description
            }
            tags
            updatedAt
            vendor
            collections(first: 100) {
              nodes {
                title
                products(first: 100) {
                  edges {
                    node {
                      title
                      vendor
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
