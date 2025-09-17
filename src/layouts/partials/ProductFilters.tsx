"use client";

import ShowTags from "@/components/product/ShowTags";
import { ShopifyCollection } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import { slugify } from "@/lib/utils/textConverter";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";

const ProductFilters = ({
  categories,
  vendors,
  tags,
  vendorsWithCounts,
  categoriesWithCounts,
}: {
  categories: ShopifyCollection[];
  vendors: { vendor: string; productCount: number }[];
  tags: string[];
  vendorsWithCounts: { vendor: string; productCount: number }[];
  categoriesWithCounts: { category: string; productCount: number }[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedBrands = searchParams.getAll("b");
  const selectedCategory = searchParams.get("c");

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-6">
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleBrandClick = (name: string) => {
    const slugName = slugify(name.toLowerCase());
    const newParams = new URLSearchParams(searchParams.toString());

    const currentBrands = newParams.getAll("b");

    if (currentBrands.includes(slugName)) {
      newParams.delete("b", slugName);
    } else {
      newParams.append("b", slugName);
    }
    router.push(createUrl("/products", newParams), { scroll: false });
  };

  const handleCategoryClick = (handle: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (handle === selectedCategory) {
      // Deselect current category
      newParams.delete("c");
    } else {
      newParams.set("c", handle);
    }
    router.push(createUrl("/products", newParams), { scroll: false });
  };

  return (
    <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-6">
      <div>
        <h5 className="mb-4 mt-4 lg:mt-6 text-xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Product Categories
        </h5>
        <hr className="border-border dark:border-darkmode-border mb-4" />
        <ul className="space-y-3">
          {categories.map((category) => (
            <li
              key={category.handle}
              className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.handle
                  ? "bg-primary text-white shadow-md"
                  : "text-text-light dark:text-darkmode-text-light hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary"
              }`}
              onClick={() => handleCategoryClick(category.handle)}
            >
              <span className="font-medium">{category.title}</span>
              <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                selectedCategory === category.handle
                  ? "bg-white text-primary border-2 border-white"
                  : "bg-primary text-white"
              }`}>
                {(() => {
                  // Use static count from categoriesWithCounts (original total count)
                  if (categoriesWithCounts && categoriesWithCounts.length > 0) {
                    const found = categoriesWithCounts.find(
                      (c) => c.category === category.title
                    );
                    if (found && found.productCount !== undefined) {
                      return found.productCount;
                    }
                  }

                  // Fallback to category products count (static)
                  if (category?.products?.edges && category.products.edges.length !== undefined) {
                    return category.products.edges.length;
                  }

                  // Final fallback
                  return 0;
                })()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {vendors && (
        <div>
          <h5 className="mb-4 mt-8 lg:mt-10 text-xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Brands
          </h5>
          <hr className="border-border dark:border-darkmode-border mb-4" />
          <ul className="space-y-3">
            {vendors.map((vendor) => (
              <li
                key={vendor.vendor}
                className="flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-200 text-text-light dark:text-darkmode-text-light hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary"
                onClick={() => handleBrandClick(vendor.vendor)}
              >
                <span className="font-medium">{vendor.vendor}</span>
                <span className="text-sm px-2 py-1 rounded-full font-medium bg-primary text-white">
                  {(() => {
                    // Try to get count from vendorsWithCounts first
                    if (vendorsWithCounts && vendorsWithCounts.length > 0) {
                      const found = vendorsWithCounts.find(
                        (v) => v.vendor === vendor.vendor
                      );
                      if (found && found.productCount !== undefined) {
                        return found.productCount;
                      }
                    }
                    
                    // Fallback to vendor productCount
                    if (vendor.productCount !== undefined) {
                      return vendor.productCount;
                    }
                    
                    // Final fallback
                    return 0;
                  })()}
                </span>
                <div className={`h-5 w-5 rounded-md flex items-center justify-center border-2 transition-all duration-200 ${
                  selectedBrands.some(b => slugify(vendor.vendor.toLowerCase()) === b)
                    ? "bg-primary border-primary text-white"
                    : "border-border dark:border-darkmode-border hover:border-primary"
                }`}>
                  {selectedBrands.map((b, i) =>
                    slugify(vendor.vendor.toLowerCase()) === b ? (
                      <BsCheckLg key={i} size={12} />
                    ) : null,
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div>
          <h5 className="mb-4 mt-8 lg:mt-10 text-xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Tags
          </h5>
          <hr className="border-border dark:border-darkmode-border mb-4" />
          <div>
            <Suspense>
              <ShowTags tags={tags} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
