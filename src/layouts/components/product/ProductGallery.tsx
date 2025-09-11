"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { JSX, MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import type { Swiper as TSwiper } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LoadingProductThumb from "../loadings/skeleton/SkeletonProductThumb";

export interface ImageItem {
  url: string;
  altText: string;
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

interface CustomZoomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const CustomZoomImage = ({ src, alt, width, height }: CustomZoomImageProps): JSX.Element => {
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0.5, y: 0.5 });
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [touchStartPosition, setTouchStartPosition] = useState<Position | null>(null);
  const [touchMoveCount, setTouchMoveCount] = useState<number>(0);
  const imageRef = useRef<HTMLDivElement | null>(null);

  // Detect touch device on component mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const updatePosition = (clientX: number, clientY: number): void => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();

    // Calculate position in percentage (0 to 1)
    const x = Math.max(0, Math.min(1, (clientX - left) / width));
    const y = Math.max(0, Math.min(1, (clientY - top) / height));

    setPosition({ x, y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (isTouchDevice) return;
    updatePosition(e.clientX, e.clientY);
  };

  // Handle touch events
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);

      // Store touch start position to determine if it was a tap or pan
      setTouchStartPosition({
        x: touch.clientX,
        y: touch.clientY
      });

      setTouchMoveCount(0);

      // Only show magnifier on first touch if not already zoomed
      if (!isZoomed) {
        setShowMagnifier(true);
      }
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>): void => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY);
      setTouchMoveCount(prev => prev + 1);
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
    // If almost no movement (less than 5 position updates), consider it a tap
    if (touchMoveCount < 5 && touchStartPosition) {
      handleClick();
    }

    // Reset touch tracking
    setTouchStartPosition(null);

    // Hide magnifier on touch end if not zoomed
    if (!isZoomed) {
      setShowMagnifier(false);
    }
  };

  const handleClick = (): void => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-md ${!isZoomed && showMagnifier ? 'cursor-zoom-in' : isZoomed ? 'cursor-zoom-out' : ''
        }`}
      ref={imageRef}
      onMouseEnter={() => !isTouchDevice && setShowMagnifier(true)}
      onMouseLeave={() => !isTouchDevice && setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      onClick={!isTouchDevice ? handleClick : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* Magnifying glass icon - shown on hover for desktop, shown on touch for mobile */}
      {showMagnifier && !isZoomed && (
        <div
          className="absolute z-10 flex items-center justify-center bg-white opacity-70 rounded-full p-1 shadow-md"
          style={{
            left: `${position.x * 100}%`,
            top: `${position.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            width: isTouchDevice ? '40px' : '24px',
            height: isTouchDevice ? '40px' : '24px'
          }}
        >
          <FiZoomIn size={isTouchDevice ? 24 : 16} />
        </div>
      )}

      {/* Zoomed view */}
      {isZoomed && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 cursor-zoom-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: '200% 200%',
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            zIndex: 10,
          }}
        />
      )}

      {/* Touch zoom instructions - only shown briefly on first touch */}
      {isTouchDevice && isZoomed && (
        <div className="absolute bottom-2 left-0 right-0 text-center bg-black opacity-50 text-white py-1 text-sm z-20">
          Pan to move, tap to exit zoom
        </div>
      )}
    </div>
  );
};

interface ProductGalleryProps {
  images: ImageItem[];
}

const ProductGallery = ({ images }: ProductGalleryProps): JSX.Element => {
  const [thumbsSwiper, setThumbsSwiper] = useState<TSwiper | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [loadingThumb, setLoadingThumb] = useState<boolean>(true);
  const [picUrl, setPicUrl] = useState<string>("");
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  // Detect touch device on component mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const searchParams = useSearchParams().get("color");

  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  // Use all images instead of filtering by altText
  const filteredImages: ImageItem[] = images;

  useEffect(() => {
    // Initialize with first image
    if (filteredImages.length > 0) {
      setPicUrl(filteredImages[0].url);
    }
    setLoadingThumb(false);
  }, [filteredImages]);

  const handleSlideChange = (swiper: TSwiper): void => {
    setActiveIndex(swiper.activeIndex);
    setPicUrl(filteredImages[swiper.activeIndex]?.url || "");
  };

  const handleThumbSlideClick = (clickedUrl: string): void => {
    const foundIndex: number = filteredImages.findIndex(
      (item: ImageItem) => item.url === clickedUrl,
    );
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    }
  };

  if (loadingThumb) {
    return <LoadingProductThumb />;
  }

  return (
    <div className="space-y-4">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Swiper
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSlideChange={handleSlideChange}
          allowTouchMove={!isHovered} // Disable Swiper touch when zooming is active
        >
          {filteredImages.map((item: ImageItem) => (
            <SwiperSlide key={item.url}>
              <div className="mb-6 border-2 border-border dark:border-darkmode-border rounded-xl max-h-[623px] overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <CustomZoomImage
                  src={item.url}
                  alt={item.altText}
                  width={722}
                  height={623}
                />
              </div>
            </SwiperSlide>
          ))}
          <div
            className={`hidden lg:block w-full absolute top-1/2 -translate-y-1/2 z-10 px-6 text-text-dark ${
              isHovered
                ? "opacity-100 transition-opacity duration-300 ease-in-out"
                : "opacity-0 transition-opacity duration-300 ease-in-out"
            }`}
          >
            <div
              ref={prevRef}
              className="p-3 lg:p-4 rounded-full bg-white dark:bg-darkmode-body cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 absolute left-4 border border-border dark:border-darkmode-border"
            >
              <HiOutlineArrowNarrowLeft size={24} className="text-primary" />
            </div>
            <div
              ref={nextRef}
              className="p-3 lg:p-4 rounded-full bg-white dark:bg-darkmode-body cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 absolute right-4 border border-border dark:border-darkmode-border"
            >
              <HiOutlineArrowNarrowRight size={24} className="text-primary" />
            </div>
          </div>
        </Swiper>
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={isTouchDevice ? 3.5 : 4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {filteredImages.map((item: ImageItem) => (
            <SwiperSlide key={item.url}>
              <div
                onClick={() => handleThumbSlideClick(item.url)}
                className={`rounded-lg cursor-pointer overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  picUrl === item.url
                    ? "border-2 border-primary shadow-lg ring-2 ring-primary/20"
                    : "border-2 border-border dark:border-darkmode-border hover:border-primary/50"
                }`}
              >
                <Image
                  src={item.url}
                  alt={item.altText}
                  width={168}
                  height={146}
                  className="max-h-[146px] w-full object-cover"
                  draggable={false}
                />
                {picUrl === item.url && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductGallery;
