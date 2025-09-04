"use client";

import { ProductVariant } from "@/lib/shopify/types";
import config from "@/config/config.json";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface DynamicPriceProps {
  variants: ProductVariant[];
  defaultVariantId?: string;
  className?: string;
}

export function DynamicPrice({ variants, defaultVariantId, className = "" }: DynamicPriceProps) {
  const searchParams = useSearchParams();
  const { currencySymbol } = config.shopify;

  // Find the currently selected variant based on URL parameters
  const selectedVariant = useMemo(() => {
    const selectedOptions = Array.from(searchParams.entries());
    
    // If no options are selected, use the default variant
    if (selectedOptions.length === 0) {
      return variants.find(variant => variant.id === defaultVariantId) || variants[0];
    }

    // Find variant that matches all selected options
    const variant = variants.find((variant: ProductVariant) =>
      selectedOptions.every(([key, value]) =>
        variant.selectedOptions.some(
          (option) => option.name.toLowerCase() === key && option.value === value,
        ),
      ),
    );

    // Fallback to default variant if no match found
    return variant || variants.find(variant => variant.id === defaultVariantId) || variants[0];
  }, [searchParams, variants, defaultVariantId]);

  if (!selectedVariant) {
    return null;
  }

  const price = selectedVariant.price;
  const compareAtPrice = selectedVariant.compareAtPrice;

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <h4 className="text-text-light dark:text-darkmode-text-light max-md:h2">
        {currencySymbol} {price.amount} {price.currencyCode}
      </h4>
      {compareAtPrice && parseFloat(compareAtPrice.amount) > 0 && (
        <s className="text-text-light max-md:h3 dark:text-darkmode-text-light">
          {currencySymbol} {compareAtPrice.amount} {compareAtPrice.currencyCode}
        </s>
      )}
    </div>
  );
}
