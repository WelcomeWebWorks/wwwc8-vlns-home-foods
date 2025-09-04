"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { Image } from "@/lib/shopify/types";
import { useState } from "react";

interface ProductImageWithHoverProps {
  images: Image[];
  width: number;
  height: number;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ProductImageWithHover = ({
  images,
  width,
  height,
  alt,
  className = "",
  fallbackSrc = "/images/product_image404.jpg"
}: ProductImageWithHoverProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get the primary image (first image) and secondary image (second image if available)
  const primaryImage = images[0];
  const secondaryImage = images[1];
  
  // Determine which image to show
  const currentImage = isHovered && secondaryImage ? secondaryImage : primaryImage;

  const handleMouseEnter = () => {
    if (secondaryImage) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // If no images available, show fallback
  if (!images || images.length === 0 || !primaryImage) {
    return (
      <ImageFallback
        src={fallbackSrc}
        width={width}
        height={height}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Primary Image */}
      <ImageFallback
        src={primaryImage.url}
        width={width}
        height={height}
        alt={primaryImage.altText || alt}
        className={`${className} transition-opacity duration-500 ease-in-out ${
          isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Secondary Image (shown on hover) */}
      {secondaryImage && (
        <div className="absolute inset-0">
          <ImageFallback
            src={secondaryImage.url}
            width={width}
            height={height}
            alt={secondaryImage.altText || alt}
            className={`${className} transition-opacity duration-500 ease-in-out ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageWithHover;
