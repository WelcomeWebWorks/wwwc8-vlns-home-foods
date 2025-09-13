import { getCart } from "@/lib/shopify";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      return NextResponse.json({
        totalQuantity: 0,
        hasItems: false,
      });
    }

    const cart = await getCart(cartId);

    if (!cart) {
      return NextResponse.json({
        totalQuantity: 0,
        hasItems: false,
      });
    }

    return NextResponse.json({
      totalQuantity: cart.totalQuantity || 0,
      hasItems: (cart.totalQuantity || 0) > 0,
      itemCount: cart.lines?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({
      totalQuantity: 0,
      hasItems: false,
    });
  }
}
