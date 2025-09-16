// Note: The Storefront API doesn't support querying all blogs directly
// We'll use a specific blog handle approach instead
export const getBlogsQuery = /* GraphQL */ `
  query getBlogs($first: Int!) {
    blogs(first: $first) {
      edges {
        node {
          id
          title
          handle
          url
          seo {
            title
            description
          }
        }
      }
    }
  }
`;

export const getBlogQuery = /* GraphQL */ `
  query getBlog($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      id
      title
      handle
      url
      seo {
        title
        description
      }
      articles(first: $first) {
        edges {
          node {
            id
            title
            handle
            excerpt
            content
            contentHtml
            publishedAt
            updatedAt
            author: authorV2
            tags
            url
            seo {
              title
              description
            }
            image {
              url
              altText
              width
              height
            }
            blog {
              id
              title
              handle
            }
          }
        }
      }
    }
  }
`;

export const getBlogByHandleQuery = /* GraphQL */ `
  query getBlogByHandle($handle: String!) {
    blog(handle: $handle) {
      id
      title
      handle
      url
      seo {
        title
        description
      }
    }
  }
`;

export const getArticleQuery = /* GraphQL */ `
  query getArticle($id: ID!) {
    article(id: $id) {
      id
      title
      handle
      excerpt
      content
      contentHtml
      publishedAt
      updatedAt
      author: authorV2
      tags
      url
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      blog {
        id
        title
        handle
      }
    }
  }
`;

export const getArticleByHandleQuery = /* GraphQL */ `
  query getArticleByHandle($handle: String!) {
    article(handle: $handle) {
      id
      title
      handle
      excerpt
      content
      contentHtml
      publishedAt
      updatedAt
      author: authorV2
      tags
      url
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      blog {
        id
        title
        handle
      }
    }
  }
`;
