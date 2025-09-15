"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/lib/shopify/types";

interface ProductCartState {
  isInCart: boolean;
  quantity: number;
  lineId: string | null;
  isLoading: boolean;
}

export const useProductCartState = (variantId: string): ProductCartState => {
  const [productCartState, setProductCartState] = useState<ProductCartState>({
    isInCart: false,
    quantity: 0,
    lineId: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkProductInCart = async () => {
      try {
        // Check if cart ID exists in cookies
        const cartId = getCookie('cartId');

        if (!cartId) {
          setProductCartState({
            isInCart: false,
            quantity: 0,
            lineId: null,
            isLoading: false,
          });
          return;
        }

        // Fetch cart details from API with optimized caching
        const response = await fetch('/api/cart/details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store', // Ensure fresh data for mobile/tablet
        });

        if (response.ok) {
          const cartData = await response.json();
          const cartLines: CartItem[] = cartData.lines || [];

          // Find the specific variant in cart
          const cartItem = cartLines.find(
            (line) => line.merchandise.id === variantId
          );

          if (cartItem) {
            setProductCartState({
              isInCart: true,
              quantity: cartItem.quantity,
              lineId: cartItem.id,
              isLoading: false,
            });
          } else {
            setProductCartState({
              isInCart: false,
              quantity: 0,
              lineId: null,
              isLoading: false,
            });
          }
        } else {
          setProductCartState({
            isInCart: false,
            quantity: 0,
            lineId: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking product in cart:', error);
        setProductCartState({
          isInCart: false,
          quantity: 0,
          lineId: null,
          isLoading: false,
        });
      }
    };

    if (variantId) {
      checkProductInCart();
    }

    // Listen for cart updates with immediate response
    const handleCartUpdate = () => {
      if (variantId) {
        // Immediate check for faster mobile/tablet response
        setTimeout(() => {
          checkProductInCart();
        }, 50); // Very fast update for mobile
      }
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Also listen for storage changes (in case cart is updated in another tab)
    window.addEventListener('storage', handleCartUpdate);

    // Listen for focus events to refresh cart state on mobile
    window.addEventListener('focus', handleCartUpdate);
    window.addEventListener('visibilitychange', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('focus', handleCartUpdate);
      window.removeEventListener('visibilitychange', handleCartUpdate);
    };
  }, [variantId]);

  return productCartState;
};

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

// Helper function to trigger cart update events
export const triggerCartUpdate = () => {
  if (typeof window !== 'undefined') {
    // Immediate dispatch for faster response
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    // Also trigger storage event for cross-tab sync
    window.dispatchEvent(new CustomEvent('storage'));
  }
};
