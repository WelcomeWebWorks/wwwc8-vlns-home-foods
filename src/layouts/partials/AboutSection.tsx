import Image from "next/image";
import Link from "next/link";
import ImageFallback from "@/helpers/ImageFallback";

const AboutSection = () => {
  return (
    <section className="section dark:bg-darkmode-light relative overflow-hidden" style={{ backgroundColor: '#fffef7' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#800020]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#600018]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Content Section - Top */}
        <div className="text-center mb-16">
          {/* Section Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#800020]/10 to-[#600018]/10 rounded-full mb-6">
            <svg className="w-5 h-5 text-[#800020] mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-[#800020]">Our Story</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Crafting Authentic
            <span className="block bg-gradient-to-r from-[#800020] to-[#600018] bg-clip-text text-transparent">
              Andhra Pradesh Heritage
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Where tradition meets taste, and every bite tells a story of generations
          </p>

          {/* Main Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Welcome to <strong className="text-[#800020]">VLNS Home Foods</strong>, where we bring you the authentic flavors of Andhra Pradesh, 
              crafted with love and passed down through generations. Our family-run business is dedicated to preserving 
              the rich culinary heritage of our region, offering you the same traditional recipes that have been 
              cherished in our homes for decades.
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              From the spicy tang of our homemade pickles to the sweet indulgence of our traditional sweets, 
              every product is made with premium ingredients and time-honored techniques that ensure 
              the authentic taste you remember from your childhood.
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Traditional Recipes */}
            <div className="group text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#800020]/10 to-[#600018]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#800020]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Traditional Recipes</h3>
              <p className="text-gray-600">Time-honored recipes passed down through generations of our family</p>
            </div>

            {/* Premium Ingredients */}
            <div className="group text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#800020]/10 to-[#600018]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#800020]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Ingredients</h3>
              <p className="text-gray-600">Carefully selected, locally sourced ingredients of the highest quality</p>
            </div>

            {/* Handcrafted Quality */}
            <div className="group text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#800020]/10 to-[#600018]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#800020]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Handcrafted Quality</h3>
              <p className="text-gray-600">Each product is meticulously crafted in small batches for exceptional quality</p>
            </div>

            {/* Global Delivery */}
            <div className="group text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#800020]/10 to-[#600018]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-[#800020]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Delivery</h3>
              <p className="text-gray-600">Free delivery across India, worldwide shipping to bring taste home</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#800020] to-[#600018] text-white font-semibold rounded-2xl hover:from-[#600018] hover:to-[#500015] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Discover Our Story
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/products"
              className="group inline-flex items-center justify-center px-8 py-4 border-2 border-[#800020] text-[#800020] font-semibold rounded-2xl hover:bg-[#800020] hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Explore Our Products
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Image Section - Bottom */}
        <div className="relative">
          <div className="relative max-w-4xl mx-auto">
            <ImageFallback
              src="/images/aboutUs.png"
              alt="VLNS Home Foods - Authentic Andhra Pradesh Flavors"
              width={800}
              height={500}
              className="rounded-3xl shadow-2xl w-full h-auto"
              priority={false}
            />
            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#800020]/20 to-[#600018]/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#600018]/20 to-[#800020]/20 rounded-full blur-xl"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-[#800020]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-[#800020]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
