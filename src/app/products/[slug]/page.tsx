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
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import LatestProducts from "@/partials/FeaturedProducts";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

  const relatedProducts = await getProductRecommendations(id);

  const defaultVariantId = variants.length > 0 ? variants[0].id : undefined;

  return (
    <>
      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-light dark:bg-darkmode-light">
        <div className="container">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-primary hover:text-[#600018] transition-colors duration-200">
              Home
            </a>
            <span className="text-text-light dark:text-darkmode-text-light">/</span>
            <a href="/products" className="text-primary hover:text-[#600018] transition-colors duration-200">
              Products
            </a>
            <span className="text-text-light dark:text-darkmode-text-light">/</span>
            <span className="text-text-dark dark:text-darkmode-text-dark font-medium">{title}</span>
          </nav>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-8 md:py-12 bg-white dark:bg-darkmode-body">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              <Suspense>
                <ProductGallery images={images} />
              </Suspense>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Product Title */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-darkmode-text-dark leading-tight">
                  {title}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-light dark:text-darkmode-text-light">(4.8/5)</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="space-y-2">
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
                    stylesClass={"w-full bg-primary hover:bg-[#600018] text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"}
                    handle={null}
                    defaultVariantId={defaultVariantId}
                  />
                </Suspense>
              </div>

              {/* Delivery Information */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                    {estimated_delivery}
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>Payment Methods</span>
                </h5>
                <div className="flex flex-wrap items-center gap-3">
                  {payment_methods?.map(
                    (payment: { name: string; image_url: string }) => (
                      <div key={payment.name} className="bg-white dark:bg-darkmode-body border border-border dark:border-darkmode-border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <Image
                          src={payment.image_url}
                          alt={payment.name}
                          width={44}
                          height={32}
                          className="w-[44px] h-[32px]"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border border-border dark:border-darkmode-border" />

              {/* Social Sharing */}
              <div className="space-y-3">
                <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Share this product</span>
                </h5>
                <Social socialName={title} className="flex space-x-4" />
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="space-y-3">
                  <h5 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Tags</span>
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

      {/* Description of a product  */}
      {description && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  Product Details
                </h2>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
              </div>
              <Tabs descriptionHtml={descriptionHtml} />
            </div>
          </div>
        </section>
      )}

      {/* Recommended Products section  */}
      <section className="py-16 bg-white dark:bg-darkmode-body">
        <div className="container">
          {relatedProducts?.length > 0 && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  You Might Also Like
                </h2>
                <p className="text-lg text-text-light dark:text-darkmode-text-light max-w-2xl mx-auto">
                  Discover more authentic Andhra Pradesh products that complement your selection
                </p>
                <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-4"></div>
              </div>
              <LatestProducts products={relatedProducts.slice(0, 4)} />
            </>
          )}
        </div>
      </section>
    </>
  );
};
