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
      // Render as buttons for 2-3 options
      return (
        <div className="mb-2">
          <label className="block text-xs font-medium text-text-light dark:text-darkmode-text-light mb-1">
            {optionName}:
          </label>
          <div className="flex gap-1 flex-wrap">
            {values.map((value) => (
              <button
                key={value}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionChange(optionName, value);
                }}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
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
      // Render as dropdown for 4+ options
      return (
        <div className="mb-2">
          <label className="block text-xs font-medium text-text-light dark:text-darkmode-text-light mb-1">
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
            className="w-full px-2 py-1 text-xs border border-border dark:border-darkmode-border rounded bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-1 focus:ring-primary"
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
      <div className="md:relative overflow-hidden">
        <ProductImageWithHover
          images={product.images}
          width={312}
          height={269}
          alt={product.title}
          className="w-full h-[200px] sm:w-[312px] md:h-[269px] object-cover rounded-md border mx-auto"
          fallbackSrc="/images/product_image404.jpg"
        />

        <Suspense>
          <AddToCart
            variants={product.variants}
            availableForSale={product.availableForSale}
            handle={product.handle}
            defaultVariantId={defaultVariantId}
            stylesClass="btn btn-primary max-md:btn-sm z-10 absolute bottom-24 md:bottom-0 left-1/2 transform -translate-x-1/2 md:translate-y-full md:group-hover:-translate-y-6 duration-300 ease-in-out whitespace-nowrap drop-shadow-md"
          />
        </Suspense>
      </div>

      <div className="py-2 md:py-4 text-center z-10">
        <h2 className="font-medium text-base md:text-xl mb-2">
          <Link
            className="after:absolute after:inset-0"
            href={`/products/${product.handle}`}
          >
            {product.title}
          </Link>
        </h2>

        {/* Customization Options */}
        {product.options && product.options.length > 0 && (
          <div className="mb-3 px-2 relative z-10" onClick={handleDropdownClick}>
            {product.options.map((option) => (
              <div key={option.id}>
                {renderOptionSelector(option.name)}
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Price Display */}
        <div className="flex flex-wrap justify-center items-center gap-x-2 mt-2 md:mt-4">
          <span className="text-base md:text-xl font-bold text-text-dark dark:text-darkmode-text-dark">
            {currencySymbol} {currentPrice?.amount} {currentPrice?.currencyCode}
          </span>
          {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
            <s className="text-text-light dark:text-darkmode-text-light text-xs md:text-base font-medium">
              {currencySymbol} {currentCompareAtPrice.amount} {currentCompareAtPrice.currencyCode}
            </s>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizableProductCard;
