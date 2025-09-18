"use client";

import { Product } from "@/lib/shopify/types";
import EnhancedProductCard from "@/layouts/components/product/EnhancedProductCard";
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
      <section className="py-16 bg-white dark:bg-darkmode-body">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
              {title}
            </h2>
            <p className="text-lg text-text-light dark:text-darkmode-text-light">
              {subtitle}
            </p>
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
              We&apos;re constantly adding new authentic Andhra Pradesh products. Check back soon for more delicious options!
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-[#600018] text-white font-semibold rounded-xl transition-colors duration-200 text-lg"
            >
              <span>Browse All Products</span>
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-darkmode-body">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
            {title}
          </h2>
          <p className="text-lg text-text-light dark:text-darkmode-text-light">
            {subtitle}
          </p>
        </div>

        {/* Products Grid - Plain Design */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {relatedProducts.map((product: Product) => (
            <EnhancedProductCard 
              key={product.id} 
              product={product}
              className="w-full"
            />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 bg-primary hover:bg-[#600018] text-white font-semibold rounded-xl transition-colors duration-200 text-lg"
          >
            <FiPackage className="w-5 h-5 mr-2" />
            <span>View All Products</span>
            <FiArrowRight className="w-5 h-5 ml-2" />
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
