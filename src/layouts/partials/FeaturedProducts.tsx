"use client";
import config from "@/config/config.json";
import { Product } from "@/lib/shopify/types";
import CustomizableProductCard from "@/components/product/CustomizableProductCard";
import Link from "next/link";

const FeaturedProducts = ({ products }: { products: Product[] }) => {
  const { currencySymbol } = config.shopify;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product: Product) => (
          <div key={product.id} className="transform transition-all duration-300 hover:scale-105">
            <CustomizableProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          href={"/products"}
        >
          <span>+ See All Products</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default FeaturedProducts;
