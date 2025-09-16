"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify/types";
import ProductImageWithHover from "./ProductImageWithHover";
import Link from "next/link";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import config from "@/config/config.json";
import QuickOrderPopup from "./QuickOrderPopup";
import { useProductCartState } from "@/hooks/useProductCartState";

interface EnhancedProductCardProps {
  product: Product;
  className?: string;
}

const EnhancedProductCard = ({ product, className = "" }: EnhancedProductCardProps) => {
  const { currencySymbol } = config.shopify;
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  // Get the first available variant for pricing
  const firstAvailableVariant = product.variants.find(v => v.availableForSale) || product.variants[0];
  const currentPrice = firstAvailableVariant?.price;
  const currentCompareAtPrice = firstAvailableVariant?.compareAtPrice;

  // Get default variant ID for cart state
  const defaultVariantId = firstAvailableVariant?.id;

  // Get cart state for current variant
  const { isInCart, quantity: cartQuantity } = useProductCartState(defaultVariantId || "");

  // Handle Quick Order
  const handleQuickOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickOrderOpen(true);
  };

  // Handle Add to Cart from popup
  const handleAddToCart = () => {
    setIsQuickOrderOpen(false);
  };

  return (
    <>
      <div className={`bg-white dark:bg-darkmode-body rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full ${className}`}>
        {/* Clickable Card Area */}
        <Link 
          href={`/products/${product.handle}`}
          className="block cursor-pointer"
        >
          {/* Product Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <ProductImageWithHover
              images={product.images}
              width={400}
              height={300}
              alt={product.title}
              className="w-full h-full object-cover"
              fallbackSrc="/images/product_image404.jpg"
            />

            {/* Sale Badge */}
            {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
              <div className="absolute top-3 left-3 bg-[#800020] text-white px-3 py-1 rounded-full text-sm font-bold">
                Sale
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Product Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-darkmode-text-dark mb-2 line-clamp-2" style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: '700'
            }}>
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl font-bold text-[#800020]" style={{
                fontFamily: "'Inter', 'Helvetica', sans-serif",
                fontWeight: '700'
              }}>
                {currencySymbol}{currentPrice?.amount || "0.00"}
              </span>
              {currentCompareAtPrice && parseFloat(currentCompareAtPrice.amount) > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {currencySymbol}{currentCompareAtPrice.amount}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Quick Order Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleQuickOrder}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm ${
              isInCart
                ? "bg-black text-white"
                : "bg-[#800020] text-white hover:bg-[#600018]"
            }`}
            style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: '600'
            }}
          >
            {isInCart ? (
              <span className="flex items-center justify-center space-x-2">
                <FaCheck className="w-4 h-4" />
                <span>In Cart ({cartQuantity})</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <FaShoppingCart className="w-4 h-4" />
                <span>Quick Order</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Order Popup */}
      <QuickOrderPopup
        product={product}
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default EnhancedProductCard;