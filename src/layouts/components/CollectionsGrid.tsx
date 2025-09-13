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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
      {collectionsData?.map((item: any) => {
        const { title, handle, image, products } = item;
        const productCount = item.products?.edges?.length || 0;
        
        return (
          <Link key={handle} href={`/products?c=${handle}`} className="group block">
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-darkmode-light">
              {/* Image Container */}
              <div className="relative h-64 md:h-64 lg:h-72 overflow-hidden">
                <ImageFallback
                  src={image?.url}
                  width={600}
                  height={400}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Product Count Badge */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-darkmode-body/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-text-dark dark:text-darkmode-text-dark">
                    {productCount} {productCount === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Shop Now Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-primary hover:bg-[#600018] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center">
                    Shop Now
                    <svg 
                      className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark group-hover:text-primary transition-colors duration-300">
                  {title}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CollectionsGrid;
