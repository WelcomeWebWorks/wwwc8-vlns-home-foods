import Social from "@/components/Social";
import { AddToCart } from "@/components/cart/AddToCart";
import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import ShowTags from "@/components/product/ShowTags";
import Tabs from "@/components/product/Tabs";
import { VariantSelector } from "@/components/product/VariantSelector";
import { DynamicPrice } from "@/components/product/DynamicPrice";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { getProduct, getProductRecommendations, getProducts } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { 
  FiTruck, 
  FiShield, 
  FiHeart, 
  FiShare2, 
  FiCheckCircle, 
  FiStar,
  FiClock,
  FiAward,
  FiRefreshCw,
  FiHome,
  FiPackage,
  FiCreditCard,
  FiTag,
  FiFileText
} from "react-icons/fi";

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const product = await getProduct(params.slug);
  if (!product) return notFound();
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
  };
};

const ProductSingle = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  return (
    <Suspense fallback={<LoadingProductGallery />}>
      <ShowProductSingle params={params} />
    </Suspense>
  );
};

export default ProductSingle;

const ShowProductSingle = async ({ params }: { params: { slug: string } }) => {
  const paymentsAndDelivery = getListPage("sections/payments-and-delivery.md");
  const { payment_methods, estimated_delivery } =
    paymentsAndDelivery.frontmatter;

  const { currencySymbol } = config.shopify;
  const product = await getProduct(params.slug);

  if (!product) return notFound();
  const {
    id,
    title,
    description,
    descriptionHtml,
    priceRange,
    compareAtPriceRange,
    images,
    options,
    variants,
    tags,
  } = product;

  // Try to get product recommendations first
  let relatedProducts = await getProductRecommendations(id);
  
  // If no recommendations are available, get recent products as fallback
  if (!relatedProducts || relatedProducts.length === 0) {
    try {
      const { products } = await getProducts({
        sortKey: "CREATED_AT",
        reverse: true,
      });
      // Filter out the current product and take the first 4 products
      relatedProducts = products
        .filter(product => product.id !== id)
        .slice(0, 4);
    } catch (error) {
      relatedProducts = [];
    }
  }

  const defaultVariantId = variants.length > 0 ? variants[0].id : undefined;

  return (
    <>
      {/* Enhanced Breadcrumb Navigation */}
      <section className="py-6 bg-gradient-to-r from-light to-secondary dark:from-darkmode-light dark:to-darkmode-secondary">
        <div className="container">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-primary hover:text-[#600018] transition-colors duration-200 flex items-center space-x-1">
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </a>
            <span className="text-text-light dark:text-darkmode-text-light">/</span>
            <a href="/products" className="text-primary hover:text-[#600018] transition-colors duration-200 flex items-center space-x-1">
              <FiPackage className="w-4 h-4" />
              <span>Products</span>
            </a>
            <span className="text-text-light dark:text-darkmode-text-light">/</span>
            <span className="text-text-dark dark:text-darkmode-text-dark font-medium truncate">{title}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-darkmode-body">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Gallery */}
            <div className="space-y-6">
              <Suspense>
                <ProductGallery images={images} />
              </Suspense>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Product Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark leading-tight mb-3">
                  {title}
                </h1>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-lg text-text-light dark:text-darkmode-text-light font-medium">(4.8/5)</span>
                      <span className="text-sm text-text-light dark:text-darkmode-text-light">• 127 reviews</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group">
                      <FiHeart className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                    </button>
                    <button className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 group">
                      <FiShare2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl p-6 border border-primary/20 dark:border-primary/30">
              <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <FiAward className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Special Price</span>
                  </div>
                <Suspense fallback={
                  <div className="flex gap-2 items-center">
                    <h4 className="text-text-light dark:text-darkmode-text-light max-md:h2">
                      {currencySymbol} {priceRange?.minVariantPrice.amount}{" "}
                      {priceRange?.minVariantPrice?.currencyCode}
                    </h4>
                  </div>
                }>
                  <DynamicPrice 
                    variants={variants} 
                    defaultVariantId={defaultVariantId}
                  />
                </Suspense>
                </div>
              </div>

              {/* Product Options */}
              <div className="space-y-6">
                {options && (
                  <VariantSelector
                    options={options}
                    variants={variants}
                    images={images}
                  />
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                <Suspense>
                  <AddToCart
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
                    stylesClass={"w-full bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-lg"}
                    handle={null}
                    defaultVariantId={defaultVariantId}
                  />
                </Suspense>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3">
                  <FiTruck className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">Free Delivery</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{estimated_delivery}</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center space-x-3">
                  <FiShield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Secure Payment</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">100% Protected</p>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-center space-x-3">
                  <FiRefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Easy Returns</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">30 Day Policy</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
                  <FiCreditCard className="w-5 h-5 text-primary" />
                  <span>Payment Methods</span>
                </h5>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <div className="flex flex-wrap items-center gap-4">
                  {payment_methods?.map(
                    (payment: { name: string; image_url: string }) => (
                        <div key={payment.name} className="bg-white dark:bg-darkmode-body border border-border dark:border-darkmode-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <Image
                          src={payment.image_url}
                          alt={payment.name}
                            width={48}
                            height={36}
                            className="w-[48px] h-[36px] object-contain"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
              </div>

              {/* Social Sharing */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
                  <FiShare2 className="w-5 h-5 text-primary" />
                  <span>Share this product</span>
                </h5>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <Social socialName={title} className="flex space-x-4" />
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="space-y-4">
                  <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
                    <FiTag className="w-5 h-5 text-primary" />
                    <span>Product Tags</span>
                  </h5>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <Suspense>
                    <ShowTags tags={tags} />
                  </Suspense>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Product Description Section */}
      {description && (
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-darkmode-body dark:to-gray-900">
          <div className="container">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full mb-6">
                  <FiFileText className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  Product Details
                </h2>
                <p className="text-lg text-text-light dark:text-darkmode-text-light max-w-2xl mx-auto">
                  Learn more about this authentic Andhra Pradesh product
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mt-6"></div>
              </div>
              <div className="bg-white dark:bg-darkmode-body rounded-3xl shadow-xl border border-border dark:border-darkmode-border overflow-hidden">
              <Tabs descriptionHtml={descriptionHtml} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Related Products Section */}
      <section className="py-20 bg-white dark:bg-darkmode-body relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10"></div>
        <div className="container relative">
          {/* Always show the section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full mb-6">
              <FiPackage className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  You Might Also Like
                </h2>
            <p className="text-xl text-text-light dark:text-darkmode-text-light max-w-3xl mx-auto mb-6">
                  Discover more authentic Andhra Pradesh products that complement your selection
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
          </div>
          
          {/* Enhanced Product Grid */}
          <div className="relative">
            {relatedProducts && relatedProducts.length > 0 ? (
              <>
                <LatestProducts products={relatedProducts.slice(0, 4)} />
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent/20 rounded-full"></div>
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-primary/30 rounded-full"></div>
                <div className="absolute top-1/4 -right-8 w-10 h-10 bg-accent/30 rounded-full"></div>
              </>
            ) : (
              /* Fallback message when no related products are available */
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                  <FiPackage className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-text-dark dark:text-darkmode-text-dark mb-4">
                  More Products Coming Soon
                </h3>
                <p className="text-lg text-text-light dark:text-darkmode-text-light mb-8 max-w-md mx-auto">
                  We're constantly adding new authentic Andhra Pradesh products. Check back soon for more delicious options!
                </p>
                <a 
                  href="/products" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-[#600018] hover:from-[#600018] hover:to-primary text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                >
                  <span>Browse All Products</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
          )}
          </div>
        </div>
      </section>
    </>
  );
};
