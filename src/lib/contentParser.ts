import matter from "gray-matter";
import { notFound } from "next/navigation";

// Helper function to parse frontmatter
const parseFrontmatter = (frontmatter: any) => {
  const frontmatterString = JSON.stringify(frontmatter);
  return JSON.parse(frontmatterString);
};

// get list page data, ex: _index.md
export const getListPage = (filePath: string) => {
  // For now, return default content to prevent 404 errors
  // This will be replaced with actual content loading
  const defaultContent = getDefaultContent(filePath);
  
  if (!defaultContent) {
    console.error(`Content file not found: ${filePath}`);
    notFound();
  }

  const { content: markdownContent, data: frontmatter } = matter(defaultContent);

  return {
    frontmatter: parseFrontmatter(frontmatter),
    content: markdownContent,
  };
};

// get all single pages, ex: blog/post.md
export const getSinglePage = (folder: string) => {
  const singlePages: any[] = [];

  // Handle pages folder
  if (folder === "pages") {
    const pages = [
      { slug: "privacy-policy", content: getDefaultContent("pages/privacy-policy.md") },
      { slug: "terms-services", content: getDefaultContent("pages/terms-services.md") },
    ];

    pages.forEach(({ slug, content }) => {
      if (content) {
        const { content: markdownContent, data: frontmatter } = matter(content);
        const url = frontmatter.url ? frontmatter.url.replace("/", "") : slug;

        singlePages.push({
          frontmatter: parseFrontmatter(frontmatter),
          slug: url,
          content: markdownContent,
        });
      }
    });
  }

  // Filter published pages
  const publishedPages = singlePages.filter(
    (page) => !page.frontmatter.draft && page,
  );
  
  const filterByDate = publishedPages.filter(
    (page) => new Date(page.frontmatter.date || new Date()) <= new Date(),
  );

  return filterByDate;
};

// Default content for pages to prevent 404 errors
function getDefaultContent(filePath: string): string | null {
  const defaultContents: Record<string, string> = {
    "about/_index.md": `---
title: "About VLNS Home Foods"
description: "Learn about our authentic Andhra Pradesh flavors and family tradition"
meta_title: "About Us - VLNS Home Foods"
image: "/images/aboutUs.png"
about_us:
  - title: "Our Story"
    content: "Welcome to VLNS Home Foods, your one-stop shop for authentic Andhra Pradesh flavors. We're a family-run business dedicated to bringing you the timeless tastes of homemade sweets, savory snacks, and spicy pickles, crafted with love and tradition."
    image: "/images/aboutUs.png"
  - title: "Our Mission"
    content: "At VLNS Home Foods, we believe that the best food is made with care, using the freshest ingredients and recipes passed down through generations. Our journey began in 2025 with a simple goal: to share the rich culinary heritage of Andhra Pradesh with the world."
    image: "/images/aboutUs.png"
faq_section_title: "Frequently Asked Questions"
faq_section_subtitle: "Everything you need to know about VLNS Home Foods"
faqs:
  - question: "What makes VLNS Home Foods special?"
    answer: "We use traditional recipes passed down through generations and source the freshest local ingredients to bring you authentic Andhra Pradesh flavors."
  - question: "Do you deliver nationwide?"
    answer: "Yes, we deliver our products across India, ensuring they reach you fresh and in perfect condition."
  - question: "Are your products preservative-free?"
    answer: "Yes, we use traditional preparation methods without artificial preservatives, just like homemade food."
testimonials_section_enable: true
testimonials_section_title: "What Our Customers Say"
testimonials:
  - name: "Priya Sharma"
    designation: "Customer"
    content: "The authentic taste of Andhra Pradesh right at my doorstep! VLNS Home Foods never disappoints."
    avatar: "/images/avatar.png"
  - name: "Rajesh Kumar"
    designation: "Customer"
    content: "Amazing quality and taste. The pickles are exactly like my grandmother used to make."
    avatar: "/images/avatar.png"
staff_section_enable: true
staff:
  - name: "VLNS Team"
    designation: "Master Chefs"
    avatar: "/images/staff/staff.png"
button:
  enable: true
  label: "Shop Now"
  link: "/products"
---

# About VLNS Home Foods

Welcome to VLNS Home Foods, your gateway to authentic Andhra Pradesh flavors. We're a family-run business dedicated to bringing you the timeless tastes of homemade sweets, savory snacks, and spicy pickles, crafted with love and tradition.

## Our Story

Our journey began in 2025 with a simple goal: to share the rich culinary heritage of Andhra Pradesh with the world. We understand that in today's fast-paced world, it's not always easy to find the time to prepare these traditional delicacies at home. That's why we do it for you, ensuring every product tastes just like it came from a grandmother's kitchen.

## Our Mission

At VLNS Home Foods, we believe that the best food is made with care, using the freshest ingredients and recipes passed down through generations. Our products are meticulously prepared in small batches to guarantee exceptional quality and flavor.

## Why Choose Us

- **Traditional Recipes**: Time-honored recipes passed down through generations
- **Fresh Ingredients**: Locally sourced ingredients for exceptional quality
- **Small Batch Production**: Meticulously prepared in small batches
- **Community Support**: Supporting local farmers and suppliers
- **Authentic Flavors**: True essence of Andhra Pradesh cuisine
`,

    "contact/_index.md": `---
title: "Contact VLNS Home Foods"
description: "Get in touch with VLNS Home Foods for authentic Andhra Pradesh flavors"
meta_title: "Contact Us - VLNS Home Foods"
image: "/images/contact.png"
contact_meta:
  - name: "Phone"
    contact: "9581154327"
  - name: "Email"
    contact: "info@vlnshomefoods.com"
  - name: "Address"
    contact: "D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235"
  - name: "Business Hours"
    contact: "Mon-Sat: 9AM-7PM"
---

# Contact VLNS Home Foods

We'd love to hear from you! Get in touch with us for any questions about our authentic Andhra Pradesh flavors.

## Get in Touch

Feel free to reach out to us through any of the contact methods below. We're here to help you discover the authentic taste of Andhra Pradesh.
`,

    "sections/call-to-action.md": `---
title: "Experience Authentic Andhra Pradesh Flavors"
description: "Order now and taste the authentic flavors of Andhra Pradesh delivered to your doorstep"
button:
  enable: true
  label: "Shop Now"
  link: "/products"
---

# Ready to Experience Authentic Andhra Pradesh Flavors?

Join thousands of satisfied customers who have discovered the authentic taste of Andhra Pradesh with VLNS Home Foods. From traditional sweets to spicy pickles, we bring the flavors of home right to your doorstep.
`,

    "pages/privacy-policy.md": `---
title: "Privacy Policy"
description: "Privacy Policy for VLNS Home Foods"
meta_title: "Privacy Policy - VLNS Home Foods"
date: "2025-01-01"
url: "/privacy-policy"
---

# Privacy Policy

This Privacy Policy describes how VLNS Home Foods collects, uses, and protects your personal information.

## Information We Collect

We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.

## How We Use Your Information

We use the information we collect to provide, maintain, and improve our services.
`,

    "pages/terms-services.md": `---
title: "Terms of Service"
description: "Terms of Service for VLNS Home Foods"
meta_title: "Terms of Service - VLNS Home Foods"
date: "2025-01-01"
url: "/terms-services"
---

# Terms of Service

These Terms of Service govern your use of VLNS Home Foods website and services.

## Acceptance of Terms

By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
`,

    "sections/payments-and-delivery.md": `---
title: "Payments & Delivery"
description: "Payment and delivery information for VLNS Home Foods"
---

# Payments & Delivery

## Payment Methods

We accept the following payment methods:

- **Credit/Debit Cards**: Visa, Mastercard, American Express
- **Digital Wallets**: Paytm, PhonePe, Google Pay
- **Net Banking**: All major banks
- **UPI**: Instant payments through UPI
- **Cash on Delivery**: Available for select locations

## Delivery Information

### **Delivery Areas**
- **Free Delivery**: Within 10km radius of our location
- **Standard Delivery**: Across Andhra Pradesh
- **Express Delivery**: Same day delivery for orders placed before 2 PM

### **Delivery Charges**
- **Free Delivery**: Orders above ₹500
- **Standard Delivery**: ₹50 for orders below ₹500
- **Express Delivery**: ₹100 additional charge

### **Delivery Time**
- **Standard Delivery**: 2-3 business days
- **Express Delivery**: Same day (if ordered before 2 PM)
- **Rural Areas**: 3-5 business days

### **Order Tracking**
- You will receive SMS updates on your order status
- Track your order using the order number
- Contact us for any delivery-related queries

## Return & Refund Policy

### **Returns**
- **Fresh Products**: No returns due to perishable nature
- **Packaged Products**: 7-day return policy
- **Damaged Products**: Immediate replacement or refund

### **Refunds**
- **Processing Time**: 3-5 business days
- **Refund Method**: Same as payment method
- **Contact**: For refund queries, call 9581154327

## Contact Information

For any payment or delivery related queries:
- **Phone**: 9581154327
- **Email**: info@vlnshomefoods.com
- **Address**: D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235
`
  };

  return defaultContents[filePath] || null;
}