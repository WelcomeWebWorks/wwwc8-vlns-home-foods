"use client";

import { Collection } from "@/lib/shopify/types";
import { getAllTags, getCollections } from "@/lib/shopify";
import { useEffect, useState } from "react";
import DynamicNavDropdown from "./DynamicNavDropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  // Define category and tag keywords for each dropdown in the required order
  const navigationConfig = [
    {
      title: "Sweets",
      categoryKeywords: ["sweet", "laddu", "halwa", "burfi", "mysore", "dessert", "mithai"],
      tagKeywords: ["sweet", "laddu", "halwa", "burfi", "mysore", "dessert", "sugar", "jaggery", "mithai"],
    },
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
      title: "Pickles",
      categoryKeywords: ["pickle", "achar", "mango", "lime", "chili", "gongura"],
      tagKeywords: ["pickle", "achar", "mango", "lime", "chili", "spicy", "tangy", "sour", "gongura"],
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
      <div className="hidden lg:block flex-1">
        <div className="flex justify-center">
          <ul className="flex space-x-8">
            {staticMenuItems.map((menu, i) => (
              <li key={`menu-${i}`}>
                <Link
                  href={menu.url}
                  className={`nav-link text-lg font-medium transition-all duration-300 ease-in-out ${
                    isMenuItemActive(menu, pathname)
                      ? 'bg-[#800020] text-white px-4 py-2 rounded-lg font-bold shadow-md'
                      : 'hover:text-[#800020] hover:bg-gray-100 px-4 py-2 rounded-lg'
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
    <div className="hidden lg:block flex-1">
      <div className="flex justify-center">
        <ul className="flex space-x-6">
          {/* Home - First item */}
          <li>
            <Link
              href="/"
              className={`nav-link text-lg font-medium transition-all duration-300 ease-in-out ${
                pathname === "/"
                  ? 'bg-[#800020] text-white px-4 py-2 rounded-lg font-bold shadow-md'
                  : 'hover:text-[#800020] hover:bg-gray-100 px-4 py-2 rounded-lg'
              }`}
            >
              Home
            </Link>
          </li>

          {/* Dynamic dropdown menus in required order */}
          {navigationConfig.map((config, index) => (
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
              className={`nav-link text-lg font-medium transition-all duration-300 ease-in-out ${
                pathname === "/about"
                  ? 'bg-[#800020] text-white px-4 py-2 rounded-lg font-bold shadow-md'
                  : 'hover:text-[#800020] hover:bg-gray-100 px-4 py-2 rounded-lg'
              }`}
            >
              About
            </Link>
          </li>

          {/* Contact */}
          <li>
            <Link
              href="/contact"
              className={`nav-link text-lg font-medium transition-all duration-300 ease-in-out ${
                pathname === "/contact"
                  ? 'bg-[#800020] text-white px-4 py-2 rounded-lg font-bold shadow-md'
                  : 'hover:text-[#800020] hover:bg-gray-100 px-4 py-2 rounded-lg'
              }`}
            >
              Contact
            </Link>
          </li>

          {/* All Products - Last item */}
          <li>
            <Link
              href="/products"
              className={`nav-link text-lg font-medium transition-all duration-300 ease-in-out ${
                pathname === "/products"
                  ? 'bg-[#800020] text-white px-4 py-2 rounded-lg font-bold shadow-md'
                  : 'hover:text-[#800020] hover:bg-gray-100 px-4 py-2 rounded-lg'
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
