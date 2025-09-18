"use client";

import { useState } from "react";
import { Product } from "@/lib/shopify/types";
import WishlistButton from "./WishlistButton";
import ShareModal from "./ShareModal";
import { FiShare2 } from "react-icons/fi";

interface ProductDetailContentProps {
  product: Product;
  children: React.ReactNode;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({
  product,
  children,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <>
      {/* Product Header with Like and Share buttons */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark leading-tight mb-3">
            {product.title}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <WishlistButton 
            productId={product.id}
            productTitle={product.title}
            size="md"
          />
          <button
            onClick={handleShareClick}
            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group"
            aria-label="Share product"
          >
            <FiShare2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Rest of the content */}
      {children}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        productTitle={product.title}
        productDescription={product.description}
        productImage={product.images[0]?.url}
      />
    </>
  );
};

export default ProductDetailContent;
