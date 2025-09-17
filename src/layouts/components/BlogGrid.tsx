"use client";

import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";
import { Article } from "@/lib/shopify/types";

interface BlogGridProps {
  articles: Article[];
}

const BlogGrid = ({ articles }: BlogGridProps) => {
  return (
    <div className="relative">
      {/* Texture Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10"></div>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23800020' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-[#800020]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-[#600018]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Articles Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#800020]/10 to-[#600018]/10 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-[#800020]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: '700'
          }}>
            No Blog Articles Found
          </h3>
          <p className="text-gray-600" style={{
            fontFamily: "'Inter', 'Helvetica', sans-serif"
          }}>
            We&apos;re working on creating amazing content for you. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-darkmode-light transform hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
          <ImageFallback
            src={article.image?.url || "/images/aboutUS.jpg"}
            width={400}
            height={300}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Article Badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#800020] to-[#600018] text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            Article
          </div>

          {/* Read More Button - Mobile & Tablet Only */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 md:hidden lg:hidden">
            <Link
              href={`/blog/${article.handle}`}
              className="bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Read More
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Article Title */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-darkmode-text-dark group-hover:text-[#800020] transition-colors duration-300 mb-3" style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            <Link href={`/blog/${article.handle}`}>
              {article.title}
            </Link>
          </h3>
          
          {/* Article Description */}
          <p className="text-gray-600 dark:text-darkmode-text-light text-sm md:text-base mb-4 leading-relaxed line-clamp-3" style={{
            fontFamily: "'Inter', 'Helvetica', sans-serif",
            fontWeight: '400'
          }}>
            {article.excerpt || article.seo?.description || "Discover the rich heritage and authentic flavors of Andhra Pradesh through our blog articles."}
          </p>

          {/* Read More Button - Desktop Only */}
          <div className="hidden md:block">
            <Link
              href={`/blog/${article.handle}`}
              className="inline-flex items-center text-[#800020] font-semibold text-sm group-hover:text-[#600018] transition-colors duration-300"
            >
              Explore Articles
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#800020]/20 transition-all duration-500"></div>
      </div>
    </div>
  );
};

export default BlogGrid;
