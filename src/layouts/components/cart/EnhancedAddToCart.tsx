"use client";

import { addItem } from "@/lib/utils/cartActions";
import { ProductVariant } from "@/lib/shopify/types";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { triggerCartUpdate } from "@/hooks/useProductCartState";
import { showToast } from "@/components/ui/Toast";

interface EnhancedAddToCartProps {
  variants: ProductVariant[];
  availableForSale: boolean;
  stylesClass?: string;
  handle?: string | null;
  defaultVariantId?: string;
  productTitle?: string;
}

function SubmitButton({
  availableForSale,
  selectedVariantId,
  stylesClass,
  onOptimisticAdd,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  stylesClass?: string;
  onOptimisticAdd?: () => void;
}) {
  const { pending } = useFormStatus();

  const handleClick = () => {
    // Optimistic update for faster UI response
    if (onOptimisticAdd && !pending) {
      onOptimisticAdd();
    }
  };

  return (
    <button
      type="submit"
      disabled={!availableForSale || !selectedVariantId || pending}
      onClick={handleClick}
      className={`${stylesClass || "btn btn-primary"} ${
        !availableForSale || !selectedVariantId || pending
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 transform transition-all duration-200"
      }`}
    >
      {pending ? (
        <>
          <BiLoaderAlt className="animate-spin w-4 h-4 mr-2" />
          Adding...
        </>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}

export function EnhancedAddToCart({
  variants,
  availableForSale,
  stylesClass,
  handle,
  defaultVariantId,
  productTitle = "Product",
}: EnhancedAddToCartProps) {
  const [message, formAction] = useActionState(addItem, null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically determine the selected variant based on URL parameters
  const selectedVariantId = useMemo(() => {
    if (!mounted) return defaultVariantId || variants[0]?.id;
    
    const selectedOptions = Array.from(searchParams.entries());

    // If no options are selected, use the default variant
    if (selectedOptions.length === 0) {
      return defaultVariantId || variants[0]?.id;
    }

    // Find variant that matches all selected options
    const variant = variants.find((variant: ProductVariant) =>
      selectedOptions.every(([key, value]) =>
        variant.selectedOptions.some(
          (option) => option.name.toLowerCase() === key && option.value === value,
        ),
      ),
    );

    return variant?.id || defaultVariantId || variants[0]?.id;
  }, [searchParams, variants, defaultVariantId, mounted]);

  // Only show error messages, remove success toasts to prevent bulk messages
  useEffect(() => {
    if (message && message.trim() !== "") {
      // Show error message with red toast
      showToast(`❌ Error: ${message}`, "error", 4000);
    } else if (message === null) {
      // Item was successfully added - trigger immediate cart update without toast
      triggerCartUpdate();
    }
  }, [message, productTitle]);

  const handleOptimisticAdd = () => {
    // Remove optimistic toast to prevent bulk messages
    // Just trigger immediate cart update for faster response
    triggerCartUpdate();
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <form>
        <button
          type="submit"
          disabled
          className="btn btn-primary max-md:btn-sm"
        >
          <BiLoaderAlt className="animate-spin" />
          Loading...
        </button>
      </form>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="selectedVariantId" value={selectedVariantId} />
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        stylesClass={stylesClass}
        onOptimisticAdd={handleOptimisticAdd}
      />
    </form>
  );
}
