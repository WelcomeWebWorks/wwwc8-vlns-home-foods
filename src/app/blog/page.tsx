import { Suspense } from "react";
import { getBlogArticles } from "@/lib/shopify";
import BlogGrid from "@/layouts/components/BlogGrid";
import SkeletonBlog from "@/layouts/components/loadings/skeleton/SkeletonBlog";
import SeoMeta from "@/layouts/partials/SeoMeta";

export const dynamic = "force-dynamic";

const ShowBlogs = async () => {
  const { articles } = await getBlogArticles({ first: 20 });
  return <BlogGrid articles={articles} />;
};

const BlogPage = () => {
  return (
    <>
      <SeoMeta 
        title="Our Blog - VLNS Home Foods"
        description="Discover the stories, traditions, and secrets behind authentic Andhra Pradesh cuisine through our blog articles."
      />
      
      {/* Blog Section */}
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
              <span className="text-sm font-semibold text-[#800020]">Our Blog</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              Discover Our
              <span className="block bg-gradient-to-r from-[#800020] to-[#600018] bg-clip-text text-transparent">
                Culinary Stories
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: '400'
            }}>
              Explore the rich heritage, traditional recipes, and authentic flavors of Andhra Pradesh 
              through our carefully curated blog articles and culinary insights
            </p>
          </div>
          
          <Suspense fallback={<SkeletonBlog />}>
            <ShowBlogs />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
