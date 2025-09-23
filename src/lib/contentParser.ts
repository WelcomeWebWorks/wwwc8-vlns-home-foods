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
meta_title: "Privacy Policy - VLNS Home Foods"
description: "Privacy Policy for VLNS Home Foods - Learn how we collect, use, and protect your personal information when you shop with us."
draft: false
---

## Privacy Policy

**Last Updated: January 1, 2025**

### Data Protection Compliance

At VLNS Home Foods, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make purchases from us.

We collect certain identifying personal data when you place an order or create an account, such as your name, email address, phone number, and delivery address. The personal data we collect from you is disclosed only in accordance with our Terms of Service and this Privacy Policy.

Whenever you visit our Site, we may collect non-identifying information from you, such as referring URL, browser, operating system, cookie information, and Internet Service Provider. This information helps us improve our website and services.

### About VLNS Home Foods

#### Our Commitment to Privacy

VLNS Home Foods is a family-run business dedicated to bringing you authentic Andhra Pradesh flavors. We understand the importance of protecting your personal information and are committed to maintaining the highest standards of data protection.

We believe in transparency and want you to understand how we handle your information when you shop with us for our traditional sweets, savory snacks, and spicy pickles.

#### Information We Collect

We collect information that you provide directly to us, such as when you:

- Create an account on our website
- Place an order for our products
- Subscribe to our newsletter
- Contact us for customer support
- Participate in surveys or promotions

The information we collect may include your name, email address, phone number, billing and shipping addresses, payment information, and order history.

#### How We Use Your Information

We use the information we collect to:

- Process and fulfill your orders
- Send you order confirmations and shipping updates
- Provide customer support
- Send you newsletters and promotional offers (with your consent)
- Improve our website and services
- Comply with legal obligations

#### Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:

- To process payments (through secure payment processors)
- To fulfill orders (through shipping partners)
- To comply with legal requirements
- To protect our rights and prevent fraud

#### Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your payment information is encrypted and processed securely through our payment partners.

#### Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Opt-out of marketing communications
- Withdraw consent at any time

To exercise these rights, please contact us at info@vlnshomefoods.com or call us at +91 9581154327.

`,

    "pages/terms-services.md": `---
title: "Terms of Service"
meta_title: "Terms of Service - VLNS Home Foods"
description: "Terms of Service for VLNS Home Foods - Learn about our policies for ordering, payment, delivery, and returns of authentic Andhra Pradesh food products."
draft: false
---

## VLNS Home Foods Terms of Service

### Acceptance of Terms

The website www.vlnshomefoods.com is owned and maintained by VLNS Home Foods, a proprietary concern. Your access to and use of VLNS Home Foods website is exclusively subject to these terms and conditions. You will not use the website for any purpose that is unlawful or prohibited by these terms and conditions. By using the website you are fully accepting the terms, conditions and disclaimers contained in this notice.

### Website Information and Accuracy

The information, software, products, and services included in or available through our website may include inaccuracies or typographical errors. Changes are periodically made to the information therein. VLNS Home Foods may make improvements and/or changes in its website/services at any time. Advice received via our website should not be relied upon for personal, medical, legal or financial decisions and you should consult an appropriate professional for specific advice tailored to your situation.

### Disclaimer of Warranties

VLNS Home Foods makes no representations about the suitability, reliability, availability, timeliness, lack of viruses or other harmful components and accuracy of the information, software, products, services and related graphics contained within the VLNS Home Foods website/services for any purpose. All such information, software, products, services and related graphics are provided "as is" without warranty of any kind. VLNS Home Foods hereby disclaims all warranties and conditions with regard to this information, software, products, services and related graphics, including all implied warranties and conditions of merchantability, fitness for a particular purpose, workmanlike effort, title and non-infringement.

### Third-Party Links

This website may contain links to other web sites operated by third parties ("linked sites"). You acknowledge that, when you click on a link to visit a linked site, a frame may appear that contains the VLNS Home Foods logo, advertisements and/or other content selected by VLNS Home Foods. You acknowledge that VLNS Home Foods neither endorses nor is affiliated with the linked site and is not responsible for any content of any linked site or any link contained in a link site, or any changes or updates to such sites. You also acknowledge that VLNS Home Foods is providing these links to you only as a convenience.

### Limitation of Liability

You specifically agree that VLNS Home Foods shall not be responsible for unauthorized access to or alteration of your transmissions or data, any material or data sent or received or not sent or received, or any transactions entered into through a VLNS Home Foods website/service. You specifically agree that VLNS Home Foods is not responsible or liable for any threatening, defamatory, obscene, offensive or illegal content or conduct of any other party or any infringement of another's rights, including intellectual property rights. You specifically agree that VLNS Home Foods is not responsible for any content sent using and/or included in a VLNS Home Foods website/service by any third party.

In no event shall VLNS Home Foods and/or its vendors be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the VLNS Home Foods website/services, with the delay or inability to use the VLNS Home Foods website/services or related services, the provision of or failure to provide services, or for any information, software, products, services and related graphics obtained through the VLNS Home Foods website/services, or otherwise arising out of the use of the VLNS Home Foods website/services, whether based on contract, tort, negligence, strict liability or otherwise, even if VLNS Home Foods or any of its suppliers has been advised of the possibility of damages.

### Advertisement Disclaimer

VLNS Home Foods does not endorse in anyway any advertisers/contents of advertisers on its webpages. Please therefore verify the veracity of all information on your own before undertaking reliance and actioning thereupon. VLNS Home Foods shall not be responsible nor liable for any consequential damages arising on account of your relying on the contents of the advertisement.

### Governing Law and Jurisdiction

This agreement is governed by the laws of Republic of India. You hereby irrevocably consent to the exclusive jurisdiction and venue of courts in Guntur, Andhra Pradesh, India in all disputes arising out of or relating to the use of the VLNS Home Foods website/services. Use of the VLNS Home Foods website/services is unauthorized in any jurisdiction that does not give effect to all provisions of these terms and conditions, including without limitation this paragraph.

### Indemnification

You agree to indemnify and hold VLNS Home Foods, its subsidiaries, affiliates, officers and employees, harmless from any claim, demand, or damage, including reasonable attorneys' fees, asserted by any third party due to or arising out of your use of or conduct on the VLNS Home Foods website/services.

### Privacy and Information Disclosure

VLNS Home Foods reserves the right to disclose any personal information about you or your use of the VLNS Home Foods website/services, including its contents, without your prior permission if VLNS Home Foods has a good faith belief that such action is necessary to: (1) conform to legal requirements or comply with legal process; (2) protect and defend the rights or property of VLNS Home Foods or its affiliated companies; (3) enforce the terms or use; or (4) act to protect the interests of its members or others.

VLNS Home Foods performance of this agreement is subject to existing laws and legal process, and nothing contained in this agreement is in derogation of VLNS Home Foods's right to comply with governmental, court and law enforcement requests or requirements relating to your use of the VLNS Home Foods website/services or information provided to or gathered by VLNS Home Foods with respect to such use.

### Severability

If any part of this agreement is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the agreement shall continue in effect.

### E-commerce Specific Terms

#### Product Information and Pricing

All prices are displayed in Indian Rupees (₹) and include applicable taxes. Prices are subject to change without notice, but we will honor the price at the time of your order confirmation. While we do our best to ensure prices are accurate and up to date, errors may occur. In such cases, we will contact you before processing your order to confirm the correct pricing.

#### Payment Terms

We accept various payment methods including:
- Credit and Debit Cards (Visa, MasterCard)
- UPI payments
- Net Banking
- Cash on Delivery (for select areas)

Payment must be made in full before we dispatch your order, except for Cash on Delivery orders. We use secure payment gateways to process your transactions safely.

#### Product Availability and Quality

We strive to maintain stock of all products displayed on our website. If an item you order is temporarily out of stock, we will contact you with an estimated availability date. You may choose to wait for the item or cancel that part of your order.

All our products are prepared fresh using traditional methods and locally sourced ingredients. We take great care in packaging to ensure your food items reach you in perfect condition.

#### Delivery Terms

- We provide free delivery across India within 2-5 business days
- International delivery available worldwide with applicable shipping charges
- No delivery charges for any location within India
- We will notify you if there are any delays in delivery
- You must be available to receive the order at the specified address
- Title and risk of goods pass to you upon delivery

#### No-Return Policy

- All sales are final - no returns accepted once purchase is completed
- Due to the perishable nature of our food products, we cannot accept returns
- We ensure all products are fresh and properly packaged before dispatch
- Contact us immediately upon delivery only for damaged or incorrect products
- Quality issues will be addressed on a case-by-case basis

#### Changes to Terms

We may update these Terms and Conditions from time to time. Any changes will be posted on this page, and your continued use of our service constitutes acceptance of the updated terms.

### Contact Information

For any questions about these terms or our services, please contact us:
- **Email:** info@vlnshomefoods.com
- **Phone:** +91 9581154327
- **Address:** D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235

**Last Updated:** January 1, 2025
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
- **Free Delivery**: Across India for all orders
- **International Delivery**: Worldwide shipping available
- **Express Delivery**: Same day delivery for orders placed before 2 PM (select locations in India)

### **Delivery Charges**
- **Free Delivery**: All orders across India
- **International Delivery**: Shipping charges apply based on destination
- **Express Delivery**: ₹100 additional charge (select locations in India only)

### **Delivery Time**
- **Standard Delivery**: 2-3 business days
- **Express Delivery**: Same day (if ordered before 2 PM)
- **Rural Areas**: 3-5 business days

### **Order Tracking**
- You will receive SMS updates on your order status
- Track your order using the order number
- Contact us for any delivery-related queries

## No-Return Policy

### **Important Notice**
- **All Sales Final**: No returns accepted once purchase is completed
- **Fresh Products**: Due to the perishable nature of our food products, all sales are final
- **Quality Assurance**: We ensure all products are fresh and properly packaged before dispatch
- **Damaged Products**: Contact us immediately upon delivery for damaged items only

### **Contact for Issues**
- **Phone**: 9581154327
- **Email**: info@vlnshomefoods.com
- **Note**: We only address damaged or incorrect products upon delivery

## Contact Information

For any payment or delivery related queries:
- **Phone**: 9581154327
- **Email**: info@vlnshomefoods.com
- **Address**: D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235
`
  };

  return defaultContents[filePath] || null;
}