"use client";

import { addItem } from "@/lib/utils/cartActions";
import { ProductVariant } from "@/lib/shopify/types";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { BiLoaderAlt } from "react-icons/bi";

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
  const selectedVariantId = defaultVariantId || variants[0]?.id;

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
