"use client";

import Link from "next/link";
import { FaArrowRight, FaGift, FaTruck, FaShieldAlt } from "react-icons/fa";

const ProfessionalBanner = () => {
  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: '#800020' }}>
      <div className="container">
        <div className="text-center">
          {/* Main Banner Content */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Experience Authentic Andhra Pradesh Flavors
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6">
              From traditional recipes to premium ingredients, we bring the authentic taste of Andhra Pradesh to your doorstep
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <FaGift className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Premium Quality</h3>
              <p className="text-white/80 text-sm">Handpicked ingredients for authentic taste</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <FaTruck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">All India Delivery</h3>
              <p className="text-white/80 text-sm">Fresh products delivered nationwide</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Trusted Heritage</h3>
              <p className="text-white/80 text-sm">Generations of traditional recipes</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="bg-white text-[#800020] hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center"
            >
              Shop Now
              <FaArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-[#800020] font-semibold px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center"
            >
              Learn More
              <FaArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalBanner;
