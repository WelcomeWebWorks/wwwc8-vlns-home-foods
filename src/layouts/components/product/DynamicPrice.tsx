"use client";

import { ProductVariant } from "@/lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useCurrency } from '@/contexts/CurrencyContext';

interface DynamicPriceProps {
  variants: ProductVariant[];
  defaultVariantId?: string;
  className?: string;
}

export function DynamicPrice({ variants, defaultVariantId, className = "" }: DynamicPriceProps) {
  const searchParams = useSearchParams();
  const { formatPrice, getCurrencySymbol } = useCurrency();

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
  const currencySymbol = getCurrencySymbol(price.currencyCode);

  return (
    <div className={`flex gap-3 items-center ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-3xl md:text-4xl font-bold text-primary">
          {formatPrice(price.amount, price.currencyCode)}
        </span>
      </div>
      {compareAtPrice && parseFloat(compareAtPrice.amount) > 0 && (
        <div className="flex flex-col">
          <s className="text-lg text-text-light dark:text-darkmode-text-light">
            {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
          </s>
          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
            Save {currencySymbol}{(parseFloat(compareAtPrice.amount) - parseFloat(price.amount)).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
