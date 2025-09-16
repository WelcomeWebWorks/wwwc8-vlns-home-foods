"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Collection } from "@/lib/shopify/types";
import { getCollections } from "@/lib/shopify";
import { createCategoryUrl } from "@/lib/utils/navigationUtils";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  categoryHandle: string;
  categoryName: string;
}

const EnhancedHeroSlider = () => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from Shopify
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCollections();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to find the actual category handle from Shopify collections
  const findCategoryHandle = (categoryKeywords: string[]): string | null => {
    if (!categories || categories.length === 0) return null;
    
    for (const category of categories) {
      const categoryTitle = category.title.toLowerCase();
      const categoryHandle = category.handle.toLowerCase();
      
      for (const keyword of categoryKeywords) {
        if (categoryTitle.includes(keyword.toLowerCase()) || 
            categoryHandle.includes(keyword.toLowerCase())) {
          return category.handle;
        }
      }
    }
    
    return null;
  };

  // Define hero slides with images and category mappings
  const heroSlides: HeroSlide[] = [
    {
      id: "sweets",
      image: "/images/hero-section/sweets.png",
      title: "Authentic Sweets",
      subtitle: "Traditional Andhra Pradesh Delicacies",
      categoryHandle: findCategoryHandle(["sweet", "laddu", "halwa", "burfi", "mysore", "dessert", "mithai"]) || "sweets",
      categoryName: "Sweets"
    },
    {
      id: "pickles",
      image: "/images/hero-section/pickles.png",
      title: "Spicy Pickles",
      subtitle: "Homemade Achar & Tangy Flavors",
      categoryHandle: findCategoryHandle(["pickle", "achar", "mango", "lime", "chili", "gongura"]) || "pickles",
      categoryName: "Pickles"
    },
    {
      id: "snacks",
      image: "/images/hero-section/snacks.png",
      title: "Crispy Snacks",
      subtitle: "Fresh Namkeen & Savory Treats",
      categoryHandle: findCategoryHandle(["namkeen", "snack", "mixture", "chips", "murukku", "sev"]) || "namkeen",
      categoryName: "Namkeen"
    },
    {
      id: "daily-essentials",
      image: "/images/hero-section/daily-essentials.png",
      title: "Daily Essentials",
      subtitle: "Kitchen Staples & Cooking Ingredients",
      categoryHandle: findCategoryHandle(["essential", "daily", "oil", "ghee", "flour", "rice", "dal"]) || "daily-essentials",
      categoryName: "Daily Essentials"
    }
  ];

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
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={800}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-slide">
              {/* Background Image */}
              <div className="hero-background">
                <Image
                  src={slide.image}
                  className="hero-bg-image"
                  width={1920}
                  height={800}
                  alt={`${slide.title} - ${slide.subtitle}`}
                  priority={slide.id === "sweets"} // Priority for first image
                  quality={90}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                />
                <div className="hero-overlay"></div>
              </div>
              
              {/* Content Container */}
              <div className="hero-content">
                <div className="container">
                  <div className="hero-text-container">
                    <p className="hero-subtitle font-primary text-sm md:text-base lg:text-lg font-medium text-white/95 mb-4 tracking-wide uppercase">
                      {slide.subtitle}
                    </p>
                    <h1 className="hero-title font-secondary text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
                      {slide.title}
                    </h1>
                    <div className="hero-actions">
                      <Link
                        className="btn btn-primary btn-lg hero-btn group"
                        href={createCategoryUrl(slide.categoryHandle)}
                      >
                        <span>Shop {slide.categoryName}</span>
                        <svg 
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
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

export default EnhancedHeroSlider;
