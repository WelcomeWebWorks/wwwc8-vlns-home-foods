"use client";

import { Collection } from "@/lib/shopify/types";
import { getAllTags, getCollections } from "@/lib/shopify";
import { createUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface INavigationLink {
  name: string;
  url: string;
}

interface MobileEnhancedNavigationProps {
  staticMenuItems: INavigationLink[];
  pathname: string;
  onLinkClick: () => void;
}

const isMenuItemActive = (menu: INavigationLink, pathname: string) => {
  return (pathname === `${menu.url}/` || pathname === menu.url) && "nav-active";
};

const MobileEnhancedNavigation: React.FC<MobileEnhancedNavigationProps> = ({
  staticMenuItems,
  pathname,
  onLinkClick,
}) => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        setLoading(true);
        
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

  const handleCategoryClick = (categoryHandle: string) => {
    const params = new URLSearchParams();
    params.set("c", categoryHandle);
    router.push(createUrl("/products", params));
    onLinkClick();
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    params.set("t", tag);
    router.push(createUrl("/products", params));
    onLinkClick();
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Define category and tag keywords for each section in the required order
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
      <nav className="space-y-2">
        {/* Home */}
        <Link
          href="/"
          className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
            pathname === "/"
              ? 'bg-[#800020] text-white font-bold shadow-md'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
          }`}
          onClick={onLinkClick}
        >
          Home
        </Link>

        <div className="px-4 py-3 text-gray-500">Loading categories...</div>

        {/* About */}
        <Link
          href="/about"
          className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
            pathname === "/about"
              ? 'bg-[#800020] text-white font-bold shadow-md'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
          }`}
          onClick={onLinkClick}
        >
          About
        </Link>

        {/* Contact */}
        <Link
          href="/contact"
          className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
            pathname === "/contact"
              ? 'bg-[#800020] text-white font-bold shadow-md'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
          }`}
          onClick={onLinkClick}
        >
          Contact
        </Link>

        {/* All Products */}
        <Link
          href="/products"
          className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
            pathname === "/products"
              ? 'bg-[#800020] text-white font-bold shadow-md'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
          }`}
          onClick={onLinkClick}
        >
          All Products
        </Link>
      </nav>
    );
  }

  return (
    <nav className="space-y-2">
      {/* Home - First item */}
      <Link
        href="/"
        className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
          pathname === "/"
            ? 'bg-[#800020] text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
        }`}
        onClick={onLinkClick}
      >
        Home
      </Link>

      {/* Dynamic category sections */}
      {navigationConfig.map((config) => {
        const filteredCategories = categories.filter((category) =>
          config.categoryKeywords.some((keyword) =>
            category.title.toLowerCase().includes(keyword.toLowerCase()) ||
            category.handle.toLowerCase().includes(keyword.toLowerCase())
          )
        );

        const filteredTags = tags.filter((tag) =>
          config.tagKeywords.some((keyword) =>
            tag.toLowerCase().includes(keyword.toLowerCase())
          )
        );

        if (filteredCategories.length === 0 && filteredTags.length === 0) {
          return null;
        }

        return (
          <div key={config.title}>
            <button
              onClick={() => toggleSection(config.title)}
              className="w-full flex items-center justify-between px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out text-gray-700 hover:bg-gray-100 hover:text-[#800020]"
            >
              <span>{config.title}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  expandedSection === config.title ? "rotate-180" : ""
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

            {expandedSection === config.title && (
              <div className="ml-4 space-y-1">
                {/* Categories */}
                {filteredCategories.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-600">Categories</div>
                    {filteredCategories.map((category) => (
                      <button
                        key={category.handle}
                        onClick={() => handleCategoryClick(category.handle)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#800020] rounded transition-colors duration-200"
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {filteredTags.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-sm font-semibold text-gray-600">Tags</div>
                    <div className="px-4 flex flex-wrap gap-1">
                      {filteredTags.slice(0, 6).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-[#800020] hover:text-white rounded-full transition-colors duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* About */}
      <Link
        href="/about"
        className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
          pathname === "/about"
            ? 'bg-[#800020] text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
        }`}
        onClick={onLinkClick}
      >
        About
      </Link>

      {/* Contact */}
      <Link
        href="/contact"
        className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
          pathname === "/contact"
            ? 'bg-[#800020] text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
        }`}
        onClick={onLinkClick}
      >
        Contact
      </Link>

      {/* All Products - Last item */}
      <Link
        href="/products"
        className={`block px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out ${
          pathname === "/products"
            ? 'bg-[#800020] text-white font-bold shadow-md'
            : 'text-gray-700 hover:bg-gray-100 hover:text-[#800020]'
        }`}
        onClick={onLinkClick}
      >
        All Products
      </Link>
    </nav>
  );
};

export default MobileEnhancedNavigation;
