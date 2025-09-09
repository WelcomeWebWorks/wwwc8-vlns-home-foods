import Expandable from "@/components/Expandable";
import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import Testimonials from "@/partials/Testimonials";
import { AboutUsItem, RegularPage, Faq } from "@/types";
import Link from "next/link";

const About = () => {
  const data: RegularPage = getListPage("about/_index.md");

  const { frontmatter } = data;
  const {
    title,
    about_us,
    faq_section_title,
    button,
    faq_section_subtitle,
    faqs,
    testimonials_section_enable,
    testimonials_section_title,
    testimonials,
    staff_section_enable,
    staff,
  } = frontmatter;

  return (
    <>
      <SeoMeta {...frontmatter} />

      <div className="min-h-screen bg-light dark:bg-darkmode-light login-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-primary hover:text-[#600018] transition-colors duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
              About VLNS Home Foods
            </h1>
            <p className="text-lg text-text-light dark:text-darkmode-text-light max-w-3xl mx-auto">
              Learn about our journey, commitment to authentic Andhra Pradesh flavors, and the passionate team behind every delicious product.
            </p>
          </div>

          {/* About Us Sections */}
          <div className="space-y-16 mb-16">
            {about_us && about_us.length > 0 ? (
              about_us.map((section: AboutUsItem, index: number) => (
              <div
                className={`max-w-6xl mx-auto ${index % 2 === 0 ? 'lg:flex lg:items-center lg:gap-12' : 'lg:flex lg:flex-row-reverse lg:items-center lg:gap-12'}`}
                key={section?.title}
              >
                <div className={`${index % 2 === 0 ? 'lg:w-1/2' : 'lg:w-1/2'} mb-8 lg:mb-0`}>
                  <ImageFallback
                    className="rounded-2xl shadow-lg w-full h-auto"
                    src={section?.image}
                    width={536}
                    height={449}
                    alt={section?.title}
                  />
                </div>
                <div className={`${index % 2 === 0 ? 'lg:w-1/2' : 'lg:w-1/2'} bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-8`}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark">
                      {section?.title}
                    </h2>
                  </div>
                  <div
                    className="text-text-light dark:text-darkmode-text-light leading-relaxed text-base md:text-lg"
                    dangerouslySetInnerHTML={markdownify(section?.content || "")}
                  />
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-text-light dark:text-darkmode-text-light text-lg">
                  About us content is being updated. Please check back soon.
                </p>
              </div>
            )}
          </div>

          {/* Testimonials Section */}
          {testimonials_section_enable && (
            <div className="mb-16">
              <Testimonials
                title={testimonials_section_title!}
                testimonials={testimonials!}
              />
            </div>
          )}

          {/* Staff Section */}
          {staff_section_enable && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  Our Team
                </h2>
                <p className="text-text-light dark:text-darkmode-text-light max-w-2xl mx-auto">
                  Meet the passionate individuals who bring you authentic Andhra Pradesh flavors
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {staff && staff.length > 0 ? (
                  staff.map((s, idx) => (
                  <div key={idx} className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="p-6 text-center">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-text-dark dark:text-darkmode-text-dark mb-2">
                        {s.name}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {s.designation}
                      </p>
                    </div>
                    <div className="bg-light dark:bg-darkmode-light">
                      <ImageFallback
                        src={s.avatar}
                        alt={`Staff-${s.name}`}
                        width={290}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-text-light dark:text-darkmode-text-light">
                      Team information is being updated. Please check back soon.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reasons to Shop Section */}
          <div className="mb-16">
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                  Reasons to Shop with Us
                </h2>
                <p className="text-text-light dark:text-darkmode-text-light max-w-2xl mx-auto">
                  We're committed to providing you with the best experience and quality products
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                    24/7 Friendly Support
                  </h3>
                  <p className="text-text-light dark:text-darkmode-text-light leading-relaxed">
                    Our support team is always ready for you 7 days a week
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                    7 Days Easy Return
                  </h3>
                  <p className="text-text-light dark:text-darkmode-text-light leading-relaxed">
                    Product any fault within 7 days for an immediately exchange
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark dark:text-darkmode-text-dark mb-4">
                    Quality Guaranteed
                  </h3>
                  <p className="text-text-light dark:text-darkmode-text-light leading-relaxed">
                    If your product are not perfect, return them for a full refund
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-text-dark dark:text-darkmode-text-dark">
                      {faq_section_title}
                    </h2>
                  </div>
                  <div
                    className="text-text-light dark:text-darkmode-text-light leading-relaxed text-base md:text-lg"
                    dangerouslySetInnerHTML={markdownify(faq_section_subtitle || "")}
                  />

                  {button?.enable && (
                    <div className="pt-4">
                      <Link
                        className="inline-flex items-center bg-primary hover:bg-[#600018] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        href={button.link}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {button.label}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {faqs && faqs.length > 0 ? (
                    faqs.map((faq: Faq, index: number) => (
                      <div key={index} className="border border-border dark:border-darkmode-border rounded-lg overflow-hidden">
                        <details className="group">
                          <summary className="flex items-center justify-between p-4 cursor-pointer bg-light dark:bg-darkmode-light hover:bg-gray-50 dark:hover:bg-darkmode-body transition-colors duration-200">
                            <h3 className="text-lg font-semibold text-text-dark dark:text-darkmode-text-dark pr-4">
                              {faq.title || "Question"}
                            </h3>
                            <svg 
                              className="w-5 h-5 text-primary transition-transform duration-200 group-open:rotate-180 flex-shrink-0" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="p-4 bg-white dark:bg-darkmode-body border-t border-border dark:border-darkmode-border">
                            <div 
                              className="text-text-light dark:text-darkmode-text-light leading-relaxed"
                              dangerouslySetInnerHTML={markdownify(faq.content || "No content available.")}
                            />
                          </div>
                        </details>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-text-light dark:text-darkmode-text-light">
                        No frequently asked questions available at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
