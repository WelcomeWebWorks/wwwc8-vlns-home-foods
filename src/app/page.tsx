export const dynamic = "force-dynamic";

import CollectionsGrid from "@/layouts/components/CollectionsGrid";
import HeroSlider from "@/layouts/components/HeroSlider";
import SkeletonCategory from "@/layouts/components/loadings/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/layouts/components/loadings/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { getCollectionProducts, getCollections } from "@/lib/shopify";
import AboutSection from "@/layouts/partials/AboutSection";
import CallToAction from "@/layouts/partials/CallToAction";
import FeaturedProductsGrid from "@/layouts/components/FeaturedProductsGrid";
import BlogSection from "@/layouts/components/BlogSection";
import ProfessionalBanner from "@/layouts/components/ProfessionalBanner";
import FeaturesBanner from "@/layouts/components/FeaturesBanner";
import SeoMeta from "@/layouts/partials/SeoMeta";
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
      <SeoMeta />
      {/* Full-width Hero Section */}
      <section className="hero-section">
        <Suspense>
          <ShowHeroSlider />
        </Suspense>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Collections section  */}
      <section className="section bg-light dark:bg-darkmode-light" style={{ backgroundColor: '#fffef7' }}>
        <div className="container">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="h2 mb-4 text-text-dark dark:text-darkmode-text-dark">
              Our Authentic Collections
            </h2>
            <p className="text-lg md:text-xl text-text-light dark:text-darkmode-text-light max-w-3xl mx-auto">
              Discover the rich heritage and authentic flavors of Andhra Pradesh through our carefully curated collections
            </p>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            <ShowCollections />
          </Suspense>
        </div>
      </section>

      {/* Featured Products section  */}
      <section className="section bg-light dark:bg-darkmode-light" style={{ backgroundColor: '#fffef7' }}>
        <div className="container">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="h2 mb-4 text-text-dark dark:text-darkmode-text-dark">
              Featured Products
            </h2>
            <p className="text-lg md:text-xl text-text-light dark:text-darkmode-text-light max-w-3xl mx-auto">
              Handpicked traditional delicacies made with love and authentic recipes
            </p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <ShowFeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Professional Banner */}
      <ProfessionalBanner />

      {/* Features Banner */}
      <FeaturesBanner />

      <CallToAction data={callToAction} />
    </>
  );
};

export default Home;
