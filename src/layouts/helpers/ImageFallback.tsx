"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageFallbackProps {
  src: string;
  fallback?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  [key: string]: any;
}

const ImageFallback = ({ src, fallback, alt, ...rest }: ImageFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // Default fallback image
  const defaultFallback = "/images/product_image404.jpg";

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  // Handle empty or invalid src
  const handleSrcError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback || defaultFallback);
    }
  };

  // Don't render if src is empty, null, or just whitespace
  const isValidSrc = src && typeof src === 'string' && src.trim() !== '';
  
  if (!isValidSrc) {
    return (
      <Image
        {...rest}
        src={fallback || defaultFallback}
        alt={alt || "Image not available"}
        onError={handleSrcError}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt || "Product image"}
      onError={handleSrcError}
    />
  );
};

export default ImageFallback;