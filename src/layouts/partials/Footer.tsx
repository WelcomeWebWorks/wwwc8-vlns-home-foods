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
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
          <Logo />
              </div>
              <p className="text-text-light dark:text-darkmode-text-light text-base md:text-lg leading-relaxed mb-6">
                VLNS Home Foods brings you the authentic taste of Andhra Pradesh with traditional recipes, 
                premium ingredients, and generations of culinary heritage.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center text-text-light dark:text-darkmode-text-light">
                  <FaPhone className="w-5 h-5 mr-3 text-primary" />
                  <span className="text-base md:text-lg font-medium">+91 9581154327</span>
                </div>
                <div className="flex items-center text-text-light dark:text-darkmode-text-light">
                  <FaEnvelope className="w-5 h-5 mr-3 text-primary" />
                  <span className="text-base md:text-lg font-medium">info@vlnshomefoods.com</span>
                </div>
                <div className="flex items-start text-text-light dark:text-darkmode-text-light">
                  <FaMapMarkerAlt className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                  <span className="text-base md:text-lg font-medium">Andhra Pradesh, India</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark mb-6">
                Quick Links
              </h3>
              <ul className="space-y-4">
            {menu.footer.map((menu) => (
                  <li key={menu.name}>
                    <Link 
                      href={menu.url}
                      className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium"
                    >
                      {menu.name}
                    </Link>
              </li>
            ))}
          </ul>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark mb-6">
                Our Products
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/products?c=sweets" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Traditional Sweets
                  </Link>
                </li>
                <li>
                  <Link href="/products?c=pickles" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Spicy Pickles
                  </Link>
                </li>
                <li>
                  <Link href="/products?c=snacks" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Savory Snacks
                  </Link>
                </li>
                <li>
                  <Link href="/products?c=masala-and-mixes" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Masala & Mixes
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    View All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark mb-6">
                Customer Service
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/contact" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-text-light dark:text-darkmode-text-light hover:text-primary transition-colors duration-300 text-base md:text-lg font-medium">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-10 border-t border-border dark:border-darkmode-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaTruck className="w-6 h-6 text-primary mr-4" />
                <div>
                  <div className="text-base md:text-lg font-semibold text-text-dark dark:text-darkmode-text-dark">Free Shipping</div>
                  <div className="text-sm md:text-base text-text-light dark:text-darkmode-text-light">All India Delivery</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaShieldAlt className="w-6 h-6 text-primary mr-4" />
                <div>
                  <div className="text-base md:text-lg font-semibold text-text-dark dark:text-darkmode-text-dark">Secure Payment</div>
                  <div className="text-sm md:text-base text-text-light dark:text-darkmode-text-light">100% Safe</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaHeadset className="w-6 h-6 text-primary mr-4" />
                <div>
                  <div className="text-base md:text-lg font-semibold text-text-dark dark:text-darkmode-text-dark">24/7 Support</div>
                  <div className="text-sm md:text-base text-text-light dark:text-darkmode-text-light">Always Here</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <FaAward className="w-6 h-6 text-primary mr-4" />
                <div>
                  <div className="text-base md:text-lg font-semibold text-text-dark dark:text-darkmode-text-dark">Premium Quality</div>
                  <div className="text-sm md:text-base text-text-light dark:text-darkmode-text-light">Authentic Taste</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="py-10 border-t border-border dark:border-darkmode-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Social Media */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-xl md:text-2xl font-semibold text-text-dark dark:text-darkmode-text-dark mb-6">
                Follow Us
              </h4>
              <ul className="flex gap-6">
            {social?.main.map((social: ISocial) => (
              <li key={social.name}>
                <a
                  aria-label={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                      className="w-12 h-12 bg-primary hover:bg-[#600018] text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                      <DynamicIcon className="w-6 h-6" icon={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>

            {/* Newsletter Signup */}
            <div className="flex flex-col items-center md:items-end">
              <h4 className="text-xl md:text-2xl font-semibold text-text-dark dark:text-darkmode-text-dark mb-6">
                Stay Updated
              </h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 border border-border dark:border-darkmode-border rounded-lg bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base md:text-lg min-w-[250px]"
                />
                <button className="bg-primary hover:bg-[#600018] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-base md:text-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border py-8 dark:border-darkmode-border">
          <div className="flex flex-col md:flex-row gap-y-6 justify-between items-center text-text-light dark:text-darkmode-text-light">
            <div className="flex flex-col sm:flex-row gap-6 text-base">
              {menu.footerCopyright.map((menu) => (
                <Link 
                  key={menu.name}
                  href={menu.url}
                  className="hover:text-primary transition-colors duration-300 font-medium"
                >
                  {menu.name}
                </Link>
              ))}
            </div>
            <p
              className="text-base font-medium text-center md:text-right"
              dangerouslySetInnerHTML={markdownify(copyright)}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
