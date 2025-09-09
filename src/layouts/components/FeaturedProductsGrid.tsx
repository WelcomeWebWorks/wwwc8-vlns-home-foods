"use client";

import { AddToCart } from "@/components/cart/AddToCart";
import config from "@/config/config.json";
import { Product, ProductVariant } from "@/lib/shopify/types";
import ProductImageWithHover from "./product/ProductImageWithHover";
import Link from "next/link";
import { Suspense, useState, useMemo } from "react";

interface FeaturedProductsGridProps {
  products: Product[];
}

const FeaturedProductsGrid = ({ products }: FeaturedProductsGridProps) => {
  const { currencySymbol } = config.shopify;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((product: Product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-8 md:mt-12">
        <Link
          className="btn btn-primary btn-lg font-semibold px-8 py-4"
          href={"/products"}
        >
          View All Products
          <svg 
            className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
};

interface FeaturedProductCardProps {
  product: Product;
}

const FeaturedProductCard = ({ product }: FeaturedProductCardProps) => {
  const { currencySymbol } = config.shopify;
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Initialize default selections for each option
  const defaultOptions = useMemo(() => {
    const defaults: Record<string, string> = {};
    product.options?.forEach((option) => {
      if (option.values.length > 0) {
        defaults[option.name.toLowerCase()] = option.values[0];
      }
    });
    return defaults;
  }, [product.options]);

  // Merge default options with selected options
  const currentOptions = { ...defaultOptions, ...selectedOptions };

  // Find the current variant based on selected options
  const currentVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.availableForSale &&
      Object.entries(currentOptions).every(([optionName, optionValue]) =>
        variant.selectedOptions.some(
          (selectedOption) =>
            selectedOption.name.toLowerCase() === optionName &&
            selectedOption.value === optionValue
        )
      )
    );
  }, [product.variants, currentOptions]);

  // Get the current price
  const currentPrice = currentVariant?.price || product.variants.find(v => v.availableForSale)?.price || product.variants[0]?.price;
  const currentCompareAtPrice = currentVariant?.compareAtPrice;

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName.toLowerCase()]: value
    }));
  };

  // Prevent event bubbling
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Get unique values for each option
  const getOptionValues = (optionName: string) => {
    const values = new Set<string>();
    product.variants.forEach((variant) => {
      const option = variant.selectedOptions.find(
        (opt) => opt.name.toLowerCase() === optionName.toLowerCase()
      );
      if (option && variant.availableForSale) {
        values.add(option.value);
      }
    });
    return Array.from(values);
  };

  // Render option selector
  const renderOptionSelector = (optionName: string) => {
    const values = getOptionValues(optionName);
    const currentValue = currentOptions[optionName.toLowerCase()];

    if (values.length <= 1) return null;

    if (values.length <= 3) {
      return (
        <div className="mb-3">
          <label className="block text-sm font-medium text-text-light dark:text-darkmode-text-light mb-2">
            {optionName}:
          </label>
          <div className="flex gap-2 flex-wrap justify-center">
            {values.map((value) => (
              <button
                key={value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionChange(optionName, value);
                }}
                className={`px-3 py-2 text-sm rounded border transition-colors min-w-[60px] ${
                  currentValue === value
                    ? "bg-primary text-white border-primary"
                    : "bg-white dark:bg-darkmode-body border-border dark:border-darkmode-border text-text-dark dark:text-darkmode-text-dark hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="mb-3">
          <label className="block text-sm font-medium text-text-light dark:text-darkmode-text-light mb-2">
            {optionName}:
          </label>
          <select
            value={currentValue}
            onChange={(e) => {
              e.stopPropagation();
              handleOptionChange(optionName, e.target.value);
            }}
            onClick={handleDropdownClick}
            className="w-full px-3 py-2 text-sm border border-border dark:border-darkmode-border rounded bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {values.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      );
    }
  };

  const defaultVariantId = currentVariant?.id || product.variants[0]?.id;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-darkmode-light">
        {/* Image Container */}
        <div className="relative h-64 md:h-64 lg:h-72 overflow-hidden">
          <ProductImageWithHover
            images={product.images}
            width={600}
            height={400}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackSrc="/images/product_image404.jpg"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Shop Now Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              href={`/products/${product.handle}`}
              className="bg-primary hover:bg-[#600018] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center"
            >
              Shop Now
              <svg 
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark mb-3 group-hover:text-primary transition-colors duration-300">
            <Link href={`/products/${product.handle}`}>
              {product.title}
            </Link>
          </h3>

          {/* Customization Options */}
          {product.options && product.options.length > 0 && (
            <div className="mb-4" onClick={handleDropdownClick}>
              {product.options.map((option) => (
                <div key={option.id}>
                  {renderOptionSelector(option.name)}
                </div>
              ))}
            </div>
          )}

          {/* Price Display */}
          <div className="flex flex-wrap justify-center items-center gap-x-2 mb-4">
            <span className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark">
              {currencySymbol} {currentPrice?.amount} {currentPrice?.currencyCode}
            </span>
            {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
              <s className="text-text-light dark:text-darkmode-text-light text-sm font-medium">
                {currencySymbol} {currentCompareAtPrice.amount} {currentCompareAtPrice.currencyCode}
              </s>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="w-full">
            <Suspense>
              <AddToCart
                variants={product.variants}
                availableForSale={product.availableForSale}
                handle={product.handle}
                defaultVariantId={defaultVariantId}
                stylesClass="btn btn-primary w-full py-3 font-semibold"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsGrid;
