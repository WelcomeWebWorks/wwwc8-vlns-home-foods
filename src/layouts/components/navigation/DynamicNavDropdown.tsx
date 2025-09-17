"use client";

import { Collection } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { isCategoryActive, isTagActive } from "@/lib/utils/navigationUtils";

interface DynamicNavDropdownProps {
  title: string;
  categories: Collection[];
  tags: string[];
  categoryKeywords: string[];
  tagKeywords: string[];
}

const DynamicNavDropdown: React.FC<DynamicNavDropdownProps> = ({
  title,
  categories,
  tags,
  categoryKeywords,
  tagKeywords,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter categories based on keywords
  const filteredCategories = categories.filter((category) =>
    categoryKeywords.some((keyword) =>
      category.title.toLowerCase().includes(keyword.toLowerCase()) ||
      category.handle.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  // Filter tags based on keywords
  const filteredTags = tags.filter((tag) =>
    tagKeywords.some((keyword) =>
      tag.toLowerCase().includes(keyword.toLowerCase())
    )
  );

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to prevent flickering
    setTimeoutId(id);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (categoryHandle: string) => {
    const params = new URLSearchParams();
    params.set("c", categoryHandle);
    router.push(createUrl("/products", params));
    setIsOpen(false);
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    params.set("t", tag);
    router.push(createUrl("/products", params));
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Check if this dropdown should be highlighted
  const isDropdownActive = isCategoryActive(pathname, searchParams, categoryKeywords) || 
                          isTagActive(pathname, searchParams, tagKeywords);

  // Don't render if no relevant categories or tags
  if (filteredCategories.length === 0 && filteredTags.length === 0) {
    return null;
  }

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger */}
      <button
        onClick={handleClick}
        className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 flex items-center space-x-2 ${
          isDropdownActive
            ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
            : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-72 xl:w-80 2xl:w-96 bg-white dark:bg-darkmode-body rounded-lg shadow-2xl border border-border dark:border-darkmode-border z-50 overflow-hidden">
          <div className="p-4">
            {/* Categories Section */}
            {filteredCategories.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Categories
                </h3>
                <div className="grid grid-cols-1 gap-1">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.handle}
                      onClick={() => handleCategoryClick(category.handle)}
                      className="text-left px-3 py-2 text-sm text-text-light dark:text-darkmode-text-light hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary rounded transition-colors duration-200"
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Section */}
            {filteredTags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filteredTags.slice(0, 8).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-text-dark dark:text-darkmode-text-dark hover:bg-primary hover:text-white rounded-full transition-colors duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                  {filteredTags.length > 8 && (
                    <Link
                      href="/products"
                      className="px-2 py-1 text-xs text-primary hover:text-primary-dark font-medium"
                    >
                      +{filteredTags.length - 8} more
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* View All Link */}
            <div className="mt-4 pt-3 border-t border-border dark:border-darkmode-border">
              <Link
                href="/products"
                className="block text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#600018] transition-colors duration-200 text-sm font-medium"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicNavDropdown;
