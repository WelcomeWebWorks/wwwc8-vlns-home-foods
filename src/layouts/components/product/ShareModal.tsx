"use client";

import { useEffect, useState } from "react";
import { FiX, FiShare2 } from "react-icons/fi";
import EnhancedSocialSharing from "./EnhancedSocialSharing";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productDescription?: string;
  productImage?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  productTitle,
  productDescription = "",
  productImage = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-darkmode-body rounded-3xl shadow-2xl border border-border dark:border-darkmode-border max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-darkmode-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <FiShare2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-dark dark:text-darkmode-text-dark">
                Share Product
              </h3>
              <p className="text-sm text-text-light dark:text-darkmode-text-light">
                Share this amazing product with others
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <h4 className="font-semibold text-text-dark dark:text-darkmode-text-dark mb-2 truncate">
              {productTitle}
            </h4>
            {productDescription && (
              <p className="text-sm text-text-light dark:text-darkmode-text-light line-clamp-2">
                {productDescription}
              </p>
            )}
          </div>

          {/* Social Sharing Options */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark">
              Choose a platform:
            </h5>
            <EnhancedSocialSharing 
              productTitle={productTitle}
              productDescription={productDescription}
              productImage={productImage}
              className="grid grid-cols-4 gap-4 justify-items-center"
            />
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border dark:border-darkmode-border text-center">
            <p className="text-xs text-text-light dark:text-darkmode-text-light">
              📱 Share the authentic taste of Andhra Pradesh!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
