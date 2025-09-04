"use client";

import Logo from "@/components/Logo";
import NavUser from "@/components/NavUser";
import SearchBar from "@/components/SearchBar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

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

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <header
      className={`header z-50 ${settings.sticky_header && "sticky top-0"} ${navbarShadow ? "shadow-sm" : "shadow-none"}`}
    >
      <nav className="navbar container">
        {/* Top row: Logo, Cart, Account, Mobile Menu (Desktop) */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Logo />
          </div>

          {/* Desktop Search Bar - Hidden on mobile/tablet */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            {settings.search && (
              <Suspense>
                <SearchBar />
              </Suspense>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher className="mr-2" />
            <Suspense fallback={children[0]}>{children[1]}</Suspense>

            {settings.account && (
              <div className="ml-2">
                <NavUser />
              </div>
            )}

            {/* Modern Mobile menu button - Only visible on mobile/tablet */}
            <div className="relative z-50 block lg:hidden ml-2">
              <button
                onClick={handleToggleSidebar}
                className="flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    showSidebar ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    showSidebar ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    showSidebar ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Search Bar - Full width below 720px */}
        <div className="w-full mt-4 block lg:hidden">
          {settings.search && (
            <Suspense>
              <SearchBar />
            </Suspense>
          )}
        </div>

        {/* Bottom row: Horizontal Navigation (Desktop only) */}
        <div className="hidden lg:block w-full mt-4">
          <div className="flex justify-center">
            <ul className="flex space-x-8">
              {main.map((menu, i) => (
                <li key={`menu-${i}`}>
                  <Link
                    href={menu.url}
                    className={`nav-link text-lg font-medium hover:text-primary transition-colors ${isMenuItemActive(menu, pathname)}`}
                  >
                    {menu.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <div
          className={`fixed top-0 left-0 h-full bg-black bg-opacity-50 w-full z-40 transition-opacity duration-300 ${showSidebar ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={handleToggleSidebar}
        ></div>

        {/* Modern Mobile sidebar */}
        <div
          className={`fixed top-0 left-0 h-full bg-white dark:bg-darkmode-body overflow-y-auto w-full sm:w-80 p-6 z-50 transition-transform duration-300 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-border dark:border-darkmode-border">
            <Logo />

            <button 
              onClick={handleToggleSidebar} 
              className="flex flex-col items-center justify-center w-8 h-8 space-y-1 focus:outline-none"
              aria-label="Close mobile menu"
            >
              <span className="block w-6 h-0.5 bg-current rotate-45 translate-y-1.5" />
              <span className="block w-6 h-0.5 bg-current -rotate-45 -translate-y-1.5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {main.map((menu, i) => (
              <Link
                key={`mobile-menu-${i}`}
                href={menu.url}
                className={`block px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 ${
                  isMenuItemActive(menu, pathname) 
                    ? 'bg-primary text-white' 
                    : 'text-text-dark dark:text-darkmode-text-dark hover:bg-gray-100 dark:hover:bg-darkmode-light'
                }`}
                onClick={handleToggleSidebar}
              >
                {menu.name}
              </Link>
            ))}
            
            {navigation_button.enable && (
              <div className="mt-6 pt-4 border-t border-border dark:border-darkmode-border">
                <Link
                  className="btn btn-outline-primary btn-sm w-full text-center"
                  href={navigation_button.link}
                >
                  {navigation_button.label}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </nav>
    </header>
  );
};

export default Header;
