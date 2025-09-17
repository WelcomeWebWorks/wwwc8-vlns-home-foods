"use client";

import { useEffect, useState } from "react";

interface CartState {
  hasItems: boolean;
  itemCount: number;
  isLoading: boolean;
}

export const useCartState = (): CartState => {
  const [cartState, setCartState] = useState<CartState>({
    hasItems: false,
    itemCount: 0,
    isLoading: true,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const checkCartState = async () => {
      try {
        // Check if cart ID exists in cookies
        const cartId = getCookie('cartId');
        
        if (!cartId) {
          setCartState({
            hasItems: false,
            itemCount: 0,
            isLoading: false,
          });
          return;
        }

        // Fetch cart data from API
        const response = await fetch('/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const cartData = await response.json();
          setCartState({
            hasItems: cartData.totalQuantity > 0,
            itemCount: cartData.totalQuantity || 0,
            isLoading: false,
          });
        } else {
          setCartState({
            hasItems: false,
            itemCount: 0,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking cart state:', error);
        setCartState({
          hasItems: false,
          itemCount: 0,
          isLoading: false,
        });
      }
    };

    checkCartState();

    // Listen for cart updates
    const handleCartUpdate = () => {
      checkCartState();
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Also listen for storage changes (in case cart is updated in another tab)
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [mounted]);

  return cartState;
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
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  }
};
