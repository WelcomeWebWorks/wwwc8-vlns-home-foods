"use client";

import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowLeft, FaTag } from "react-icons/fa";
import { Article } from "@/lib/shopify/types";

interface BlogDetailProps {
  article: Article;
}

const BlogDetail = ({ article }: BlogDetailProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readingTime} min read`;
  };

  return (
    <div className="min-h-screen bg-light dark:bg-darkmode-light" style={{ backgroundColor: '#fffef7' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#800020]/10 via-transparent to-[#600018]/10"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-[#800020]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-[#600018]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10 py-8 md:py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#800020] hover:text-[#600018] font-semibold transition-colors duration-300"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          {/* Article Image */}
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-3xl shadow-2xl mb-8">
            <ImageFallback
              src={article.image?.url || "/images/aboutUS.jpg"}
              width={800}
              height={400}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center justify-between mb-6 text-sm text-gray-600 dark:text-darkmode-text-light">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FaUser className="w-4 h-4 mr-2 text-[#800020]" />
                <span style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}>
                  {article.author || "VLNS Team"}
                </span>
              </div>
              <div className="flex items-center">
                <FaCalendarAlt className="w-4 h-4 mr-2 text-[#800020]" />
                <span style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}>
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center text-[#800020] font-semibold" style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}>
              {getReadingTime(article.content)}
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            {article.title}
          </h1>

          {/* Article Excerpt */}
          {article.excerpt && (
            <div className="text-xl text-gray-600 dark:text-darkmode-text-light mb-8 leading-relaxed" style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              fontWeight: '400'
            }}>
              {article.excerpt}
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              <FaTag className="w-4 h-4 text-[#800020]" />
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-[#800020]/10 to-[#600018]/10 text-[#800020] rounded-full text-sm font-medium"
                  style={{ fontFamily: "'Inter', 'Helvetica', sans-serif" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-700 dark:text-darkmode-text-light leading-relaxed"
            style={{
              fontFamily: "'Inter', 'Helvetica', sans-serif",
              lineHeight: '1.8'
            }}
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkmode-text-dark mb-2" style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif"
                }}>
                  About the Author
                </h3>
                <p className="text-gray-600 dark:text-darkmode-text-light" style={{
                  fontFamily: "'Inter', 'Helvetica', sans-serif"
                }}>
                  {article.author || "VLNS Team"} - Expert in Andhra Pradesh cuisine and traditional cooking methods
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#800020] to-[#600018] text-white font-bold rounded-2xl hover:from-[#600018] hover:to-[#500015] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to All Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
