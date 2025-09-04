"use client";
import config from "@/config/config.json";
import { Product } from "@/lib/shopify/types";
import CustomizableProductCard from "@/components/product/CustomizableProductCard";
import Link from "next/link";

const FeaturedProducts = ({ products }: { products: Product[] }) => {
  const { currencySymbol } = config.shopify;

  return (
    <>
      <div className="row">
        {products.map((product: Product) => (
          <div key={product.id} className="col-6 md:col-4 lg:col-3 mb-8 md:mb-14">
            <CustomizableProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          className="btn btn-sm md:btn-lg btn-primary font-medium"
          href={"/products"}
        >
          + See All Products
        </Link>
      </div>
    </>
  );
};

export default FeaturedProducts;
