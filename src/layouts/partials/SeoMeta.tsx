"use client";

import config from "@/config/config.json";
import { plainify } from "@/lib/utils/textConverter";
import { usePathname } from "next/navigation";

const SeoMeta = ({
  title,
  meta_title,
  image,
  description,
  canonical,
  noindex,
  keywords,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  type = "website",
  locale = "en_IN",
  siteName,
  price,
  currency,
  availability,
  brand,
  category,
}: {
  title?: string;
  meta_title?: string;
  image?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  keywords?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  type?: string;
  locale?: string;
  siteName?: string;
  price?: string;
  currency?: string;
  availability?: string;
  brand?: string;
  category?: string;
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url, title: siteTitle } = config.site;
  const pathname = usePathname();
  
  const fullTitle = plainify(meta_title ? meta_title : title ? title : siteTitle);
  const fullDescription = plainify(description ? description : meta_description);
  const fullImage = `${base_url}${image ? image : meta_image}`;
  const fullUrl = `${base_url}${pathname === "/" ? "" : pathname}`;
  const fullSiteName = siteName || siteTitle;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} itemProp="url" />}
      {!canonical && <link rel="canonical" href={fullUrl} itemProp="url" />}

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {/* Basic Meta */}
      <meta name="description" content={fullDescription} />
      <meta name="author" content={author || meta_author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#800020" />
      <meta name="msapplication-TileColor" content="#800020" />

      {/* Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={fullSiteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Open Graph - Article specific */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && section && (
        <meta property="article:section" content={section} />
      )}
      {type === "article" && tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Open Graph - Product specific */}
      {type === "product" && price && (
        <meta property="product:price:amount" content={price} />
      )}
      {type === "product" && currency && (
        <meta property="product:price:currency" content={currency} />
      )}
      {type === "product" && availability && (
        <meta property="product:availability" content={availability} />
      )}
      {type === "product" && brand && (
        <meta property="product:brand" content={brand} />
      )}
      {type === "product" && category && (
        <meta property="product:category" content={category} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@vlnshomefoods" />
      <meta name="twitter:creator" content="@vlnshomefoods" />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="IN-AP" />
      <meta name="geo.placename" content="Guntur, Andhra Pradesh" />
      <meta name="geo.position" content="15.9129;80.1869" />
      <meta name="ICBM" content="15.9129, 80.1869" />
      
      {/* Business Information */}
      <meta name="business:contact_data:street_address" content="D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD" />
      <meta name="business:contact_data:locality" content="Guntur" />
      <meta name="business:contact_data:region" content="Andhra Pradesh" />
      <meta name="business:contact_data:postal_code" content="522235" />
      <meta name="business:contact_data:country_name" content="India" />
      <meta name="business:contact_data:phone_number" content="+91 9581154327" />
      <meta name="business:contact_data:email" content="info@vlnshomefoods.com" />
      <meta name="business:contact_data:website" content="https://vlnshomefoods.com" />

      {/* Language and Region */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN-AP" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Mobile and App */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="VLNS Home Foods" />

      {/* Favicon and Icons */}
      <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
    </>
  );
};

export default SeoMeta;
