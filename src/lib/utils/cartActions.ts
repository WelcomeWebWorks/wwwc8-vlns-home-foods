"use server";

import { TAGS } from "@/lib/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
  updateCartNote,
} from "@/lib/shopify";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function addItem(prevState: any, formData: FormData) {
  const selectedVariantId = formData.get("selectedVariantId") as string;
  
  let cartId = (await cookies()).get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    (await cookies()).set("cartId", cartId);
  }

  if (!selectedVariantId) {
    return "Missing product variant ID";
  }

  try {
    await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity: 1 },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, formData: FormData) {
  const lineId = formData.get("lineId") as string;
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  if (!lineId) {
    return "Missing line ID";
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  formData: FormData,
) {
  const cartId = (await cookies()).get("cartId")?.value;
  const lineId = formData.get("lineId") as string;
  const variantId = formData.get("variantId") as string;
  const quantity = parseInt(formData.get("quantity") as string);

  if (!cartId) {
    return "Missing cart ID";
  }

  if (!lineId || !variantId || isNaN(quantity)) {
    return "Missing required fields";
  }

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart(cartId, [
      { id: lineId, merchandiseId: variantId, quantity },
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error updating item quantity";
  }
}

export async function updateCartNoteAction(prevState: any, note: string) {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  try {
    await updateCartNote(cartId, note);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return "Error updating cart note";
  }
}
