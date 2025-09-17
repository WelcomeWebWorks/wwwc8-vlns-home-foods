"use client";

import { FaTruck, FaStar, FaGift, FaHeart } from "react-icons/fa";

const FeaturesBanner = () => {
  const features = [
    {
      icon: FaTruck,
      text: "WORLDWIDE",
      description: "Shipping & Delivery"
    },
    {
      icon: FaStar,
      text: "FRESHLY MADE",
      description: "Quality & Freshness"
    },
    {
      icon: FaGift,
      text: "GIFTING",
      description: "Gift Services"
    },
    {
      icon: FaHeart,
      text: "AUTHENTIC",
      description: "Traditional Taste"
    }
  ];

  return (
    <section className="py-4 md:py-6" style={{ backgroundColor: '#D3AF37' }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-2">
                  <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-[#800020]" />
                </div>
                <div className="text-[#800020] font-primary font-bold text-sm md:text-base uppercase tracking-wide">
                  {feature.text}
                </div>
                <div className="text-[#800020]/80 font-primary text-xs md:text-sm font-medium mt-1 hidden md:block">
                  {feature.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBanner;
