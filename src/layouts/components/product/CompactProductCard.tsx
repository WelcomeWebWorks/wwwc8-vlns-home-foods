"use client";

import { EnhancedAddToCart } from "@/layouts/components/cart/EnhancedAddToCart";
import config from "@/config/config.json";
import { Product, ProductVariant } from "@/lib/shopify/types";
import ProductImageWithHover from "./ProductImageWithHover";
import Link from "next/link";
import { Suspense, useState, useMemo, useEffect } from "react";
import { useProductCartState, triggerCartUpdate } from "@/hooks/useProductCartState";
import { EditItemQuantityButton } from "@/layouts/components/cart/EditItemQuantityButton";
import { FaMinus, FaPlus, FaEye } from "react-icons/fa6";
import { updateItemQuantity } from "@/lib/utils/cartActions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import LoadingDots from "@/layouts/components/loadings/LoadingDots";
import { showToast } from "@/components/ui/Toast";

interface CompactProductCardProps {
  product: Product;
  className?: string;
}

// Quantity Control Components
function QuantityButton({
  type,
  disabled = false,
  onOptimisticClick
}: {
  type: "plus" | "minus";
  disabled?: boolean;
  onOptimisticClick?: () => void;
}) {
  const { pending } = useFormStatus();

  const handleClick = (e: React.FormEvent<HTMLButtonElement>) => {
    if (pending) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();

    // Optimistic update for immediate feedback
    if (onOptimisticClick && !disabled) {
      onOptimisticClick();
    }
  };

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      onClick={handleClick}
      onMouseDown={(e) => e.stopPropagation()}
      aria-label={type === "plus" ? "Increase quantity" : "Decrease quantity"}
      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full transition-all duration-200 ${
        disabled || pending
          ? "cursor-not-allowed opacity-50"
          : type === "minus"
            ? "bg-red-500 hover:bg-red-600 text-white hover:scale-105"
            : "bg-primary hover:bg-[#600018] text-white hover:scale-105"
      }`}
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : type === "plus" ? (
        <FaPlus className="h-3 w-3" />
      ) : (
        <FaMinus className="h-3 w-3" />
      )}
    </button>
  );
}

function QuantityControls({
  variantId,
  lineId,
  currentQuantity,
  productTitle
}: {
  variantId: string;
  lineId: string;
  currentQuantity: number;
  productTitle: string;
}) {
  const [messagePlus, formActionPlus] = useActionState(updateItemQuantity, null);
  const [messageMinus, formActionMinus] = useActionState(updateItemQuantity, null);
  const [previousQuantity, setPreviousQuantity] = useState(currentQuantity);

  // Track quantity changes for proper toast messaging
  useEffect(() => {
    setPreviousQuantity(currentQuantity);
  }, [currentQuantity]);

  // Only show red toast for complete removal, remove other toasts
  useEffect(() => {
    if (messagePlus === null) {
      // Just trigger cart update without toast for quantity increase
      triggerCartUpdate();
    }
  }, [messagePlus]);

  // Show red toast only when item is completely removed
  useEffect(() => {
    if (messageMinus === null) {
      if (currentQuantity === 0) {
        // Item was completely removed from cart - show red toast
        showToast(`❌ ${productTitle} removed from cart!`, "error", 3000);
      }
      // Always trigger cart update for immediate UI response
      triggerCartUpdate();
    }
  }, [messageMinus, productTitle, currentQuantity]);

  const handleOptimisticMinus = () => {
    // Remove optimistic toasts, just trigger immediate cart update
    triggerCartUpdate();
  };

  const handleOptimisticPlus = () => {
    // Remove optimistic toasts, just trigger immediate cart update
    triggerCartUpdate();
  };

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-darkmode-body rounded-lg p-1">
      <form action={formActionMinus}>
        <input type="hidden" name="lineId" value={lineId} />
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="quantity" value={Math.max(0, currentQuantity - 1)} />
        <QuantityButton
          type="minus"
          onOptimisticClick={handleOptimisticMinus}
        />
      </form>

      <span className="px-3 py-1 text-sm font-semibold text-text-dark dark:text-darkmode-text-dark min-w-[2rem] text-center">
        {currentQuantity}
      </span>

      <form action={formActionPlus}>
        <input type="hidden" name="lineId" value={lineId} />
        <input type="hidden" name="variantId" value={variantId} />
        <input type="hidden" name="quantity" value={currentQuantity + 1} />
        <QuantityButton
          type="plus"
          onOptimisticClick={handleOptimisticPlus}
        />
      </form>
    </div>
  );
}

const CompactProductCard = ({ product, className = "" }: CompactProductCardProps) => {
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
  const finalOptions = useMemo(() => ({ ...defaultOptions, ...selectedOptions }), [defaultOptions, selectedOptions]);

  // Find the variant that matches the selected options
  const currentVariant = useMemo(() => {
    return product.variants.find((variant: ProductVariant) => {
      return Object.entries(finalOptions).every(([optionName, optionValue]) => {
        return variant.selectedOptions.some(
          (selectedOption) =>
            selectedOption.name.toLowerCase() === optionName.toLowerCase() &&
            selectedOption.value === optionValue,
        );
      });
    });
  }, [product.variants, finalOptions]);

  // Get default variant ID for the AddToCart component
  const defaultVariantId = currentVariant?.id || product.variants.find(v => v.availableForSale)?.id || product.variants[0]?.id;

  // Get cart state for current variant
  const { isInCart, quantity: cartQuantity, lineId } = useProductCartState(defaultVariantId || "");

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

  // Render option selector - Always as buttons in rows (no dropdowns)
  const renderOptionSelector = (optionName: string) => {
    const option = product.options?.find(opt => opt.name === optionName);
    if (!option) return null;

    const currentValue = finalOptions[optionName.toLowerCase()] || option.values[0];

    // Always render as buttons in rows - no dropdowns
    return (
      <div className="mb-2">
        <label className="block text-xs font-medium text-text-dark dark:text-darkmode-text-dark mb-1">
          {optionName}:
        </label>
        <div className="flex flex-wrap gap-1">
          {option.values.map((value) => (
            <button
              key={value}
              onClick={(e) => {
                e.stopPropagation();
                handleOptionChange(optionName, value);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={`px-2 py-1 text-xs rounded border transition-all duration-200 font-medium min-w-[40px] ${
                currentValue === value
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-darkmode-body border-border dark:border-darkmode-border text-text-dark dark:text-darkmode-text-dark hover:border-primary"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`group relative z-10 bg-white dark:bg-darkmode-body rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden border border-border dark:border-darkmode-border hover:border-primary/30 w-full mx-auto ${className}`}>
      {/* Clickable Card Area */}
      <Link
        href={`/products/${product.handle}`}
        className="block cursor-pointer"
        onClick={(e) => {
          // Allow clicks on the card background, but prevent if clicking on interactive elements
          const target = e.target as HTMLElement;
          if (target.closest('button, select, form, input')) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {/* Compact Image Container */}
        <div className="relative overflow-hidden aspect-[3/2]">
          <ProductImageWithHover
            images={product.images}
            width={400}
            height={267}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            fallbackSrc="/images/product_image404.jpg"
          />

          {/* View Product Icon */}
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaEye className="w-4 h-4" />
          </div>

          {/* Sale Badge */}
          {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-[#600018] text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
              Sale
            </div>
          )}
        </div>

        {/* Compact Content Container */}
        <div className="p-3">
          {/* Product Title - Compact */}
          <h3 className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-2 line-clamp-2 leading-tight">
            {product.title}
          </h3>

          {/* Compact Options */}
          <div 
            className="space-y-2 mb-3"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {product.options?.map((option) => (
              <div key={option.id}>
                {renderOptionSelector(option.name)}
              </div>
            ))}
          </div>

          {/* Compact Price Display */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">
              {currencySymbol} {currentPrice?.amount}
            </span>
            {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
              <s className="text-text-light dark:text-darkmode-text-light text-sm">
                {currencySymbol} {currentCompareAtPrice.amount}
              </s>
            )}
          </div>

          {/* Cart Controls - Compact */}
          <div
            className="relative z-20"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isInCart && lineId ? (
              // Show quantity controls when product is in cart
              <div className="space-y-2">
                <div className="text-xs text-center text-green-600 dark:text-green-400 font-medium">
                  ✓ In Cart
                </div>
                <QuantityControls
                  variantId={defaultVariantId || ""}
                  lineId={lineId}
                  currentQuantity={cartQuantity}
                  productTitle={product.title}
                />
              </div>
            ) : (
              // Show Add to Cart button when product is not in cart
              <Suspense>
                <EnhancedAddToCart
                  variants={product.variants}
                  availableForSale={product.availableForSale}
                  handle={product.handle}
                  defaultVariantId={defaultVariantId}
                  productTitle={product.title}
                  stylesClass="w-full bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center text-sm"
                />
              </Suspense>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CompactProductCard;
