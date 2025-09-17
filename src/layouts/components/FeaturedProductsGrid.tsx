"use client";

import { Product } from "@/lib/shopify/types";
import EnhancedProductCard from "./product/EnhancedProductCard";
import { Suspense } from "react";
import Link from "next/link";

interface FeaturedProductsGridProps {
  products: Product[];
}

const FeaturedProductsGrid = ({ products }: FeaturedProductsGridProps) => {
  return (
    <div className="relative" suppressHydrationWarning={true}>
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-5" suppressHydrationWarning={true}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10" suppressHydrationWarning={true}></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800020' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} suppressHydrationWarning={true}></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-[#800020]/5 rounded-full blur-3xl" suppressHydrationWarning={true}></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#600018]/5 rounded-full blur-3xl" suppressHydrationWarning={true}></div>
      </div>

      {/* Products Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
        {products.map((product: Product) => (
          <EnhancedProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Products Button */}
      <div className="flex justify-center mt-12 md:mt-16 relative z-10">
        <Link
          className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold rounded-2xl hover:from-[#600018] hover:to-[#500015] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          href={"/products"}
        >
          View All Products
          <svg 
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#800020]/10 to-[#600018]/10 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#800020]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-darkmode-text-dark mb-3">No Products Found</h3>
          <p className="text-gray-600 dark:text-darkmode-text-light max-w-md mx-auto">
            We&apos;re working on adding more amazing products. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};


export default FeaturedProductsGrid;
