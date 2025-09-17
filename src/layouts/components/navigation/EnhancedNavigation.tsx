"use client";

import { Collection } from "@/lib/shopify/types";
import { getAllTags, getCollections } from "@/lib/shopify";
import { useEffect, useState } from "react";
import DynamicNavDropdown from "./DynamicNavDropdown";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { isCategoryActive, isAllProductsActive, createCategoryUrl } from "@/lib/utils/navigationUtils";

interface INavigationLink {
  name: string;
  url: string;
}

interface EnhancedNavigationProps {
  staticMenuItems: INavigationLink[];
  pathname: string;
}

const isMenuItemActive = (menu: INavigationLink, pathname: string) => {
  return (pathname === `${menu.url}/` || pathname === menu.url) && "nav-active";
};

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  staticMenuItems,
  pathname,
}) => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories and tags in parallel
        const [categoriesData, tagsData] = await Promise.all([
          getCollections(),
          getAllTags(),
        ]);

        setCategories(categoriesData || []);
        setTags(tagsData || []);
      } catch (error) {
        console.error("Error fetching navigation data:", error);
        setCategories([]);
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigationData();
  }, []);

  // Define categories that should have dropdowns
  const dropdownCategories = [
    {
      title: "Sweets",
      categoryKeywords: ["sweet", "laddu", "halwa", "burfi", "mysore", "dessert", "mithai"],
      tagKeywords: ["sweet", "laddu", "halwa", "burfi", "mysore", "dessert", "sugar", "jaggery", "mithai"],
    },
    {
      title: "Pickles",
      categoryKeywords: ["pickle", "achar", "mango", "lime", "chili", "gongura"],
      tagKeywords: ["pickle", "achar", "mango", "lime", "chili", "spicy", "tangy", "sour", "gongura"],
    },
  ];

  // Function to find the actual category handle from Shopify collections
  const findCategoryHandle = (categoryKeywords: string[]): string | null => {
    if (!categories || categories.length === 0) return null;
    
    // First, try to find exact matches
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
    
    // If no exact match, try partial matches
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

  // Define categories that should be direct links (no dropdowns)
  const directLinkCategories = [
    {
      title: "Namkeen",
      categoryKeywords: ["namkeen", "snack", "mixture", "chips", "murukku", "sev", "savory"],
      tagKeywords: ["namkeen", "snack", "mixture", "chips", "murukku", "sev", "crispy", "crunchy", "savory", "spicy"],
    },
    {
      title: "Millets",
      categoryKeywords: ["millet", "ragi", "bajra", "jowar", "quinoa", "grain", "healthy"],
      tagKeywords: ["millet", "ragi", "bajra", "jowar", "quinoa", "grain", "healthy", "organic", "nutritious"],
    },
    {
      title: "Daily Essentials",
      categoryKeywords: ["essential", "daily", "oil", "ghee", "flour", "rice", "dal", "spice"],
      tagKeywords: ["essential", "daily", "oil", "ghee", "flour", "rice", "dal", "spice", "cooking", "kitchen"],
    },
    {
      title: "Chilli Powders",
      categoryKeywords: ["chilli", "chili", "powder", "spice", "red", "guntur", "kashmiri"],
      tagKeywords: ["chilli", "chili", "powder", "spice", "red", "hot", "guntur", "kashmiri", "paprika"],
    },
  ];

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex justify-center">
          <ul className="flex flex-nowrap justify-center gap-1 xl:gap-2 2xl:gap-3">
            {staticMenuItems.map((menu, i) => (
              <li key={`menu-${i}`}>
                <Link
                  href={menu.url}
                  className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 ${
                    isMenuItemActive(menu, pathname)
                      ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
                      : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
                  }`}
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <ul className="flex flex-nowrap justify-center gap-1 xl:gap-2 2xl:gap-3">
          {/* Home - First item */}
          <li>
            <Link
              href="/"
              className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 ${
                pathname === "/"
                  ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
                  : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
              }`}
            >
              Home
            </Link>
          </li>

          {/* Direct link categories (no dropdowns) */}
          {directLinkCategories.map((config, index) => {
            const isActive = isCategoryActive(pathname, searchParams, config.categoryKeywords);
            const categoryHandle = findCategoryHandle(config.categoryKeywords);
            const categoryUrl = categoryHandle ? createCategoryUrl(categoryHandle) : '/products';
            
            return (
              <li key={`direct-${index}`}>
                <Link
                  href={categoryUrl}
                  className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 ${
                    isActive
                      ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
                      : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
                  }`}
                >
                  {config.title}
                </Link>
              </li>
            );
          })}

          {/* Dropdown categories */}
          {dropdownCategories.map((config, index) => (
            <li key={`dropdown-${index}`}>
              <DynamicNavDropdown
                title={config.title}
                categories={categories}
                tags={tags}
                categoryKeywords={config.categoryKeywords}
                tagKeywords={config.tagKeywords}
              />
            </li>
          ))}

          {/* About */}
          <li>
            <Link
              href="/about"
              className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 ${
                pathname === "/about"
                  ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
                  : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
              }`}
            >
              About
            </Link>
          </li>

          {/* Contact */}
          <li>
            <Link
              href="/contact"
              className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 ${
                pathname === "/contact"
                  ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
                  : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
              }`}
            >
              Contact
            </Link>
          </li>

          {/* All Products - Last item */}
          <li>
            <Link
              href="/products"
              className={`nav-link text-sm xl:text-base font-semibold transition-all duration-300 ease-in-out px-4 py-2.5 xl:px-5 xl:py-3 rounded-lg border-2 ${
                isAllProductsActive(pathname, searchParams)
                  ? 'bg-[#800020] text-white font-bold shadow-lg border-[#800020] transform scale-105'
                  : 'hover:text-[#800020] hover:bg-gray-50 hover:border-[#800020]/30 border-transparent hover:shadow-md hover:transform hover:scale-105'
              }`}
            >
              All Products
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EnhancedNavigation;
