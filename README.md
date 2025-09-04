# 🍯 VLNS Home Foods - Authentic Andhra Pradesh Flavors

<p align="center">
  <img src="public/images/logo.png" alt="VLNS Home Foods Logo" width="200" height="60">
</p>

<p align="center">
  <strong>Your one-stop shop for authentic Andhra Pradesh flavors</strong>
</p>

<p align="center">
  Experience the timeless tastes of homemade sweets, savory snacks, and spicy pickles, 
  crafted with love and tradition using the freshest ingredients and recipes passed down through generations.
</p>

<p align="center">
  🌶️ <strong>Authentic Andhra Cuisine</strong> | 🏠 <strong>Family-Run Business</strong> | 🥘 <strong>Traditional Recipes</strong> | 🚚 <strong>Doorstep Delivery</strong>
</p>

---

## 🏪 About VLNS Home Foods

Welcome to **VLNS Home Foods**, your gateway to authentic Andhra Pradesh flavors. We're a family-run business dedicated to bringing you the timeless tastes of homemade sweets, savory snacks, and spicy pickles, crafted with love and tradition.

### 📍 **Our Location**
- **Address**: D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235
- **Contact**: 9581154327
- **Website**: [vlnshomefoods.com](https://vlnshomefoods.com/)

### 🎯 **Our Mission**
At VLNS Home Foods, we believe that the best food is made with care, using the freshest ingredients and recipes passed down through generations. Our journey began in 2025 with a simple goal: to share the rich culinary heritage of Andhra Pradesh with the world.

### 🌟 **What Makes Us Special**
- **Traditional Recipes**: Time-honored recipes passed down through generations
- **Fresh Ingredients**: Locally sourced ingredients for exceptional quality
- **Small Batch Production**: Meticulously prepared in small batches
- **Community Support**: Supporting local farmers and suppliers
- **Authentic Flavors**: True essence of Andhra Pradesh cuisine

---

## 🛍️ Our Product Range

### 🍯 **Homemade Sweets**
- Traditional Andhra sweets made with authentic recipes
- Melt-in-your-mouth sweetness with perfect texture
- Made with premium ingredients and traditional methods

### 🌶️ **Spicy Pickles**
- Authentic Andhra pickles with piquant tang
- Traditional preparation methods
- Perfect blend of spices and flavors

### 🥨 **Savory Snacks**
- Crispy and flavorful traditional snacks
- Perfect for any time of the day
- Made with love and attention to detail

### 🍽️ **Crispy Hots**
- Traditional Andhra crispy snacks
- Perfect texture and authentic taste
- Great for munching and sharing

---

## 🚀 Technology Stack

This e-commerce platform is built with modern technologies to provide the best shopping experience:

### 🛠️ **Frontend Technologies**
- **Next.js 15.3.0** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Tailwind CSS 4.1.3** - Utility-first CSS framework
- **Next-themes** - Dark/light mode support

### 🛒 **E-commerce Features**
- **Shopify Storefront API** - Headless commerce solution
- **GraphQL** - Efficient data fetching
- **Server Actions** - Optimized mutations
- **Dynamic Pricing** - Real-time price updates
- **Product Variants** - Multiple options (Oil Type, Garlic Variant, Weight)
- **Cart Management** - Full cart functionality
- **User Authentication** - Secure customer accounts

### 📱 **User Experience**
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Clean and intuitive interface
- **Image Optimization** - Fast loading with Next.js Image
- **SEO Optimized** - Search engine friendly
- **Performance** - Optimized for speed and efficiency

---

## 🎨 Key Features

### 🛍️ **E-commerce Features**
- 🌐 **Dynamic Products** from Shopify Storefront API
- 💸 **Secure Checkout** and Payments with Shopify
- 🛒 **Smart Cart** with easy editing options
- 🔍 **Advanced Search** and filtering functionality
- 🏷️ **Product Categories** - Sweets, Pickles, Snacks, Crispy Hots
- 📦 **Product Variants** - Oil Type, Garlic Variant, Weight options
- 💰 **Dynamic Pricing** - Real-time price updates
- 🔐 **User Authentication** - Customer accounts and profiles

### 🎨 **Design & UX**
- 🌞 **Light Mode** - Clean and bright interface
- 📱 **Fully Responsive** - Perfect on all devices
- 🖼️ **Product Gallery** - Multiple images with zoom functionality
- 🎯 **Hover Effects** - Interactive product cards
- 🎨 **Modern Design** - Contemporary and professional look
- ⚡ **Fast Loading** - Optimized performance

### 🔧 **Technical Features**
- 🚀 **Server Actions** for mutations
- 🔄 **Real-time Updates** with caching
- 📝 **Content Management** with Markdown/MDX
- 🔗 **SEO Optimization** with dynamic metadata
- 📊 **Analytics Ready** - Built for tracking
- 🛡️ **Type Safety** - Full TypeScript support

---

## 📄 Pages & Sections

### 🏠 **Main Pages**
- **Homepage** - Hero slider, featured products, collections
- **Products** - Complete product catalog with filtering
- **Product Detail** - Detailed product information with variants
- **About Us** - Our story and mission
- **Contact** - Get in touch with us

### 🔐 **Authentication**
- **Login** - Customer account access
- **Sign Up** - New customer registration
- **User Dashboard** - Account management

### 📋 **Legal & Info**
- **Terms of Service** - Usage terms and conditions
- **Privacy Policy** - Data protection and privacy
- **Custom 404** - User-friendly error page

---

## 🚀 Getting Started

### 📋 **Prerequisites**
- Node.js 18.0.0 or higher
- npm 10.2.0 or higher
- Shopify Partner Account
- Shopify Storefront API Access Token

### 🛒 **Shopify Setup**

1. **Create Shopify Partner Account**
   - Sign up at [partners.shopify.com](https://partners.shopify.com)
   - Create a development store

2. **Import Demo Products**
   - Upload the `products_export_1.csv` file from the `public` folder
   - This includes our authentic Andhra Pradesh food products

3. **Configure Storefront API**
   - Go to Settings > Apps and sales channels
   - Create a new app with Storefront API access
   - Copy the access token and store domain

4. **Environment Setup**
   - Create `.env.local` file
   - Add your Shopify credentials:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
   ```

### 🏃‍♂️ **Quick Start**

```bash
# Clone the repository
git clone https://github.com/your-username/vlns-home-foods.git
cd vlns-home-foods

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Shopify credentials

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### 🔧 **Available Scripts**

```bash
# Development with Turbopack (faster)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Remove dark mode (if needed)
npm run remove-darkmode
```

---

## 🎯 Product Configuration

### 🏷️ **Collections Setup**
Configure your product collections in `src/config/config.json`:

```json
{
  "shopify": {
    "currencySymbol": "₹",
    "currencyCode": "INR",
    "collections": {
      "hero_slider": "Pickles",
      "featured_products": "Sweets"
    }
  }
}
```

### 🖼️ **Hero Slider Setup**
1. Create a collection named "Pickles" in your Shopify admin
2. Add products you want to display in the hero slider
3. The slider will automatically display these products

### ⭐ **Featured Products**
1. Create a collection named "Sweets" in your Shopify admin
2. Add your featured sweet products
3. These will appear on the homepage

---

## 🛠️ Customization

### 🎨 **Branding**
- Update logo in `public/images/`
- Modify colors in `src/config/theme.json`
- Customize fonts and typography

### 📝 **Content**
- Update company information in `src/config/config.json`
- Modify static content in `src/content/`
- Customize navigation in `src/config/menu.json`

### 🛍️ **E-commerce**
- Configure product variants in Shopify
- Set up payment methods
- Customize checkout flow

---

## 📱 Mobile Experience

### 📲 **Mobile-First Design**
- Responsive layout for all screen sizes
- Touch-friendly interface
- Optimized for mobile shopping

### 🍔 **Mobile Navigation**
- Modern hamburger menu
- Full-width search bar
- Easy access to all features

### ⚡ **Performance**
- Fast loading on mobile networks
- Optimized images and assets
- Smooth animations and transitions

---

## 🔒 Security & Privacy

### 🛡️ **Data Protection**
- Secure customer data handling
- GDPR compliant
- Privacy policy included

### 🔐 **Authentication**
- Secure user authentication
- Protected customer accounts
- Safe checkout process

### 💳 **Payment Security**
- Shopify's secure payment processing
- PCI compliant
- Multiple payment options

---

## 📊 Performance & SEO

### ⚡ **Performance**
- **Page Speed**: 97% (Google PageSpeed Insights)
- **Core Web Vitals**: Optimized
- **Loading Speed**: < 2 seconds
- **Image Optimization**: Next.js Image component

### 🔍 **SEO Features**
- Dynamic meta tags
- Structured data
- Sitemap generation
- Social media optimization

---

## 🤝 Support & Contact

### 📞 **Get in Touch**
- **Phone**: 9581154327
- **Address**: D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235
- **Website**: [vlnshomefoods.com](https://vlnshomefoods.com/)

### 🐞 **Technical Support**
- **Issues**: [GitHub Issues](https://github.com/your-username/vlns-home-foods/issues)
- **Documentation**: Check the docs folder
- **Community**: Join our discussions

---

## 📄 License

Copyright (c) 2025 - Present, **VLNS Home Foods**

**Code License:** Released under the [MIT License](LICENSE)

**Content License:** All product descriptions, images, and content are proprietary to VLNS Home Foods.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Shopify](https://shopify.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [React Icons](https://react-icons.github.io/react-icons/)

---

<p align="center">
  <strong>🍯 Experience the authentic taste of Andhra Pradesh with VLNS Home Foods 🍯</strong>
</p>

<p align="center">
  Made with ❤️ by the VLNS Home Foods Team
</p>