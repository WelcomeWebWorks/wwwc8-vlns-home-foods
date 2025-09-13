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
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  FiTruck,
  FiShield,
  FiShare2,
  FiCheckCircle,
  FiStar,
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
              {/* Product Header with Enhanced Functionality */}
              <div className="space-y-4">
                <ProductDetailContent product={product}>
                  <div></div>
                </ProductDetailContent>
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

              {/* Enhanced Product Options */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-darkmode-body rounded-3xl p-6 md:p-8 border border-border dark:border-darkmode-border shadow-lg">
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark mb-2">
                    Customize Your Order
                  </h3>
                  <p className="text-text-light dark:text-darkmode-text-light">
                    Select your preferred options below
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

              {/* Enhanced Cart Buttons Section */}
              <div className="space-y-4">
                <Suspense>
                  <EnhancedCartButtons
                    variants={product?.variants}
                    availableForSale={product?.availableForSale}
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
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">Free Delivery India-wide</p>
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
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
                  <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">No Returns</p>
                    <p className="text-xs text-red-600 dark:text-red-400">All Sales Final</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Payment Methods */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 md:p-8 border border-blue-200 dark:border-blue-800 shadow-lg">
                <h5 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <FiCreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <span>Secure Payment Methods</span>
                </h5>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {payment_methods?.map(
                    (payment: { name: string; image_url: string }) => (
                      <div
                        key={payment.name}
                        className="bg-white dark:bg-darkmode-body border-2 border-border dark:border-darkmode-border rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                        title={payment.name}
                      >
                        <Image
                          src={payment.image_url}
                          alt={payment.name}
                          width={64}
                          height={48}
                          className="w-full h-[48px] object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    🔒 All payments are secured with 256-bit SSL encryption
                  </p>
                </div>
              </div>



              {/* Enhanced Product Tags */}
              {tags.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-6 md:p-8 border border-green-200 dark:border-green-800 shadow-lg">
                  <h5 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                      <FiTag className="w-5 h-5 text-primary" />
                    </div>
                    <span>Product Categories</span>
                  </h5>
                  <Suspense>
                    <ShowTags tags={tags} />
                  </Suspense>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      🏷️ Explore more products in these categories
                    </p>
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
              <div className="text-left mb-12 pl-4 md:pl-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                    <FiFileText className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-text-dark dark:text-darkmode-text-dark mb-2">
                      Product Details
                    </h2>
                    <p className="text-lg text-text-light dark:text-darkmode-text-light">
                      Learn more about this authentic Andhra Pradesh product
                    </p>
                  </div>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
              </div>
              <div className="bg-white dark:bg-darkmode-body rounded-3xl shadow-xl border border-border dark:border-darkmode-border overflow-hidden">
              <Tabs descriptionHtml={descriptionHtml} />

              {/* No-Return Policy Notice */}
              <div className="bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                      <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                      Important Notice - No Returns Policy
                    </h4>
                    <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                      <strong>All sales are final. No returns accepted once purchase is completed.</strong> Due to the perishable nature of our authentic food products, we cannot accept returns. We ensure all products are fresh and properly packaged before dispatch. Please contact us immediately upon delivery only for damaged or incorrect items.
                    </p>
                  </div>
                </div>
              </div>
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
