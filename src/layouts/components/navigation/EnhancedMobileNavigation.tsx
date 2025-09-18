"use client";

import { Collection } from "@/lib/shopify/types";
import { getAllTags, getCollections } from "@/lib/shopify";
import { createUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isCategoryActive, isTagActive, isAllProductsActive, createCategoryUrl } from "@/lib/utils/navigationUtils";

interface INavigationLink {
  name: string;
  url: string;
}

interface EnhancedMobileNavigationProps {
  staticMenuItems: INavigationLink[];
  pathname: string;
  onLinkClick: () => void;
}

const isMenuItemActive = (menu: INavigationLink, pathname: string) => {
  return (pathname === `${menu.url}/` || pathname === menu.url) && "nav-active";
};

const EnhancedMobileNavigation: React.FC<EnhancedMobileNavigationProps> = ({
  staticMenuItems,
  pathname,
  onLinkClick,
}) => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Function to find the actual category handle from Shopify collections
  const findCategoryHandle = (categoryKeywords: string[]): string | null => {
    if (!categories || categories.length === 0) return null;
    
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

  // Contact information
  const contactInfo = {
    phone: "+91 9581154327",
    email: "info@vlnshomefoods.com",
    address: "D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235",
    whatsapp: "+91 9581154327"
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Menu */}
      <nav className="space-y-3">
        {/* Home */}
        <Link
          href="/"
          className={`group block px-6 py-5 text-base font-medium rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 ${
            pathname === "/"
              ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold shadow-2xl shadow-[#800020]/30'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:text-[#800020] border-2 border-gray-200 hover:border-[#800020]/30 hover:shadow-lg'
          }`}
          onClick={onLinkClick}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              pathname === "/"
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="font-semibold">Home</span>
          </div>
        </Link>

        {/* Direct link categories (no dropdowns) */}
        {directLinkCategories.map((config, index) => {
          const isActive = isCategoryActive(pathname, searchParams, config.categoryKeywords);
          const categoryHandle = findCategoryHandle(config.categoryKeywords);
          const categoryUrl = categoryHandle ? createCategoryUrl(categoryHandle) : '/products';
          
          return (
            <Link
              key={`mobile-direct-${index}`}
              href={categoryUrl}
              className={`group block px-6 py-5 text-base font-medium rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold shadow-2xl shadow-[#800020]/30'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:text-[#800020] border-2 border-gray-200 hover:border-[#800020]/30 hover:shadow-lg'
              }`}
              onClick={onLinkClick}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="font-semibold">{config.title}</span>
              </div>
            </Link>
          );
        })}

        {/* Dropdown categories */}
        {dropdownCategories.map((config) => {
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

          const isDropdownActive = isCategoryActive(pathname, searchParams, config.categoryKeywords) || 
                                  isTagActive(pathname, searchParams, config.tagKeywords);

          return (
            <div key={config.title} className="space-y-2">
            <button
              onClick={() => toggleSection(config.title)}
              className={`group w-full flex items-center justify-between px-6 py-5 text-base font-medium rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 ${
                isDropdownActive
                  ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold shadow-2xl shadow-[#800020]/30'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:text-[#800020] border-2 border-gray-200 hover:border-[#800020]/30 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDropdownActive
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="font-semibold">{config.title}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isDropdownActive
                  ? 'bg-white/20 backdrop-blur-sm'
                  : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
              }`}>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
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
              </div>
            </button>

              {expandedSection === config.title && (
                <div className="ml-6 space-y-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  {/* Categories */}
                  {filteredCategories.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Categories
                      </h4>
                      <div className="space-y-2">
                        {filteredCategories.map((category) => (
                          <button
                            key={category.handle}
                            onClick={() => handleCategoryClick(category.handle)}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white hover:text-[#800020] rounded-lg transition-colors duration-200 border border-gray-200 hover:border-[#800020] hover:shadow-sm"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-[#800020] rounded-full"></div>
                              <span>{category.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {filteredTags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Popular Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {filteredTags.slice(0, 8).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="px-3 py-2 text-xs bg-white text-gray-700 hover:bg-[#800020] hover:text-white rounded-full transition-colors duration-200 border border-gray-200 hover:border-[#800020] hover:shadow-sm"
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
          className={`group block px-6 py-5 text-base font-medium rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 ${
            pathname === "/about"
              ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold shadow-2xl shadow-[#800020]/30'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:text-[#800020] border-2 border-gray-200 hover:border-[#800020]/30 hover:shadow-lg'
          }`}
          onClick={onLinkClick}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              pathname === "/about"
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold">About Us</span>
          </div>
        </Link>

        {/* Contact */}
        <Link
          href="/contact"
          className={`group block px-6 py-5 text-base font-medium rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 ${
            pathname === "/contact"
              ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold shadow-2xl shadow-[#800020]/30'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:text-[#800020] border-2 border-gray-200 hover:border-[#800020]/30 hover:shadow-lg'
          }`}
          onClick={onLinkClick}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              pathname === "/contact"
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="font-semibold">Contact</span>
          </div>
        </Link>

        {/* All Products */}
        <Link
          href="/products"
          className={`group block px-6 py-5 text-base font-medium rounded-2xl transition-all duration-500 ease-out transform hover:scale-105 ${
            isAllProductsActive(pathname, searchParams)
              ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold shadow-2xl shadow-[#800020]/30'
              : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:text-[#800020] border-2 border-gray-200 hover:border-[#800020]/30 hover:shadow-lg'
          }`}
          onClick={onLinkClick}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isAllProductsActive(pathname, searchParams)
                ? 'bg-white/20 backdrop-blur-sm'
                : 'bg-[#800020]/10 group-hover:bg-[#800020]/20'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="font-semibold">All Products</span>
          </div>
        </Link>
      </nav>

      {/* Contact Information Section - Bottom */}
      <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-[#800020] to-[#600018]">
        <div className="bg-gradient-to-br from-[#800020] via-[#70001a] to-[#600018] rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold ml-3 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Get in Touch
            </h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Phone */}
            <a 
              href={`tel:${contactInfo.phone}`} 
              className="group flex items-center space-x-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Call Us</p>
                <p className="text-white font-semibold">{contactInfo.phone}</p>
              </div>
            </a>

            {/* Email */}
            <a 
              href={`mailto:${contactInfo.email}`} 
              className="group flex items-center space-x-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Email Us</p>
                <p className="text-white font-semibold text-sm">{contactInfo.email}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center space-x-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">WhatsApp</p>
                <p className="text-white font-semibold">{contactInfo.whatsapp}</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-white/80 font-medium">Location</p>
                <p className="text-white font-semibold">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMobileNavigation;
