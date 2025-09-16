"use client";

import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingCategory from "./loadings/skeleton/SkeletonCategory";

const CollectionsGrid = ({ collections }: { collections: any }) => {
  const [collectionsData, setCollectionsData] = useState([]);
  const [loadingCollectionsData, setLoadingCollectionsData] = useState(true);

  useEffect(() => {
    setCollectionsData(collections);
    setLoadingCollectionsData(false);
  }, [collections]);

  if (loadingCollectionsData) {
    return <LoadingCategory />;
  }

  return (
    <div className="relative">
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10"></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800020' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-[#800020]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#600018]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Collections Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {collectionsData?.map((item: any) => {
          const { title, handle, image, products } = item;
          const productCount = item.products?.edges?.length || 0;
          
          return (
            <Link key={handle} href={`/products?c=${handle}`} className="group block">
              <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-darkmode-light transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
                  <ImageFallback
                    src={image?.url}
                    width={600}
                    height={400}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Product Count Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 dark:bg-darkmode-body/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-[#800020]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-[#800020]">
                        {productCount} {productCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  {/* Shop Now Button - Mobile & Tablet Only */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 md:hidden lg:hidden">
                    <div className="bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl inline-flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                      </svg>
                      Shop Now
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  {/* Category Name */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-darkmode-text-dark group-hover:text-[#800020] transition-colors duration-300 mb-2" style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}>
                    {title}
                  </h3>
                  
                  {/* Product Count */}
                  <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-darkmode-text-light">
                    <svg className="w-4 h-4 text-[#800020]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium" style={{
                      fontFamily: "'Inter', 'Helvetica', sans-serif",
                      fontWeight: '500'
                    }}>
                      {productCount} {productCount === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  {/* Explore Button - Desktop Only */}
                  <div className="mt-4 hidden md:block">
                    <div className="inline-flex items-center text-[#800020] font-semibold text-sm group-hover:text-[#600018] transition-colors duration-300">
                      Explore Collection
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#800020]/20 transition-all duration-500"></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionsGrid;
