"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { Image } from "@/lib/shopify/types";

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
  // Filter out images with empty, null, or invalid URLs
  const validImages = images?.filter(img => 
    img && 
    img.url && 
    typeof img.url === 'string' && 
    img.url.trim() !== "" &&
    img.url !== "null" &&
    img.url !== "undefined"
  ) || [];
  
  // Get the primary image (first valid image)
  const primaryImage = validImages[0];

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
    <div className="relative overflow-hidden w-full h-full">
      {/* Primary Image */}
      <ImageFallback
        src={primaryImage.url}
        width={width}
        height={height}
        alt={primaryImage.altText || alt}
        className={className}
        fallback={fallbackSrc}
      />
    </div>
  );
};

export default ProductImageWithHover;