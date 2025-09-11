import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import CartPageContent from "@/layouts/components/cart/CartPageContent";

export default async function CartPage() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartPageContent cart={cart} />;
}

