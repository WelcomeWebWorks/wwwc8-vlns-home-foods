"use client";

import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const BlogSection = () => {
  // Professional blog posts related to Andhra Pradesh cuisine and VLNS Home Foods
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "The Rich Heritage of Andhra Pradesh Cuisine: A Culinary Journey",
      excerpt: "Discover the authentic flavors and traditional cooking methods that make Andhra Pradesh cuisine one of India's most celebrated culinary traditions.",
      content: "Andhra Pradesh cuisine is renowned for its bold flavors, aromatic spices, and traditional cooking techniques that have been passed down through generations...",
      author: "Chef Rajesh Kumar",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Cuisine Heritage",
      slug: "andhra-pradesh-cuisine-heritage"
    },
    {
      id: "2",
      title: "Traditional Pickle Making: The Art of Preserving Flavors",
      excerpt: "Learn about the ancient techniques of pickle making that have been perfected over centuries in Andhra Pradesh households.",
      content: "Pickle making in Andhra Pradesh is not just a culinary practice but an art form that preserves the essence of seasonal ingredients...",
      author: "Dr. Priya Sharma",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Traditional Recipes",
      slug: "traditional-pickle-making-art"
    },
    {
      id: "3",
      title: "Spice Blends and Masalas: The Heart of Andhra Cooking",
      excerpt: "Explore the secret spice combinations and masala preparations that give Andhra dishes their distinctive taste and aroma.",
      content: "The art of spice blending in Andhra Pradesh is a carefully guarded tradition that transforms simple ingredients into extraordinary dishes...",
      author: "Master Chef Venkatesh",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Spices & Masalas",
      slug: "spice-blends-masalas-andhra-cooking"
    },
    {
      id: "4",
      title: "Health Benefits of Traditional Andhra Ingredients",
      excerpt: "Discover the nutritional value and health benefits of traditional ingredients used in Andhra Pradesh cuisine.",
      content: "Traditional Andhra ingredients are not just flavorful but also packed with nutritional benefits that have been recognized for centuries...",
      author: "Dr. Anjali Reddy",
      date: "2024-01-01",
      readTime: "8 min read",
      category: "Health & Nutrition",
      slug: "health-benefits-traditional-andhra-ingredients"
    },
    {
      id: "5",
      title: "Festival Foods: Celebrating with Authentic Andhra Delicacies",
      excerpt: "Explore the special dishes prepared during festivals and celebrations in Andhra Pradesh households.",
      content: "Festivals in Andhra Pradesh are incomplete without the traditional delicacies that bring families together and celebrate the rich culinary heritage...",
      author: "Cultural Food Expert",
      date: "2023-12-28",
      readTime: "6 min read",
      category: "Festival Foods",
      slug: "festival-foods-andhra-delicacies"
    },
    {
      id: "6",
      title: "From Farm to Table: The Journey of Our Authentic Ingredients",
      excerpt: "Follow the journey of our carefully sourced ingredients from local farms to your dining table.",
      content: "At VLNS Home Foods, we believe in the farm-to-table philosophy, ensuring that every ingredient maintains its natural goodness...",
      author: "VLNS Team",
      date: "2023-12-25",
      readTime: "5 min read",
      category: "Our Story",
      slug: "farm-to-table-authentic-ingredients"
    }
  ];

  return (
    <section className="section bg-light dark:bg-darkmode-light" style={{ backgroundColor: '#fffef7' }}>
      <div className="container">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="h2 mb-4 text-text-dark dark:text-darkmode-text-dark">
            Our Blog
          </h2>
          <p className="text-lg md:text-xl text-text-light dark:text-darkmode-text-light max-w-3xl mx-auto">
            Discover the stories, traditions, and secrets behind authentic Andhra Pradesh cuisine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="group">
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-darkmode-light">
                {/* Image Container */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <ImageFallback
                    src="/images/aboutUs.png"
                    width={400}
                    height={300}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </div>
                  {/* Read Time Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-darkmode-body/90 backdrop-blur-sm text-text-dark dark:text-darkmode-text-dark px-3 py-1 rounded-full text-sm font-medium">
                    {post.readTime}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-dark dark:text-darkmode-text-dark mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-text-light dark:text-darkmode-text-light text-sm md:text-base mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-text-light dark:text-darkmode-text-light mb-4">
                    <div className="flex items-center">
                      <FaUser className="w-4 h-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-4 h-4 mr-2" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-primary hover:text-[#600018] font-semibold transition-colors duration-300"
                  >
                    Read More
                    <FaArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="flex justify-center mt-8 md:mt-12">
          <Link
            className="btn btn-primary btn-lg font-semibold px-8 py-4"
            href="/blog"
          >
            View All Articles
            <FaArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
