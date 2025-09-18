"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { addItem } from "@/lib/utils/cartActions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { triggerCartUpdate } from "@/hooks/useProductCartState";
import { showToast } from "@/layouts/components/ui/Toast";
import { FaTimes, FaShoppingCart, FaCheck, FaSpinner, FaMinus, FaPlus } from "react-icons/fa";
import { useCurrency } from "@/contexts/CurrencyContext";

interface QuickOrderPopupProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}

interface AddToCartFormData {
  variantId: string;
  quantity: number;
}

function AddToCartButton({
  selectedVariantId,
  quantity,
  availableForSale,
  onOptimisticAdd,
  isAdding
}: {
  selectedVariantId: string | undefined;
  quantity: number;
  availableForSale: boolean;
  onOptimisticAdd?: () => void;
  isAdding: boolean;
}) {
  const handleClick = () => {
    if (onOptimisticAdd && !isAdding) {
      onOptimisticAdd();
    }
  };

  return (
    <button
      type="submit"
      disabled={!availableForSale || !selectedVariantId || isAdding}
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-[#800020] to-[#600018] hover:from-[#600018] hover:to-[#500015] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
    >
      {isAdding ? (
        <>
          <FaSpinner className="w-5 h-5 animate-spin" />
          <span>Adding to Cart...</span>
        </>
      ) : (
        <>
          <FaShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}

function QuickOrderForm({
  product,
  selectedVariant,
  selectedQuantity,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  isAdding,
  setIsAdding
}: {
  product: Product;
  selectedVariant: ProductVariant | null;
  selectedQuantity: number;
  onVariantChange: (optionName: string, optionValue: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  isAdding: boolean;
  setIsAdding: (loading: boolean) => void;
}) {
  const handleOptimisticAdd = () => {
    triggerCartUpdate();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant?.id || isAdding) return;
    
    setIsAdding(true);
    
    try {
      const formData = new FormData();
      formData.append('selectedVariantId', selectedVariant.id);
      formData.append('quantity', selectedQuantity.toString());
      
      const result = await addItem(null, formData);
      
      if (result === null) {
        // Success - item added to cart
        showToast("Product added to cart!", "success");
        triggerCartUpdate();
        // Close popup after success
        setTimeout(() => {
          onAddToCart();
        }, 1500);
      } else {
        // Error occurred
        showToast(result, "error");
      }
    } catch (error) {
      showToast("Error adding product to cart", "error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <AddToCartButton
        selectedVariantId={selectedVariant?.id}
        quantity={selectedQuantity}
        availableForSale={selectedVariant?.availableForSale || false}
        onOptimisticAdd={handleOptimisticAdd}
        isAdding={isAdding}
      />
    </form>
  );
}

const QuickOrderPopup = ({ product, isOpen, onClose, onAddToCart }: QuickOrderPopupProps) => {
  const { formatPrice } = useCurrency();
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const popupRef = useRef<HTMLDivElement>(null);

  // Get available variants
  const availableVariants = useMemo(() => {
    return product.variants.filter(variant => variant.availableForSale);
  }, [product.variants]);

  // Get selected variant based on selected options
  const selectedVariant = useMemo(() => {
    if (Object.keys(selectedOptions).length === 0) {
      return availableVariants[0] || null;
    }
    
    return availableVariants.find(variant => {
      return Object.entries(selectedOptions).every(([optionName, optionValue]) => {
        return variant.selectedOptions.some(selectedOption =>
          selectedOption.name.toLowerCase() === optionName.toLowerCase() &&
          selectedOption.value === optionValue
        );
      });
    }) || availableVariants[0] || null;
  }, [availableVariants, selectedOptions]);

  // Initialize with first available variant and its options
  useEffect(() => {
    if (availableVariants.length > 0 && !selectedVariantId) {
      const firstVariant = availableVariants[0];
      setSelectedVariantId(firstVariant.id);
      
      // Initialize selected options from first variant
      const initialOptions: Record<string, string> = {};
      firstVariant.selectedOptions.forEach(option => {
        initialOptions[option.name] = option.value;
      });
      setSelectedOptions(initialOptions);
    }
  }, [availableVariants, selectedVariantId]);

  // Handle option selection
  const handleOptionChange = (optionName: string, optionValue: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: optionValue
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (quantity: number) => {
    if (quantity >= 1 && quantity <= 10) {
      setSelectedQuantity(quantity);
    }
  };

  // Handle add to cart - now handled in QuickOrderForm

  // Handle escape key and prevent background scrolling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      
      // Add CSS classes to disable scrolling
      document.documentElement.classList.add("popup-open");
      document.body.classList.add("popup-open");
      
      // Prevent scroll events
      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("scroll", preventScroll, { passive: false });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("scroll", preventScroll);
      
      // Remove CSS classes to restore scrolling
      document.documentElement.classList.remove("popup-open");
      document.body.classList.remove("popup-open");
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden"
      onClick={handleBackdropClick}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      <div 
        ref={popupRef}
        className="relative w-full max-w-lg bg-white dark:bg-darkmode-body rounded-3xl shadow-2xl transform transition-all duration-300 scale-95 animate-in zoom-in-95 z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-4">
            {/* Product Image */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-gray-900 dark:text-darkmode-text-dark mb-1 line-clamp-2" style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: '700'
              }}>
                {product.title}
              </h2>
              
              {/* Price */}
              {selectedVariant && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-[#800020]" style={{
                    fontFamily: "'Inter', 'Helvetica', sans-serif",
                    fontWeight: '700'
                  }}>
                    {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                  </span>
                  {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > 0 && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Variants Selection */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-2 mb-3">
              {product.options.map((option) => {
                const optionVariants = availableVariants.filter(variant =>
                  variant.selectedOptions.some(selectedOption =>
                    selectedOption.name.toLowerCase() === option.name.toLowerCase()
                  )
                );

                const uniqueValues = Array.from(new Set(
                  optionVariants.map(variant =>
                    variant.selectedOptions.find(selectedOption =>
                      selectedOption.name.toLowerCase() === option.name.toLowerCase()
                    )?.value
                  ).filter(Boolean)
                ));

                if (uniqueValues.length <= 1) return null;

                return (
                  <div key={option.name}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" style={{
                      fontFamily: "'Inter', 'Helvetica', sans-serif",
                      fontWeight: '600'
                    }}>
                      Select {option.name}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {uniqueValues.map((value) => {
                        if (!value) return null;
                        
                        const isSelected = selectedOptions[option.name] === value;
                        
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleOptionChange(option.name, value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                              isSelected
                                ? "bg-[#800020] text-white shadow-lg ring-2 ring-[#800020]/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md"
                            }`}
                            style={{
                              fontFamily: "'Inter', 'Helvetica', sans-serif"
                            }}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: '600'
            }}>
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleQuantityChange(selectedQuantity - 1)}
                disabled={selectedQuantity <= 1}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaMinus className="w-4 h-4" />
              </button>
              
              <span className="w-10 text-center text-base font-semibold text-gray-900 dark:text-darkmode-text-dark" style={{
                fontFamily: "'Inter', 'Helvetica', sans-serif"
              }}>
                {selectedQuantity}
              </span>
              
              <button
                onClick={() => handleQuantityChange(selectedQuantity + 1)}
                disabled={selectedQuantity >= 10}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Form */}
          {selectedVariant && (
            <QuickOrderForm
              product={product}
              selectedVariant={selectedVariant}
              selectedQuantity={selectedQuantity}
              onVariantChange={handleOptionChange}
              onQuantityChange={handleQuantityChange}
              onAddToCart={onAddToCart}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickOrderPopup;
