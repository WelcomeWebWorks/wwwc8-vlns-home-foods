"use client";

import { Collection } from "@/lib/shopify/types";
import { getAllTags, getCollections } from "@/lib/shopify";
import { createUrl } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { isCategoryActive, isAllProductsActive, createCategoryUrl } from "@/lib/utils/navigationUtils";
import { BsGrid3X3Gap, BsPerson, BsList } from "react-icons/bs";
import { FaUser, FaTh, FaBars, FaTimes, FaChevronUp, FaHome } from "react-icons/fa";
import Image from "next/image";

interface MobileFooterNavigationProps {
  onMenuClick: () => void;
  cartQuantity?: number;
  cartHighlighted?: boolean;
  showSidebar?: boolean;
}

const MobileFooterNavigation: React.FC<MobileFooterNavigationProps> = ({
  onMenuClick,
  cartQuantity = 0,
  cartHighlighted = false,
  showSidebar = false,
}) => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCollections();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category modal toggle
  const handleCategoryClick = () => {
    setShowCategoryModal(!showCategoryModal);
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryModal(false);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCategoryModal(false);
  };

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowCategoryModal(false);
      }
    };

    if (showCategoryModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryModal]);

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

  // Define main categories for quick access
  const mainCategories = [
    {
      id: "sweets",
      name: "Sweets",
      icon: "🍯",
      keywords: ["sweet", "laddu", "halwa", "burfi", "mysore", "dessert", "mithai"],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "pickles",
      name: "Pickles",
      icon: "🥒",
      keywords: ["pickle", "achar", "mango", "lime", "chili", "gongura"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "snacks",
      name: "Namkeen",
      icon: "🥜",
      keywords: ["namkeen", "snack", "mixture", "chips", "murukku", "sev"],
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "daily-essentials",
      name: "Essentials",
      icon: "🏠",
      keywords: ["essential", "daily", "oil", "ghee", "flour", "rice", "dal"],
      color: "from-blue-500 to-indigo-500"
    }
  ];

  const isHomeActive = pathname === "/";
  const isProductsActive = isAllProductsActive(pathname, searchParams);
  const isAccountActive = pathname === "/login" || pathname === "/sign-up";

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl lg:hidden" suppressHydrationWarning={true}>
        <div className="flex items-center justify-around py-2 px-4" suppressHydrationWarning={true}>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl" suppressHydrationWarning={true}>
            <div className="w-8 h-8 rounded-xl bg-gray-100" suppressHydrationWarning={true}></div>
            <span className="text-xs font-medium mt-1 text-gray-600" suppressHydrationWarning={true}>Home</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl" suppressHydrationWarning={true}>
            <div className="w-8 h-8 rounded-xl bg-gray-100" suppressHydrationWarning={true}></div>
            <span className="text-xs font-medium mt-1 text-gray-600" suppressHydrationWarning={true}>Products</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl" suppressHydrationWarning={true}>
            <div className="w-8 h-8 rounded-xl bg-gray-100" suppressHydrationWarning={true}></div>
            <span className="text-xs font-medium mt-1 text-gray-600" suppressHydrationWarning={true}>Cart</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl" suppressHydrationWarning={true}>
            <div className="w-8 h-8 rounded-xl bg-gray-100" suppressHydrationWarning={true}></div>
            <span className="text-xs font-medium mt-1 text-gray-600" suppressHydrationWarning={true}>Account</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around py-2 px-4">
        
        {/* Home Button */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-gray-100 active:scale-95 group"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isHomeActive ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg' : 'bg-gray-100 text-gray-600 group-hover:bg-[#800020] group-hover:text-white'
          }`}>
            <FaHome className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
            isHomeActive ? 'text-[#800020]' : 'text-gray-600 group-hover:text-[#800020]'
          }`}>
            Home
          </span>
        </Link>

        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-gray-100 active:scale-95 group"
          aria-label="Open menu"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            showSidebar ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg' : 'bg-gray-100 text-gray-600 group-hover:bg-[#800020] group-hover:text-white'
          }`}>
            <FaBars className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
            showSidebar ? 'text-[#800020]' : 'text-gray-600 group-hover:text-[#800020]'
          }`}>
            Menu
          </span>
        </button>

        {/* Categories Button */}
        <button
          onClick={handleCategoryClick}
          className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-gray-100 active:scale-95 group"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isProductsActive || showCategoryModal ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg' : 'bg-gray-100 text-gray-600 group-hover:bg-[#800020] group-hover:text-white'
          }`}>
            <FaTh className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
            isProductsActive || showCategoryModal ? 'text-[#800020]' : 'text-gray-600 group-hover:text-[#800020]'
          }`}>
            Categories
          </span>
        </button>


        {/* Cart Button */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-gray-100 active:scale-95 group relative ${
            cartHighlighted ? 'cart-highlighted' : ''
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            cartHighlighted 
              ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 group-hover:bg-[#800020] group-hover:text-white'
          }`}>
             <Image
               src="/images/shopping-cart.svg"
               alt="Shopping Cart"
               width={24}
               height={24}
               className="w-6 h-6"
             />
          </div>
          <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
            cartHighlighted 
              ? 'text-[#800020] font-semibold' 
              : 'text-gray-600 group-hover:text-[#800020]'
          }`}>
            Cart
          </span>
          
          {/* Cart Quantity Badge */}
          {cartQuantity > 0 && (
            <div className={`absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white ${
              cartHighlighted ? 'animate-pulse bg-gradient-to-r from-[#800020] to-[#600018]' : 'bg-[#800020]'
            }`}>
              {cartQuantity > 99 ? '99+' : cartQuantity}
            </div>
          )}
        </Link>

        {/* Account Button */}
        <Link
          href="/login"
          className="flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:bg-gray-100 active:scale-95 group"
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isAccountActive ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg' : 'bg-gray-100 text-gray-600 group-hover:bg-[#800020] group-hover:text-white'
          }`}>
            <FaUser className="w-4 h-4" />
          </div>
          <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
            isAccountActive ? 'text-[#800020]' : 'text-gray-600 group-hover:text-[#800020]'
          }`}>
            Account
          </span>
        </Link>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={handleModalClose}
          />
          
          {/* Modal Content */}
          <div
            ref={modalRef}
            className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl transform transition-all duration-500 ease-out animate-slide-up"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Our Categories</h2>
              <button
                onClick={handleModalClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {mainCategories.map((category) => {
                  const categoryHandle = findCategoryHandle(category.keywords);
                  const categoryUrl = categoryHandle ? createCategoryUrl(categoryHandle) : '/products';
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <Link
                      key={category.id}
                      href={categoryUrl}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`group/category flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#800020] to-[#600018] text-white shadow-lg' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white text-2xl mb-3 group-hover/category:scale-110 transition-transform duration-300 ${
                        isSelected ? 'ring-4 ring-white ring-opacity-50' : ''
                      }`}>
                        {category.icon}
                      </div>
                      <span className={`text-sm font-semibold text-center ${
                        isSelected ? 'text-white' : 'text-gray-700'
                      }`}>
                        {category.name}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* View All Products Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/products"
                  onClick={() => setShowCategoryModal(false)}
                  className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-[#800020] to-[#600018] text-white rounded-2xl font-semibold hover:from-[#600018] hover:to-[#500015] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaTh className="w-5 h-5 mr-2" />
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileFooterNavigation;
