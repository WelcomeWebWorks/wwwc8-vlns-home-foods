import LoadingProductGallery from "@/components/loadings/skeleton/SkeletonProductGallery";
import ProductGallery from "@/components/product/ProductGallery";
import ShowTags from "@/components/product/ShowTags";
import Tabs from "@/components/product/Tabs";
import { DynamicPrice } from "@/components/product/DynamicPrice";
import { EnhancedVariantSelector } from "@/layouts/components/product/EnhancedVariantSelector";
import WishlistButton from "@/layouts/components/product/WishlistButton";
import EnhancedRelatedProducts from "@/layouts/components/product/EnhancedRelatedProducts";
import EnhancedCartButtons from "@/layouts/components/cart/EnhancedCartButtons";
import ProductDetailContent from "@/layouts/components/product/ProductDetailContent";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { getProduct, getProductRecommendations, getProducts } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  FiTruck,
  FiShield,
  FiShare2,
  FiCheckCircle,
  FiAward,
  FiHome,
  FiPackage,
  FiCreditCard,
  FiTag,
  FiFileText,
  FiAlertCircle
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
      // Filter out the current product and take the first 6 products for enhanced display
      relatedProducts = products
        .filter(product => product.id !== id)
        .slice(0, 6);
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
            <Link href="/" className="text-primary hover:text-[#600018] transition-colors duration-200 flex items-center space-x-1">
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="text-text-light dark:text-darkmode-text-light">/</span>
            <Link href="/products" className="text-primary hover:text-[#600018] transition-colors duration-200 flex items-center space-x-1">
              <FiPackage className="w-4 h-4" />
              <span>Products</span>
            </Link>
            <span className="text-text-light dark:text-darkmode-text-light">/</span>
            <span className="text-text-dark dark:text-darkmode-text-dark font-medium truncate">{title}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Section - Revamped Professional Layout */}
      <section className="py-12 md:py-16 bg-white dark:bg-darkmode-body">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Gallery */}
            <div className="space-y-6">
              <Suspense>
                <ProductGallery images={images} />
              </Suspense>
            </div>

            {/* Product Information - Professional Layout */}
            <div className="space-y-8">
              {/* Product Header */}
              <div className="space-y-6">
                <ProductDetailContent product={product}>
                  <div></div>
                </ProductDetailContent>
              </div>

              {/* Price Section - Enhanced */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl p-6 border border-primary/20 dark:border-primary/30">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
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

              {/* Product Options - Compact and Elegant */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark mb-1">
                    Product Options
                  </h3>
                  <p className="text-xs text-text-light dark:text-darkmode-text-light">
                    Choose your preferred options
                  </p>
                </div>
                {options && (
                  <EnhancedVariantSelector
                    options={options}
                    variants={variants}
                    images={images}
                  />
                )}
              </div>

              {/* Add to Cart Section - Prominent */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl p-6 border border-primary/30 dark:border-primary/40">
                <Suspense>
                  <EnhancedCartButtons
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
                    handle={null}
                    defaultVariantId={defaultVariantId}
                  />
                </Suspense>
              </div>

              {/* Trust Indicators - Compact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center space-x-3">
                  <FiTruck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">Free Delivery</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{estimated_delivery}</p>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center space-x-3">
                  <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Secure Payment</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">100% Protected</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods - Streamlined */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                <h5 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <FiCreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <span>Payment Methods</span>
                </h5>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {payment_methods?.map(
                    (payment: { name: string; image_url: string }) => (
                      <div
                        key={payment.name}
                        className="bg-white dark:bg-darkmode-body border border-border dark:border-darkmode-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 group"
                        title={payment.name}
                      >
                        <Image
                          src={payment.image_url}
                          alt={payment.name}
                          width={48}
                          height={36}
                          className="w-full h-[36px] object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    🔒 SSL Encrypted Payments
                  </p>
                </div>
              </div>

              {/* Product Tags - Compact */}
              {tags.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <h5 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-3 mb-4">
                    <div className="w-6 h-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <FiTag className="w-4 h-4 text-primary" />
                    </div>
                    <span>Categories</span>
                  </h5>
                  <Suspense>
                    <ShowTags tags={tags} />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Section - Compact and Elegant */}
      {description && (
        <section className="py-8 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Compact Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark">
                    Product Details
                  </h2>
                </div>
                <p className="text-sm text-text-light dark:text-darkmode-text-light">
                  Learn more about this authentic Andhra Pradesh product
                </p>
              </div>
              
              {/* Compact Content */}
              <div className="bg-white dark:bg-darkmode-body rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Tabs descriptionHtml={descriptionHtml} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Related Products Section */}
      <EnhancedRelatedProducts
        products={relatedProducts || []}
        currentProductId={id}
        title="You Might Also Like"
        subtitle="Discover more authentic Andhra Pradesh products that complement your selection"
      />
    </>
  );
};
