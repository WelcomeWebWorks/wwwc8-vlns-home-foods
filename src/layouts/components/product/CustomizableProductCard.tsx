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
      // Render as buttons for 2-3 options - Professional styling
      return (
        <div className="mb-3">
          <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2">
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
                className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200 font-medium min-w-[70px] ${
                  currentValue === value
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white dark:bg-darkmode-body border-border dark:border-darkmode-border text-text-dark dark:text-darkmode-text-dark hover:border-primary hover:text-primary"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      );
    } else {
      // Render as dropdown for 4+ options - Professional styling
      return (
        <div className="mb-3">
          <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2">
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
            className="w-full px-4 py-2 text-sm border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
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
    <div className={`group relative z-10 bg-white dark:bg-darkmode-body rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden border border-border dark:border-darkmode-border hover:border-primary/30 ${className}`}>
      {/* Image Container - Enhanced Professional styling */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <ProductImageWithHover
          images={product.images}
          width={400}
          height={300}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          fallbackSrc="/images/product_image404.jpg"
        />

        {/* Enhanced badge for sale items */}
        {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-[#600018] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Sale</span>
            </span>
          </div>
        )}

        {/* Hover overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Enhanced Content Container */}
      <div className="p-5 lg:p-7">
        {/* Product Title */}
        <h2 className="font-bold text-lg sm:text-xl lg:text-xl mb-4 text-text-dark dark:text-darkmode-text-dark line-clamp-2 group-hover:text-primary transition-colors duration-300">
          <Link
            className="hover:text-primary transition-colors duration-200 after:absolute after:inset-0"
            href={`/products/${product.handle}`}
          >
            {product.title}
          </Link>
        </h2>

        {/* Enhanced Customization Options */}
        {product.options && product.options.length > 0 && (
          <div className="mb-5 relative z-10" onClick={handleDropdownClick}>
            {product.options.map((option) => (
              <div key={option.id}>
                {renderOptionSelector(option.name)}
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Price Display */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 mb-5">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-primary bg-gradient-to-r from-primary to-[#600018] bg-clip-text text-transparent">
              {currencySymbol} {currentPrice?.amount}
            </span>
            <span className="text-xs text-text-light dark:text-darkmode-text-light font-medium">
              {currentPrice?.currencyCode}
            </span>
          </div>
          {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
            <div className="flex flex-col items-center">
              <s className="text-text-light dark:text-darkmode-text-light text-base sm:text-lg lg:text-lg font-medium">
                {currencySymbol} {currentCompareAtPrice.amount}
              </s>
              <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                Save {currencySymbol}{(parseFloat(currentCompareAtPrice.amount) - parseFloat(currentPrice?.amount || "0")).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Add to Cart Button */}
        <div className="mt-5">
          <Suspense>
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              handle={product.handle}
              defaultVariantId={defaultVariantId}
              stylesClass="w-full bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CustomizableProductCard;
