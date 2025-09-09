"use client";

import Logo from "@/components/Logo";
import config from "@/config/config.json";
import menu from "@/config/menu.json";
import social from "@/config/social.json";
import DynamicIcon from "@/helpers/DynamicIcon";
import { markdownify } from "@/lib/utils/textConverter";
import Link from "next/link";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaTruck, FaShieldAlt, FaHeadset, FaAward } from "react-icons/fa";

export interface ISocial {
  name: string;
  icon: string;
  link: string;
}

const Footer = () => {
  const { copyright } = config.params;

  return (
    <footer className="bg-light dark:bg-darkmode-light footer-bg">
      {/* Main Footer Content */}
      <div className="container">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Logo />
              </div>
              <p className="text-text-light dark:text-darkmode-text-light text-sm md:text-base leading-relaxed mb-6">
                VLNS Home Foods brings you the authentic taste of Andhra Pradesh with traditional recipes, 
                premium ingredients, and generations of culinary heritage.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-text-light dark:text-darkmode-text-light">
                  <FaPhone className="w-4 h-4 mr-3 text-primary" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center text-text-light dark:text-darkmode-text-light">
                  <FaEnvelope className="w-4 h-4 mr-3 text-primary" />
                  <span className="text-sm">info@vlnshomefoods.com</span>
                </div>
                <div className="flex items-start text-text-light dark:text-darkmode-text-light">
                  <FaMapMarkerAlt className="w-4 h-4 mr-3 mt-1 text-primary flex-shrink-0" />
                  <span className="text-sm">Andhra Pradesh, India</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {menu.footer.map((menu) => (
                  <li key={menu.name}>
                    <Link 
                      href={menu.url}
                      className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base"
                    >
                      {menu.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark mb-6">
                Our Products
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/products?c=sweets" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Traditional Sweets
                  </Link>
                </li>
                <li>
                  <Link href="/products?c=pickles" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Spicy Pickles
                  </Link>
                </li>
                <li>
                  <Link href="/products?c=snacks" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Savory Snacks
                  </Link>
                </li>
                <li>
                  <Link href="/products?c=masala-and-mixes" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Masala & Mixes
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    View All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark mb-6">
                Customer Service
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-sm md:text-base">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-8 border-t border-border dark:border-darkmode-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaTruck className="w-5 h-5 text-primary mr-3" />
                <div>
                  <div className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark">Free Shipping</div>
                  <div className="text-xs text-text-light dark:text-darkmode-text-light">All India Delivery</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaShieldAlt className="w-5 h-5 text-primary mr-3" />
                <div>
                  <div className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark">Secure Payment</div>
                  <div className="text-xs text-text-light dark:text-darkmode-text-light">100% Safe</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaHeadset className="w-5 h-5 text-primary mr-3" />
                <div>
                  <div className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark">24/7 Support</div>
                  <div className="text-xs text-text-light dark:text-darkmode-text-light">Always Here</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaAward className="w-5 h-5 text-primary mr-3" />
                <div>
                  <div className="text-sm font-semibold text-text-dark dark:text-darkmode-text-dark">Premium Quality</div>
                  <div className="text-xs text-text-light dark:text-darkmode-text-light">Authentic Taste</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="py-8 border-t border-border dark:border-darkmode-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark mb-4">
                Follow Us
              </h4>
              <ul className="flex gap-4">
                {social?.main.map((social: ISocial) => (
                  <li key={social.name}>
                    <a
                      aria-label={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="w-10 h-10 bg-primary hover:bg-[#600018] text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    >
                      <DynamicIcon className="w-5 h-5" icon={social.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="flex flex-col items-center md:items-end">
              <h4 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark mb-4">
                Stay Updated
              </h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary hover:bg-[#600018] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border py-6 dark:border-darkmode-border">
          <div className="flex flex-col md:flex-row gap-y-4 justify-between items-center text-text-light dark:text-darkmode-text-light">
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              {menu.footerCopyright.map((menu) => (
                <Link 
                  key={menu.name}
                  href={menu.url}
                  className="hover:text-primary transition-colors duration-300"
                >
                  {menu.name}
                </Link>
              ))}
            </div>
            <p
              className="text-sm font-light text-center md:text-right"
              dangerouslySetInnerHTML={markdownify(copyright)}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
