"use client";

import { CartItem } from "@/lib/shopify/types";
import { removeItem } from "@/lib/utils/cartActions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FaTrash } from "react-icons/fa";
import LoadingDots from "../loadings/LoadingDots";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="Remove item from cart"
      className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full px-2 transition-all duration-200 hover:border-red-500 hover:opacity-80 disabled:cursor-not-allowed"
    >
      {pending ? (
        <LoadingDots className="bg-red-500" />
      ) : (
        <FaTrash className="h-4 w-4 text-red-500 hover:text-red-700" />
      )}
    </button>
  );
}

export function DeleteItemButton({ item }: { item: CartItem }) {
  const [message, formAction] = useActionState(removeItem, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="lineId" value={item.id} />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
