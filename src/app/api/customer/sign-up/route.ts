import { createCustomer, getCustomerAccessToken } from "@/lib/shopify";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const { customer, customerCreateErrors } = await createCustomer(input);
    const { token } = await getCustomerAccessToken(input);

    if (customerCreateErrors && customerCreateErrors.length > 0) {
      return NextResponse.json(
        { errors: customerCreateErrors },
        { status: 400 },
      );
    }
    
    const cookieStore = await cookies();
    cookieStore.set("token", token);

    return NextResponse.json({ ...customer, token });
  } catch (error: any) {
    console.error("Sign-up API error:", error);
    
    // Handle different error types
    if (error.error && error.error.message && error.error.status) {
      const { message, status } = error.error;
      return NextResponse.json(
        { errors: [{ code: "INTERNAL_ERROR", message }] },
        { status },
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { errors: [{ code: "INTERNAL_ERROR", message: "An unexpected error occurred" }] },
      { status: 500 },
    );
  }
}
