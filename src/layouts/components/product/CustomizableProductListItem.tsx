"use client";

import { AddToCart } from "@/components/cart/AddToCart";
import config from "@/config/config.json";
import { Product, ProductVariant } from "@/lib/shopify/types";
import ProductImageWithHover from "./ProductImageWithHover";
import Link from "next/link";
import { Suspense, useState, useMemo } from "react";

interface CustomizableProductListItemProps {
  product: Product;
  className?: string;
}

const CustomizableProductListItem = ({ product, className = "" }: CustomizableProductListItemProps) => {
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

  // Render option selector for list view (more compact)
  const renderOptionSelector = (optionName: string) => {
    const values = getOptionValues(optionName);
    const currentValue = currentOptions[optionName.toLowerCase()];

    if (values.length <= 1) return null; // Don't show if only one option

    return (
      <div className="mb-2 lg:mb-1">
        <label className="block text-sm sm:text-base lg:text-xs font-medium text-text-light dark:text-darkmode-text-light mb-1">
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
          className="px-3 py-2 lg:px-2 lg:py-1 text-sm sm:text-base lg:text-xs border border-border dark:border-darkmode-border rounded bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px] sm:min-w-[160px] lg:min-w-[120px]"
        >
          {values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const defaultVariantId = currentVariant?.id || product.variants[0]?.id;

  return (
    <div className={`col-12 relative z-10 ${className}`}>
      <div className="row">
        <div className="col-4">
          <ProductImageWithHover
            images={product.images}
            width={312}
            height={269}
            alt={product.title}
            className="w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[269px] object-cover border border-border dark:border-darkmode-border rounded-md"
            fallbackSrc="/images/product_image404.jpg"
          />
        </div>

        <div className="col-8 py-3 max-md:pt-4">
          <h2 className="font-bold md:font-normal text-base sm:text-lg lg:h4 mb-2">
            <Link href={`/products/${product.handle}`}>{product.title}</Link>
          </h2>

          {/* Customization Options - Mobile/Tablet Optimized */}
          {product.options && product.options.length > 0 && (
            <div className="mb-3 lg:mb-3 flex flex-wrap gap-2 lg:gap-3 relative z-10" onClick={handleDropdownClick}>
              {product.options.map((option) => (
                <div key={option.id}>
                  {renderOptionSelector(option.name)}
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Price Display */}
          <div className="flex items-center gap-x-2 mt-2 mb-3 lg:mb-4">
            <span className="text-text-light dark:text-darkmode-text-light text-sm sm:text-base lg:text-lg font-bold">
              {currencySymbol} {currentPrice?.amount} {currentPrice?.currencyCode}
            </span>
            {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
              <s className="text-text-light dark:text-darkmode-text-light text-xs sm:text-sm lg:text-base font-medium">
                {currencySymbol} {currentCompareAtPrice.amount} {currentCompareAtPrice.currencyCode}
              </s>
            )}
          </div>

          <p className="max-md:text-xs text-text-light dark:text-darkmode-text-light my-4 md:mb-8 line-clamp-1 md:line-clamp-3">
            {product.description}
          </p>

          <Suspense>
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              handle={product.handle}
              defaultVariantId={defaultVariantId}
              stylesClass="btn btn-outline-primary max-md:btn-sm drop-shadow-md"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CustomizableProductListItem;
