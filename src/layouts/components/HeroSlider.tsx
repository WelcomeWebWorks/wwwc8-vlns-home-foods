"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { Product } from "@/lib/shopify/types";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const HeroSlider = ({ products }: { products: Product[] }) => {
  return (
    <div className="hero-swiper-container">
      <Swiper
        className="hero-swiper"
        pagination={{
          clickable: true,
          bulletClass: "banner-pagination-bullet",
          bulletActiveClass: "banner-pagination-bullet-active",
        }}
        modules={[Autoplay, Pagination]}
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
      >
        {products?.map((item: Product) => (
          <SwiperSlide key={item.id}>
            <div className="hero-slide">
              {/* Background Image */}
              {item.featuredImage && (
                <div className="hero-background">
                  <ImageFallback
                    src={item.featuredImage.url}
                    className="hero-bg-image"
                    width={1920}
                    height={800}
                    alt="hero background"
                    priority={true}
                  />
                  <div className="hero-overlay"></div>
                </div>
              )}
              
              {/* Content Container */}
              <div className="hero-content">
                <div className="container">
                  <div className="hero-text-container">
                    {item?.description && (
                      <p className="hero-subtitle">
                        {item.description}
                      </p>
                    )}
                    <h1 className="hero-title">
                      {item.title}
                    </h1>
                    {item.handle && (
                      <div className="hero-actions">
                        <Link
                          className="btn btn-primary btn-lg hero-btn"
                          href={`products/${item.handle}`}
                        >
                          Shop Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
