"use client";

import { AddToCart } from "./AddToCart";
import { ProductVariant } from "@/lib/shopify/types";
import { useCartState } from "@/hooks/useCartState";
import Link from "next/link";
import { FiShoppingCart, FiEye } from "react-icons/fi";

interface EnhancedCartButtonsProps {
  variants: ProductVariant[];
  availableForSale: boolean;
  handle?: string | null;
  defaultVariantId?: string;
  className?: string;
}

const EnhancedCartButtons: React.FC<EnhancedCartButtonsProps> = ({
  variants,
  availableForSale,
  handle,
  defaultVariantId,
  className = "",
}) => {
  const { hasItems, isLoading } = useCartState();

  const addToCartButtonClass = "flex-1 bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-base";
  
  const viewCartButtonClass = "flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-base";

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="w-full bg-gray-200 animate-pulse rounded-xl h-14"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {hasItems ? (
        // Show both buttons when cart has items
        <div className="flex flex-col sm:flex-row gap-4">
          <AddToCart
            variants={variants}
            availableForSale={availableForSale}
            stylesClass={addToCartButtonClass}
            handle={handle}
            defaultVariantId={defaultVariantId}
          />
          <Link
            href="/cart"
            className={viewCartButtonClass}
          >
            <FiEye className="w-5 h-5" />
            <span>View Cart</span>
          </Link>
        </div>
      ) : (
        // Show only Add to Cart when cart is empty
        <AddToCart
          variants={variants}
          availableForSale={availableForSale}
          stylesClass={`w-full ${addToCartButtonClass}`}
          handle={handle}
          defaultVariantId={defaultVariantId}
        />
      )}
    </div>
  );
};

export default EnhancedCartButtons;
