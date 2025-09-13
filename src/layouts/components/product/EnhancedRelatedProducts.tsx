"use client";

import { Product } from "@/lib/shopify/types";
import CustomizableProductCard from "@/layouts/components/product/CustomizableProductCard";
import Link from "next/link";
import { FiPackage, FiArrowRight } from "react-icons/fi";

interface EnhancedRelatedProductsProps {
  products: Product[];
  currentProductId: string;
  title?: string;
  subtitle?: string;
}

const EnhancedRelatedProducts: React.FC<EnhancedRelatedProductsProps> = ({
  products,
  currentProductId,
  title = "You Might Also Like",
  subtitle = "Discover more authentic Andhra Pradesh products that complement your selection",
}) => {
  // Filter out current product and limit to exactly 6 products
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 6);

  if (relatedProducts.length === 0) {
    return (
      <section className="py-20 bg-white dark:bg-darkmode-body relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10"></div>
        
        <div className="container relative">
          {/* Left-aligned Section Header */}
          <div className="text-left mb-16 pl-4 md:pl-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <FiPackage className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark mb-2">
                  {title}
                </h2>
                <p className="text-xl text-text-light dark:text-darkmode-text-light">
                  {subtitle}
                </p>
              </div>
            </div>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </div>

          {/* No Products Available */}
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <FiPackage className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-text-dark dark:text-darkmode-text-dark mb-4">
              More Products Coming Soon
            </h3>
            <p className="text-lg text-text-light dark:text-darkmode-text-light mb-8 max-w-md mx-auto">
              We're constantly adding new authentic Andhra Pradesh products. Check back soon for more delicious options!
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg group"
            >
              <span>Browse All Products</span>
              <FiArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-darkmode-body relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full"></div>
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent/20 rounded-full"></div>
      <div className="absolute top-1/2 -left-8 w-6 h-6 bg-primary/30 rounded-full"></div>
      <div className="absolute top-1/4 -right-8 w-10 h-10 bg-accent/30 rounded-full"></div>

      <div className="container relative">
        {/* Left-aligned Section Header */}
        <div className="text-left mb-16 pl-4 md:pl-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <FiPackage className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark mb-2">
                {title}
              </h2>
              <p className="text-xl text-text-light dark:text-darkmode-text-light">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
        </div>

        {/* Products Grid - Responsive: 2 columns (mobile), 3 columns (tablet/desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12">
          {relatedProducts.map((product: Product, index: number) => (
            <div 
              key={product.id} 
              className="transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border dark:border-darkmode-border overflow-hidden group">
                <CustomizableProductCard product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg group"
          >
            <FiPackage className="w-5 h-5 mr-2" />
            <span>View All Products</span>
            <FiArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Count Indicator */}
        <div className="text-center mt-8">
          <p className="text-sm text-text-light dark:text-darkmode-text-light">
            Showing {relatedProducts.length} of {relatedProducts.length} related products
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnhancedRelatedProducts;
