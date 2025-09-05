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

  // Filter out images with empty, null, or invalid URLs
  const validImages = images?.filter(img => 
    img && 
    img.url && 
    typeof img.url === 'string' && 
    img.url.trim() !== "" &&
    img.url !== "null" &&
    img.url !== "undefined"
  ) || [];
  
  // Get the primary image (first valid image) and secondary image (second valid image if available)
  const primaryImage = validImages[0];
  const secondaryImage = validImages[1];
  
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

  // If no valid images available, show fallback
  if (!validImages || validImages.length === 0 || !primaryImage) {
    return (
      <ImageFallback
        src={fallbackSrc}
        width={width}
        height={height}
        alt={alt}
        className={className}
        fallback={fallbackSrc}
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
        fallback={fallbackSrc}
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
            fallback={fallbackSrc}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageWithHover;