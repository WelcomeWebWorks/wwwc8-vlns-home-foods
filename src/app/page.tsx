export const dynamic = "force-dynamic";

import CollectionsGrid from "@/layouts/components/CollectionsGrid";
import HeroSlider from "@/layouts/components/HeroSlider";
import EnhancedHeroSlider from "@/layouts/components/EnhancedHeroSlider";
import SkeletonCategory from "@/layouts/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/layouts/components/loadings/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { getCollectionProducts, getCollections } from "@/lib/shopify";
import AboutSection from "@/layouts/partials/AboutSection";
import CallToAction from "@/layouts/partials/CallToAction";
import FeaturedProductsGrid from "@/layouts/components/FeaturedProductsGrid";
import BlogSection from "@/layouts/components/BlogSection";
import SeoMeta from "@/layouts/partials/SeoMeta";
import StructuredData from "@/layouts/components/StructuredData";
import { Suspense } from "react";

const { collections } = config.shopify;

const ShowHeroSlider = async () => {
  const sliderImages = await getCollectionProducts({
    collection: collections.hero_slider,
  });
  const { products } = sliderImages;
  return <HeroSlider products={products} />;
};

const ShowCollections = async () => {
  const collections = await getCollections();
  return <CollectionsGrid collections={collections} />;
};

const ShowFeaturedProducts = async () => {
  const { pageInfo, products } = await getCollectionProducts({
    collection: collections.featured_products,
    reverse: false,
  });
  return <FeaturedProductsGrid products={products} />;
};

const Home = () => {
  const callToAction = getListPage("sections/call-to-action.md");

  return (
    <>
      <SeoMeta 
        title="VLNS Home Foods - Authentic Andhra Pradesh Flavors"
        meta_title="VLNS Home Foods - Authentic Andhra Pradesh Flavors | Traditional Sweets, Pickles & Snacks"
        description="Experience authentic Andhra Pradesh flavors with VLNS Home Foods. Traditional homemade sweets, spicy pickles, and savory snacks delivered to your doorstep. Family recipes passed down through generations."
        keywords="Andhra Pradesh food, traditional Indian sweets, homemade pickles, authentic Indian snacks, VLNS Home Foods, Guntur food, Indian cuisine, traditional recipes, spicy pickles, crispy snacks, homemade sweets"
        image="/images/og-home.png"
        type="website"
        siteName="VLNS Home Foods"
      />
      <StructuredData type="Organization" />
      <StructuredData type="LocalBusiness" />
      {/* Enhanced Hero Section with Static Images */}
      <section className="hero-section">
        <EnhancedHeroSlider />
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Collections section  */}
      <section className="section bg-light dark:bg-darkmode-light relative overflow-hidden" style={{ backgroundColor: '#fffef7' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#800020]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#600018]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12 md:mb-20">
            {/* Section Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#800020]/10 to-[#600018]/10 rounded-full mb-6">
              <svg className="w-5 h-5 text-[#800020] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-[#800020]">Our Collections</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              Discover Our
              <span className="block bg-gradient-to-r from-[#800020] to-[#600018] bg-clip-text text-transparent">
                Authentic Collections
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: '400'
            }}>
              Explore the rich heritage and authentic flavors of Andhra Pradesh through our carefully curated collections, 
              each crafted with traditional recipes and premium ingredients
            </p>
          </div>
          
          <Suspense fallback={<SkeletonCategory />}>
            <ShowCollections />
          </Suspense>
        </div>
      </section>

      {/* Featured Products section  */}
      <section className="section bg-light dark:bg-darkmode-light relative overflow-hidden" style={{ backgroundColor: '#fffef7' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-[#800020]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#600018]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12 md:mb-20">
            {/* Section Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#800020]/10 to-[#600018]/10 rounded-full mb-6">
              <svg className="w-5 h-5 text-[#800020] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold text-[#800020]">Featured Products</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              Handpicked
              <span className="block bg-gradient-to-r from-[#800020] to-[#600018] bg-clip-text text-transparent">
                Traditional Delicacies
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: '400'
            }}>
              Discover our carefully curated selection of authentic Andhra Pradesh delicacies, 
              each crafted with traditional recipes, premium ingredients, and generations of culinary expertise
            </p>
          </div>
          
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <ShowFeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      <CallToAction data={callToAction} />
    </>
  );
};

export default Home;
