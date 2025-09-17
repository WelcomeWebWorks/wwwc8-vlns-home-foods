"use client";

import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface WishlistButtonProps {
  productId: string;
  productTitle: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface WishlistItem {
  id: string;
  title: string;
  addedAt: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  productTitle,
  className = "",
  size = "md",
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: "w-10 h-10",
      icon: "w-4 h-4",
      text: "text-xs"
    },
    md: {
      container: "w-12 h-12 md:w-14 md:h-14",
      icon: "w-5 h-5 md:w-6 md:h-6",
      text: "text-sm"
    },
    lg: {
      container: "w-16 h-16",
      icon: "w-7 h-7",
      text: "text-base"
    }
  };

  const config = sizeConfig[size];

  useEffect(() => {
    // Check if product is in wishlist on component mount
    const wishlist = getWishlist();
    setIsLiked(wishlist.some(item => item.id === productId));
  }, [productId]);

  const getWishlist = (): WishlistItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const wishlist = localStorage.getItem('vlns-wishlist');
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  };

  const saveWishlist = (wishlist: WishlistItem[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('vlns-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const toggleWishlist = () => {
    setIsAnimating(true);
    
    const wishlist = getWishlist();
    let newWishlist: WishlistItem[];
    let action: string;

    if (isLiked) {
      // Remove from wishlist
      newWishlist = wishlist.filter(item => item.id !== productId);
      action = "removed";
    } else {
      // Add to wishlist
      const newItem: WishlistItem = {
        id: productId,
        title: productTitle,
        addedAt: new Date().toISOString(),
      };
      newWishlist = [...wishlist, newItem];
      action = "added";
    }

    saveWishlist(newWishlist);
    setIsLiked(!isLiked);

    // Show tooltip
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);

    // Reset animation
    setTimeout(() => setIsAnimating(false), 300);

    // Dispatch custom event for other components to listen to wishlist changes
    window.dispatchEvent(new CustomEvent('wishlistChanged', {
      detail: { productId, action, wishlist: newWishlist }
    }));
  };

  const getWishlistCount = (): number => {
    return getWishlist().length;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleWishlist}
        className={`
          ${config.container}
          ${className}
          flex items-center justify-center rounded-2xl transition-all duration-300 transform
          ${isLiked 
            ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg ring-4 ring-red-200 dark:ring-red-800' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }
          hover:scale-110 hover:shadow-xl
          ${isAnimating ? 'animate-pulse scale-125' : ''}
          group
        `}
        aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isLiked ? (
          <FaHeart 
            className={`${config.icon} transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`} 
          />
        ) : (
          <FiHeart 
            className={`${config.icon} transition-all duration-300 group-hover:text-red-500`} 
          />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className={`
          absolute -top-12 left-1/2 transform -translate-x-1/2 
          bg-gray-900 text-white ${config.text} px-3 py-2 rounded-lg 
          whitespace-nowrap z-20 shadow-lg
          animate-fade-in-up
        `}>
          {isLiked ? (
            <>
              <FaHeart className="inline-block text-red-400 mr-1" />
              Added to wishlist!
            </>
          ) : (
            <>
              <FiHeart className="inline-block text-gray-400 mr-1" />
              Removed from wishlist
            </>
          )}
        </div>
      )}

      {/* Floating heart animation for added items */}
      {isAnimating && isLiked && (
        <div className="absolute inset-0 pointer-events-none">
          <FaHeart className="absolute top-0 left-1/2 transform -translate-x-1/2 text-red-500 animate-float-up opacity-0" />
        </div>
      )}
    </div>
  );
};

// Hook to get wishlist data
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initial load
    const loadWishlist = () => {
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('vlns-wishlist');
          setWishlist(stored ? JSON.parse(stored) : []);
        } catch (error) {
          console.error('Error loading wishlist:', error);
          setWishlist([]);
        }
      }
    };

    loadWishlist();

    // Listen for wishlist changes
    const handleWishlistChange = (event: CustomEvent) => {
      setWishlist(event.detail.wishlist);
    };

    window.addEventListener('wishlistChanged', handleWishlistChange as EventListener);

    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange as EventListener);
    };
  }, [mounted]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.id === productId);
  };

  const addToWishlist = (productId: string, productTitle: string) => {
    const newItem: WishlistItem = {
      id: productId,
      title: productTitle,
      addedAt: new Date().toISOString(),
    };
    const newWishlist = [...wishlist, newItem];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlns-wishlist', JSON.stringify(newWishlist));
    }
    
    setWishlist(newWishlist);
    window.dispatchEvent(new CustomEvent('wishlistChanged', {
      detail: { productId, action: 'added', wishlist: newWishlist }
    }));
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter(item => item.id !== productId);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('vlns-wishlist', JSON.stringify(newWishlist));
    }
    
    setWishlist(newWishlist);
    window.dispatchEvent(new CustomEvent('wishlistChanged', {
      detail: { productId, action: 'removed', wishlist: newWishlist }
    }));
  };

  const clearWishlist = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vlns-wishlist');
    }
    setWishlist([]);
    window.dispatchEvent(new CustomEvent('wishlistChanged', {
      detail: { action: 'cleared', wishlist: [] }
    }));
  };

  return {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    count: wishlist.length,
  };
};

export default WishlistButton;
