"use client";

import Link from "next/link";
import { FaArrowRight, FaGift, FaTruck, FaShieldAlt, FaStar, FaMapMarkerAlt, FaHeart, FaAward } from "react-icons/fa";

const EnhancedMarketingBanners = () => {
  return (
    <>
      {/* Professional Banner - Enhanced with Texture Background */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ backgroundColor: '#800020' }}>
        {/* Texture Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center">
            {/* Main Banner Content */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight tracking-tight" style={{
                fontFamily: "'Playfair Display', 'Georgia', serif",
                fontWeight: '700',
                letterSpacing: '0.5px'
              }}>
                Experience Authentic
                <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Andhra Pradesh Flavors
                </span>
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed" style={{
                fontFamily: "'Inter', 'Helvetica', sans-serif",
                fontWeight: '400'
              }}>
                From traditional recipes to premium ingredients, we bring the authentic taste of Andhra Pradesh to your doorstep with generations of culinary expertise
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mb-12">
              <div className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <FaGift className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: '700'
                }}>Premium Quality</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed" style={{
                  fontFamily: "'Inter', 'Helvetica', sans-serif"
                }}>Handpicked ingredients for authentic taste and exceptional quality</p>
              </div>
              
              <div className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <FaTruck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: '700'
                }}>Worldwide Delivery</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed" style={{
                  fontFamily: "'Inter', 'Helvetica', sans-serif"
                }}>Free delivery across India, international shipping available worldwide</p>
              </div>
              
              <div className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <FaShieldAlt className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontWeight: '700'
                }}>Trusted Heritage</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed" style={{
                  fontFamily: "'Inter', 'Helvetica', sans-serif"
                }}>Generations of traditional recipes passed down through families</p>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/products"
                className="group bg-white text-[#800020] hover:bg-gray-100 font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center text-lg"
                style={{
                  fontFamily: "'Inter', 'Helvetica', sans-serif",
                  fontWeight: '700'
                }}
              >
                Shop Now
                <FaArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/about"
                className="group border-2 border-white text-white hover:bg-white hover:text-[#800020] font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center text-lg"
                style={{
                  fontFamily: "'Inter', 'Helvetica', sans-serif",
                  fontWeight: '700'
                }}
              >
                Learn More
                <FaArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner - Enhanced with Texture Background */}
      <section className="relative py-8 md:py-12 overflow-hidden" style={{ backgroundColor: '#D3AF37' }}>
        {/* Texture Background */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/10 via-transparent to-[#600018]/10"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800020' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm0 0c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-[#800020]/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-[#600018]/10 rounded-full blur-2xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: FaTruck,
                text: "IN / US",
                description: "Shipping & Delivery",
                color: "from-[#800020] to-[#600018]"
              },
              {
                icon: FaStar,
                text: "FRESHLY MADE",
                description: "Quality & Freshness",
                color: "from-[#600018] to-[#800020]"
              },
              {
                icon: FaGift,
                text: "GIFTING",
                description: "Gift Services",
                color: "from-[#800020] to-[#600018]"
              },
              {
                icon: FaMapMarkerAlt,
                text: "FIND A STORE",
                description: "Store Locator",
                color: "from-[#600018] to-[#800020]"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group flex flex-col items-center text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-[#800020] font-bold text-sm md:text-base uppercase tracking-wide mb-1" style={{
                    fontFamily: "'Inter', 'Helvetica', sans-serif",
                    fontWeight: '700'
                  }}>
                    {feature.text}
                  </div>
                  <div className="text-[#800020]/80 text-xs md:text-sm font-medium" style={{
                    fontFamily: "'Inter', 'Helvetica', sans-serif",
                    fontWeight: '500'
                  }}>
                    {feature.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default EnhancedMarketingBanners;
