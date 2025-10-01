"use client";

import config from "@/config/config.json";

interface StructuredDataProps {
  type?: "Organization" | "Product" | "Article" | "BreadcrumbList" | "LocalBusiness";
  data?: any;
}

const StructuredData = ({ type = "Organization", data }: StructuredDataProps) => {
  const { base_url } = config.site;

  const getOrganizationData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VLNS Home Foods",
    "alternateName": "VLNS Home Foods",
    "url": base_url,
    "logo": `${base_url}/images/logo.png`,
    "description": "Authentic Andhra Pradesh flavors - homemade sweets, savory snacks, and spicy pickles. Experience the true essence of traditional Indian cooking with VLNS Home Foods.",
    "foundingDate": "2025",
    "founder": {
      "@type": "Person",
      "name": "VLNS Home Foods Team"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD",
      "addressLocality": "Guntur",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "522235",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9581154327",
      "contactType": "customer service",
      "email": "info@vlnshomefoods.com",
      "availableLanguage": ["English", "Telugu", "Hindi"]
    },
    "sameAs": [
      "https://vlnshomefoods.com",
      "https://www.facebook.com/vlnshomefoods",
      "https://www.instagram.com/vlnshomefoods",
      "https://wa.me/919581154327"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Andhra Pradesh Food Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Traditional Andhra Sweets"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Spicy Andhra Pickles"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Crispy Andhra Snacks"
          }
        }
      ]
    }
  });

  const getLocalBusinessData = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "VLNS Home Foods",
    "image": `${base_url}/images/logo.png`,
    "description": "Authentic Andhra Pradesh flavors - homemade sweets, savory snacks, and spicy pickles delivered to your doorstep.",
    "url": base_url,
    "telephone": "+91-9581154327",
    "email": "info@vlnshomefoods.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD",
      "addressLocality": "Guntur",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "522235",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "15.9129",
      "longitude": "80.1869"
    },
    "openingHours": [
      "Mo-Sa 09:00-20:00",
      "Su 10:00-18:00"
    ],
    "priceRange": "₹₹",
    "servesCuisine": "Indian",
    "paymentAccepted": "Cash, Credit Card, UPI, Net Banking",
    "currenciesAccepted": "INR",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  });

  const getProductData = (productData: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.title,
    "description": productData.description,
    "image": productData.images?.map((img: any) => img.url) || [],
    "brand": {
      "@type": "Brand",
      "name": "VLNS Home Foods"
    },
    "offers": {
      "@type": "Offer",
      "price": productData.price?.amount,
      "priceCurrency": productData.price?.currencyCode || "INR",
      "availability": productData.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "VLNS Home Foods"
      }
    },
    "category": "Food & Beverages",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Cuisine",
        "value": "Andhra Pradesh"
      },
      {
        "@type": "PropertyValue",
        "name": "Dietary Features",
        "value": "Traditional, Homemade"
      }
    ]
  });

  const getArticleData = (articleData: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.excerpt,
    "image": articleData.image?.url,
    "author": {
      "@type": "Organization",
      "name": "VLNS Home Foods"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VLNS Home Foods",
      "logo": {
        "@type": "ImageObject",
        "url": `${base_url}/images/logo.png`
      }
    },
    "datePublished": articleData.publishedAt,
    "dateModified": articleData.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${base_url}/blog/${articleData.handle}`
    }
  });

  const getBreadcrumbData = (breadcrumbs: any[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  });

  const getStructuredData = () => {
    switch (type) {
      case "Organization":
        return getOrganizationData();
      case "LocalBusiness":
        return getLocalBusinessData();
      case "Product":
        return getProductData(data);
      case "Article":
        return getArticleData(data);
      case "BreadcrumbList":
        return getBreadcrumbData(data);
      default:
        return getOrganizationData();
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
};

export default StructuredData;
