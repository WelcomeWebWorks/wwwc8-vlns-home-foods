"use client";

import Logo from "@/components/Logo";
import NavUser from "@/components/NavUser";
import SearchBar from "@/layouts/components/SearchBar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import EnhancedNavigation from "@/layouts/components/navigation/EnhancedNavigation";
import MobileEnhancedNavigation from "@/layouts/components/navigation/MobileEnhancedNavigation";
import EnhancedMobileNavigation from "@/layouts/components/navigation/EnhancedMobileNavigation";
import MobileFooterNavigation from "@/layouts/components/MobileFooterNavigation";

interface INavigationLink {
  name: string;
  url: string;
}

const isMenuItemActive = (menu: INavigationLink, pathname: string) => {
  return (pathname === `${menu.url}/` || pathname === menu.url) && "nav-active";
};

const Header: React.FC<{ children: any }> = ({ children }) => {
  const [navbarShadow, setNavbarShadow] = useState(false);
  const { main }: { main: INavigationLink[] } = menu;
  const { navigation_button, settings } = config;
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [cartHighlighted, setCartHighlighted] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    setShowSidebar(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarShadow(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [showSidebar]);

  // Monitor cart quantity changes for highlighting
  useEffect(() => {
    const checkCartQuantity = () => {
      // This would typically come from a cart context or API
      // For now, we'll simulate it with localStorage or a global state
      if (typeof window !== 'undefined') {
        const currentQuantity = parseInt(localStorage.getItem('cartQuantity') || '0');
        if (currentQuantity > cartQuantity) {
          setCartHighlighted(true);
          setTimeout(() => setCartHighlighted(false), 3000); // Highlight for 3 seconds
        }
        setCartQuantity(currentQuantity);
      }
    };

    // Check on mount
    checkCartQuantity();

    // Listen for storage changes (cart updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartQuantity') {
        checkCartQuantity();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates
    const interval = setInterval(checkCartQuantity, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [cartQuantity]);

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <header
      className={`header z-[99999] fixed top-0 left-0 right-0 ${navbarShadow ? "shadow-lg" : "shadow-none"}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        width: '100%',
        display: 'block'
      }}
    >
      <nav className="navbar container">
        {/* Desktop Layout - Restructured for desktop only */}
        <div className="hidden xl:block">
          {/* Top Row - Logo, Search, and Actions */}
          <div className="flex items-center justify-between w-full min-h-[35px] py-0.5">
            {/* Logo Section - Increased size */}
            <div className="flex items-center flex-shrink-0">
              <div className="scale-[0.6] origin-left">
                <Logo />
              </div>
            </div>

            {/* Search Bar - Centered */}
            {settings.search && (
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md">
                  <Suspense>
                    <SearchBar />
                  </Suspense>
                </div>
              </div>
            )}

            {/* Right Side Actions - Far right */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Theme Switcher */}
              <ThemeSwitcher className="hidden sm:block" />
              
              {/* Cart */}
              <Suspense fallback={children[0]}>{children[1]}</Suspense>

              {/* User Account */}
              {settings.account && (
                <div className="hidden sm:block">
                  <NavUser />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row - Navigation Menu - No gap */}
          <div className="flex justify-center w-full min-h-[30px] py-0.5">
            <EnhancedNavigation
              staticMenuItems={main}
              pathname={pathname}
            />
          </div>
        </div>

        {/* Tablet Layout - Single row for 480px to 1280px */}
        <div className="hidden sm:block xl:hidden">
          {/* Single Row Layout - Logo, Search, Actions */}
          <div className="flex items-center justify-between w-full min-h-[50px] py-2">
            {/* Logo Section - Smaller size */}
            <div className="flex items-center flex-shrink-0">
              <div className="scale-[0.4] origin-left">
                <Logo />
              </div>
            </div>

            {/* Search Bar - Centered */}
            {settings.search && (
              <div className="flex-1 flex justify-center px-4">
                <div className="w-full max-w-sm">
                  <Suspense>
                    <SearchBar />
                  </Suspense>
                </div>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Theme Switcher */}
              <ThemeSwitcher className="block" />
              
              {/* Cart */}
              <Suspense fallback={children[0]}>{children[1]}</Suspense>

              {/* User Account */}
              {settings.account && (
                <NavUser />
              )}

              {/* Tablet Menu Button */}
              <div className="relative z-50">
                <button
                  onClick={handleToggleSidebar}
                  className="flex flex-col items-center justify-center w-10 h-10 space-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                  aria-label="Toggle tablet menu"
                >
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      showSidebar ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      showSidebar ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      showSidebar ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Below 480px */}
        <div className="block sm:hidden">
          {/* Main Navigation Row - Reduced height */}
          <div className="mobile-nav-row flex items-center justify-between w-full px-2">
            {/* Logo Section - Decreased by 30% */}
            <div className="flex items-center flex-shrink-0">
              <div className="scale-[0.7] origin-left">
                <Logo />
              </div>
            </div>

            {/* Right Side Actions - Moved significantly to the left */}
            <div className="mobile-nav-actions">
              {/* Cart */}
              <Suspense fallback={children[0]}>{children[1]}</Suspense>

              {/* Mobile Menu Button - Moved significantly to the left */}
              <div className="relative z-50 mr-8">
                <button
                  onClick={handleToggleSidebar}
                  className="flex flex-col items-center justify-center w-10 h-10 space-y-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
                  aria-label="Toggle mobile menu"
                >
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      showSidebar ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      showSidebar ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block w-5 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                      showSidebar ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar - Mobile positioning with reduced spacing */}
          {settings.search && (
            <div className="mobile-search-container w-full">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
          )}
        </div>

        {/* Mobile sidebar overlay */}
        <div
          className={`fixed top-0 left-0 h-full bg-black bg-opacity-50 w-full z-40 transition-opacity duration-300 ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={handleToggleSidebar}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
        ></div>

        {/* Enhanced Mobile sidebar */}
        <div
          className={`fixed top-0 left-0 h-full dark:bg-darkmode-body w-full sm:w-96 z-50 transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
          style={{ 
            backgroundColor: '#fffef7',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header with Logo and Close Button - Fixed */}
          <div className="flex justify-between items-center p-6 pb-4 border-b-2 border-gradient-to-r from-[#800020] to-[#600018] flex-shrink-0">
            <div className="flex items-center">
              <Logo />
            </div>

            <button 
              onClick={handleToggleSidebar} 
              className="group flex items-center justify-center w-12 h-12 focus:outline-none focus:ring-2 focus:ring-[#800020] focus:ring-offset-2 rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-[#800020]/10 hover:to-[#600018]/10 hover:scale-105"
              aria-label="Close mobile menu"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-[#800020] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4" style={{ paddingBottom: '100px' }}>
            {/* Enhanced Mobile Navigation */}
            <EnhancedMobileNavigation
              staticMenuItems={main}
              pathname={pathname}
              onLinkClick={handleToggleSidebar}
            />

            {/* Footer Section */}
            {navigation_button.enable && (
              <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-[#800020] to-[#600018]">
                <div className="text-center">
                  <Link
                    className="group inline-block px-8 py-4 bg-gradient-to-r from-[#800020] to-[#600018] text-white font-semibold rounded-2xl hover:from-[#600018] hover:to-[#500015] transition-all duration-300 shadow-2xl hover:shadow-[#800020]/30 hover:scale-105 transform"
                    href={navigation_button.link}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{navigation_button.label}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Footer Navigation */}
      <Suspense fallback={<div className="h-16 bg-white dark:bg-darkmode-body border-t border-gray-200 dark:border-gray-700" suppressHydrationWarning={true}></div>}>
        <MobileFooterNavigation 
          onMenuClick={handleToggleSidebar}
          cartQuantity={cartQuantity}
          cartHighlighted={cartHighlighted}
          showSidebar={showSidebar}
        />
      </Suspense>
    </header>
  );
};

export default Header;
