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
      <div className="mb-2">
        <label className="block text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-1">
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
          className="px-3 py-2 text-sm border-2 border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 min-w-[140px] sm:min-w-[160px] lg:min-w-[120px]"
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
    <div className={`col-12 relative z-10 bg-white dark:bg-darkmode-body rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}>
      <div className="row">
        <div className="col-4">
          <div className="relative overflow-hidden aspect-[4/3]">
            <ProductImageWithHover
              images={product.images}
              width={400}
              height={300}
              alt={product.title}
              className="w-full h-full object-cover rounded-l-2xl"
              fallbackSrc="/images/product_image404.jpg"
            />
            
            {/* Professional badge for sale items */}
            {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
              <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                Sale
              </div>
            )}
          </div>
        </div>

        <div className="col-8 p-4 lg:p-6">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl mb-3 text-text-dark dark:text-darkmode-text-dark">
            <Link 
              href={`/products/${product.handle}`}
              className="hover:text-primary transition-colors duration-200"
            >
              {product.title}
            </Link>
          </h2>

          {/* Customization Options - Professional styling */}
          {product.options && product.options.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3 relative z-10" onClick={handleDropdownClick}>
              {product.options.map((option) => (
                <div key={option.id}>
                  {renderOptionSelector(option.name)}
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Price Display - Professional styling */}
          <div className="flex items-center gap-x-3 mb-4">
            <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-primary">
              {currencySymbol} {currentPrice?.amount} {currentPrice?.currencyCode}
            </span>
            {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
              <s className="text-text-light dark:text-darkmode-text-light text-base sm:text-lg lg:text-lg font-medium">
                {currencySymbol} {currentCompareAtPrice.amount} {currentCompareAtPrice.currencyCode}
              </s>
            )}
          </div>

          <p className="text-text-light dark:text-darkmode-text-light mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {product.description}
          </p>

          <Suspense>
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              handle={product.handle}
              defaultVariantId={defaultVariantId}
              stylesClass="bg-primary hover:bg-[#600018] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CustomizableProductListItem;
