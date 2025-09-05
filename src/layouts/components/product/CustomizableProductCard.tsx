"use client";

import { AddToCart } from "@/components/cart/AddToCart";
import config from "@/config/config.json";
import { Product, ProductVariant } from "@/lib/shopify/types";
import ProductImageWithHover from "./ProductImageWithHover";
import Link from "next/link";
import { Suspense, useState, useMemo } from "react";

interface CustomizableProductCardProps {
  product: Product;
  className?: string;
}

const CustomizableProductCard = ({ product, className = "" }: CustomizableProductCardProps) => {
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

  // Get the current price (from selected variant or fallback to first available variant)
  const currentPrice = currentVariant?.price || product.variants.find(v => v.availableForSale)?.price || product.variants[0]?.price;
  const currentCompareAtPrice = currentVariant?.compareAtPrice;

  // Handle option selection
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName.toLowerCase()]: value
    }));
  };

  // Prevent event bubbling to avoid triggering the product link
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDropdownMouseDown = (e: React.MouseEvent) => {
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

  // Render option selector based on number of values
  const renderOptionSelector = (optionName: string) => {
    const values = getOptionValues(optionName);
    const currentValue = currentOptions[optionName.toLowerCase()];

    if (values.length <= 1) return null; // Don't show if only one option

    if (values.length <= 3) {
      // Render as buttons for 2-3 options - Mobile/Tablet optimized
      return (
        <div className="mb-3 lg:mb-2">
          <label className="block text-sm sm:text-base lg:text-xs font-medium text-text-light dark:text-darkmode-text-light mb-2 lg:mb-1">
            {optionName}:
          </label>
          <div className="flex gap-2 lg:gap-1 flex-wrap justify-center lg:justify-start">
            {values.map((value) => (
              <button
                key={value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionChange(optionName, value);
                }}
                className={`px-3 py-2 lg:px-2 lg:py-1 text-sm sm:text-base lg:text-xs rounded border transition-colors min-w-[60px] lg:min-w-0 ${
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
      // Render as dropdown for 4+ options - Mobile/Tablet optimized
      return (
        <div className="mb-3 lg:mb-2">
          <label className="block text-sm sm:text-base lg:text-xs font-medium text-text-light dark:text-darkmode-text-light mb-2 lg:mb-1">
            {optionName}:
          </label>
          <select
            value={currentValue}
            onChange={(e) => {
              e.stopPropagation();
              handleOptionChange(optionName, e.target.value);
            }}
            onClick={handleDropdownClick}
            onMouseDown={handleDropdownMouseDown}
            className="w-full px-3 py-2 lg:px-2 lg:py-1 text-sm sm:text-base lg:text-xs border border-border dark:border-darkmode-border rounded bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-1 focus:ring-primary"
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
    <div className={`text-center group relative z-10 ${className}`}>
      {/* Image Container - Desktop hover effect, Mobile static */}
      <div className="lg:relative overflow-hidden">
        <ProductImageWithHover
          images={product.images}
          width={312}
          height={269}
          alt={product.title}
          className="w-full h-[200px] sm:h-[220px] md:h-[240px] lg:h-[269px] object-cover rounded-md border mx-auto"
          fallbackSrc="/images/product_image404.jpg"
        />

        {/* Add to Cart Button - Desktop only (hover effect) */}
        <div className="hidden lg:block">
          <Suspense>
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              handle={product.handle}
              defaultVariantId={defaultVariantId}
              stylesClass="btn btn-primary z-10 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:-translate-y-6 duration-300 ease-in-out whitespace-nowrap drop-shadow-md"
            />
          </Suspense>
        </div>
      </div>

      {/* Content Container */}
      <div className="py-3 lg:py-4 text-center z-10">
        {/* Product Title */}
        <h2 className="font-medium text-base sm:text-lg lg:text-xl mb-3 lg:mb-2">
          <Link
            className="after:absolute after:inset-0"
            href={`/products/${product.handle}`}
          >
            {product.title}
          </Link>
        </h2>

        {/* Customization Options - Mobile/Tablet Optimized */}
        {product.options && product.options.length > 0 && (
          <div className="mb-4 lg:mb-3 px-3 lg:px-2 relative z-10" onClick={handleDropdownClick}>
            {product.options.map((option) => (
              <div key={option.id}>
                {renderOptionSelector(option.name)}
              </div>
            ))}
          </div>
        )}

        {/* Price Display */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 mb-4 lg:mb-0 lg:mt-2">
          <span className="text-lg sm:text-xl lg:text-xl font-bold text-text-dark dark:text-darkmode-text-dark">
            {currencySymbol} {currentPrice?.amount} {currentPrice?.currencyCode}
          </span>
          {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
            <s className="text-text-light dark:text-darkmode-text-light text-sm sm:text-base lg:text-base font-medium">
              {currencySymbol} {currentCompareAtPrice.amount} {currentCompareAtPrice.currencyCode}
            </s>
          )}
        </div>

        {/* Add to Cart Button - Mobile/Tablet only */}
        <div className="lg:hidden">
          <Suspense>
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              handle={product.handle}
              defaultVariantId={defaultVariantId}
              stylesClass="btn btn-primary w-full sm:w-auto sm:px-6 py-3 text-sm sm:text-base font-medium z-10"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CustomizableProductCard;
