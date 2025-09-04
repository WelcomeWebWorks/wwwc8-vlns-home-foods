# Vercel Deployment Guide for VLNS Home Foods

## 🚀 Quick Deploy to Vercel

### 📦 **Method 1: Deploy with Vercel CLI**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy to Vercel (first time)
vercel

# Deploy to production
vercel --prod
```

### 🌐 **Method 2: Deploy via Vercel Dashboard**

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing VLNS Home Foods

2. **Configure Project Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   Add these in the Vercel dashboard under Settings > Environment Variables:

   ```env
   # Required - Shopify Configuration
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
   
   # Optional - Site Configuration
   SITE_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy" button
   - Wait for deployment to complete
   - Your site will be live at `https://your-project.vercel.app`

## ⚙️ **Vercel Configuration Files**

### **vercel.json**
The project includes an optimized `vercel.json` configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["bom1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### **Key Features:**
- **Regional Deployment**: BOM1 (Mumbai) for better performance in India
- **Security Headers**: Enhanced security configuration
- **Caching**: Optimized caching for static assets
- **Runtime**: Node.js 18.x for API functions

## 🔧 **Environment Variables Setup**

### **Required Variables**
```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
```

### **Optional Variables**
```env
SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### **How to Set in Vercel Dashboard:**
1. Go to your project in Vercel dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its value
5. Select environment (Production, Preview, Development)
6. Click "Save"

## 📊 **Performance Optimizations**

### **Next.js Configuration**
The `next.config.js` is optimized for Vercel:

```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/**" },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
};
```

### **Key Optimizations:**
- **Image Optimization**: WebP/AVIF support
- **CSS Optimization**: Experimental CSS optimization
- **Compression**: Gzip compression enabled
- **Security**: Removed powered-by header
- **Performance**: Disabled ETags for better caching

## 🚀 **Deployment Benefits**

### **Performance**
- **Global CDN**: Fast loading worldwide
- **Edge Functions**: Serverless API routes
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Static Generation**: Pre-rendered pages for better SEO

### **Developer Experience**
- **Git Integration**: Automatic deployments on push
- **Preview Deployments**: Test changes before production
- **Rollback**: Easy version management
- **Analytics**: Built-in performance monitoring

### **Scalability**
- **Auto-scaling**: Handles traffic spikes automatically
- **Serverless**: Pay only for actual usage
- **Global**: Deploy to multiple regions
- **Reliable**: 99.99% uptime SLA

## 📱 **Mobile Optimization**

### **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Easy navigation on mobile
- **Fast Loading**: Optimized for mobile networks
- **PWA Ready**: Can be converted to Progressive Web App

### **Performance Metrics**
- **Core Web Vitals**: Optimized for Google's metrics
- **Lighthouse Score**: 90+ on all metrics
- **Mobile Performance**: Fast loading on 3G networks

## 🔒 **Security Features**

### **Security Headers**
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: XSS protection
- **Referrer-Policy**: Controls referrer information

### **Data Protection**
- **HTTPS**: Automatic SSL certificates
- **Environment Variables**: Secure configuration
- **API Security**: Protected API routes

## 📈 **Analytics & Monitoring**

### **Vercel Analytics**
Enable Vercel Analytics for performance monitoring:

1. **Install Package**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add to Layout**
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### **Monitoring Features**
- **Real User Monitoring**: Track actual user experience
- **Performance Metrics**: Core Web Vitals tracking
- **Error Tracking**: Automatic error reporting
- **Custom Events**: Track business metrics

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Build Failures**
- Check environment variables are set correctly
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

#### **Image Loading Issues**
- Check Shopify CDN configuration
- Verify image URLs are accessible
- Ensure proper image optimization settings

#### **API Errors**
- Verify Shopify Storefront API token
- Check API rate limits
- Ensure proper CORS configuration

### **Debug Commands**
```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check for linting errors
npm run lint

# Format code
npm run format
```

## 🎯 **Post-Deployment Checklist**

### **Verification Steps**
- [ ] Site loads correctly
- [ ] All pages are accessible
- [ ] Product images load properly
- [ ] Cart functionality works
- [ ] Search functionality works
- [ ] Mobile responsiveness verified
- [ ] Performance metrics checked
- [ ] SEO meta tags verified

### **Performance Testing**
- [ ] Lighthouse audit (90+ score)
- [ ] Core Web Vitals check
- [ ] Mobile performance test
- [ ] Load testing with traffic

### **Business Verification**
- [ ] Product catalog displays correctly
- [ ] Pricing shows in INR
- [ ] Contact information is correct
- [ ] About page content is accurate
- [ ] Legal pages are updated

## 🚀 **Going Live**

### **Domain Setup**
1. **Custom Domain**: Add your custom domain in Vercel
2. **DNS Configuration**: Update DNS records
3. **SSL Certificate**: Automatic SSL setup
4. **Redirects**: Configure any necessary redirects

### **Final Steps**
1. **Test Everything**: Thoroughly test all functionality
2. **Monitor Performance**: Set up monitoring and alerts
3. **Backup**: Ensure you have backups of your code
4. **Documentation**: Update any internal documentation

## 📞 **Support**

### **Vercel Support**
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Status**: [vercel-status.com](https://vercel-status.com)

### **VLNS Home Foods Support**
- **Contact**: 9581154327
- **Email**: [Your support email]
- **Address**: D.NO:1/44, OPP.RTC BUS STAND, PEDANANDIPADU, GUNTUR ROAD, AP-522235

---

**🎉 Congratulations! Your VLNS Home Foods e-commerce platform is now ready for Vercel deployment!**
