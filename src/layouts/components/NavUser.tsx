
"use client";

import { getUserDetails } from "@/lib/shopify";
import type { user } from "@/lib/shopify/types";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Gravatar from "react-gravatar";
import { BsPerson } from "react-icons/bs";

export const fetchUser = async () => {
  try {
    const accessToken = Cookies.get("token");

    if (!accessToken) {
      return null;
    } else {
      const userDetails: user = await getUserDetails(accessToken);
      const userInfo = userDetails.customer;
      return userInfo;
    }
  } catch (error) {
    // console.log("Error fetching user details:", error);
    return null;
  }
};

const NavUser = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<any>();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await fetchUser();
      setUser(userInfo);
    };

    getUser();
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="relative">
      {user ? (
        <button
          onClick={toggleDropdown}
          className="relative cursor-pointer flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-x-2">
            <div className="h-8 w-8 border-2 border-[#800020] rounded-full overflow-hidden">
              <Gravatar
                email={user?.email}
                style={{ borderRadius: "50px" }}
                key={user?.email}
              />
            </div>
            <div className="leading-none max-md:hidden">
              <div className="flex items-center">
                <p className="block text-gray-800 text-sm font-medium truncate">
                  {user?.firstName?.split(" ")[0]}
                </p>
                <svg
                  className="w-4 text-gray-600 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <Link
          className="text-2xl text-gray-700 hover:text-[#800020] flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-all duration-200 shadow-sm"
          href="/sign-up"
          aria-label="create account"
        >
          <BsPerson />
        </Link>
      )}

      {dropdownOpen && (
        <div className="z-20 text-center absolute w-full right-0 bg-white shadow-lg rounded-lg mt-2 border border-gray-200">
          <button 
            onClick={handleLogout} 
            className="w-full bg-[#800020] hover:bg-[#600018] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavUser;
