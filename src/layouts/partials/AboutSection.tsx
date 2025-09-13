import Image from "next/image";
import Link from "next/link";
import ImageFallback from "@/helpers/ImageFallback";

const AboutSection = () => {
  return (
    <section className="section dark:bg-darkmode-light" style={{ backgroundColor: '#fffef7' }}>
      <div className="container">
        <div className="row items-center">
          {/* About Image */}
          <div className="col-12 lg:col-6 mb-8 lg:mb-0">
            <div className="relative">
              <ImageFallback
                src="/images/aboutUs.png"
                alt="VLNS Home Foods - Authentic Andhra Pradesh Flavors"
                width={600}
                height={400}
                className="rounded-lg shadow-lg w-full h-auto"
                priority={false}
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-lg"></div>
            </div>
          </div>

          {/* About Content */}
          <div className="col-12 lg:col-6">
            <div className="lg:pl-8">
              {/* Main Heading */}
              <h2 className="h2 mb-6 text-text-dark dark:text-darkmode-text-dark">
                Discover the Authentic Taste of
                <span className="text-primary"> Andhra Pradesh Heritage</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-text-light dark:text-darkmode-text-light mb-6 leading-relaxed">
                Welcome to <strong>VLNS Home Foods</strong>, your one-stop shop for authentic Andhra Pradesh flavors. 
                We're a family-run business dedicated to bringing you the timeless tastes of homemade sweets, 
                savory snacks, and spicy pickles, crafted with love and tradition.
              </p>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark dark:text-darkmode-text-dark mb-1">
                      Traditional Recipes
                    </h4>
                    <p className="text-sm text-text-light dark:text-darkmode-text-light">
                      Time-honored recipes passed down through generations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark dark:text-darkmode-text-dark mb-1">
                      Fresh Ingredients
                    </h4>
                    <p className="text-sm text-text-light dark:text-darkmode-text-light">
                      Locally sourced, premium quality ingredients
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark dark:text-darkmode-text-dark mb-1">
                      Small Batches
                    </h4>
                    <p className="text-sm text-text-light dark:text-darkmode-text-light">
                      Meticulously prepared for exceptional quality
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark dark:text-darkmode-text-dark mb-1">
                      Worldwide Delivery Available
                    </h4>
                    <p className="text-sm text-text-light dark:text-darkmode-text-light">
                      Free delivery across India, international shipping available
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="btn btn-primary btn-lg inline-flex items-center justify-center"
                >
                  Learn More About Us
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="btn btn-outline-primary btn-lg inline-flex items-center justify-center"
                >
                  Explore Our Products
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
