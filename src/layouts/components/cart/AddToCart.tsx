"use client";

import { addItem } from "@/lib/utils/cartActions";
import { ProductVariant } from "@/lib/shopify/types";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { triggerCartUpdate } from "@/hooks/useProductCartState";

interface AddToCartProps {
  variants: ProductVariant[];
  availableForSale: boolean;
  stylesClass?: string;
  handle?: string | null;
  defaultVariantId?: string;
}

function SubmitButton({
  availableForSale,
  selectedVariantId,
  stylesClass,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  stylesClass?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!availableForSale || !selectedVariantId || pending}
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

export function AddToCart({
  variants,
  availableForSale,
  stylesClass,
  handle,
  defaultVariantId,
}: AddToCartProps) {
  const [message, formAction] = useActionState(addItem, null);
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger cart update when item is successfully added
  useEffect(() => {
    if (message === null) {
      // Item was successfully added (no error message)
      triggerCartUpdate();
    }
  }, [message]);

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
      />
      {message && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">{message}</p>
      )}
    </form>
  );
}
