import Cart from "@/components/cart/Cart";
import config from "@/config/config.json";
import theme from "@/config/theme.json";
import TwSizeIndicator from "@/helpers/TwSizeIndicator";
import Footer from "@/partials/Footer";
import Header from "@/partials/Header";
import Providers from "@/partials/Providers";
import WhatsAppButton from "@/layouts/components/WhatsAppButton";
import EnhancedMarketingBanners from "@/layouts/components/EnhancedMarketingBanners";
import { ToastManager } from "@/components/ui/Toast";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import "@/styles/main.css";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // import google font css
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;

  return (
    <html suppressHydrationWarning={true} lang="en" className="light">
      <head>
        {/* responsive meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover"
        />

        {/* favicon */}
        <link rel="shortcut icon" href={config.site.favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="vlns-home-foods" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          content="#fff"
        />

        {/* google font css */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href={`https://fonts.googleapis.com/css2?family=${pf}${sf ? "&family=" + sf : ""
            }&display=swap`}
          rel="stylesheet"
        />
      </head>

      <body suppressHydrationWarning={true}>
        <TwSizeIndicator />
        <CurrencyProvider>
          <Providers>
            <Header>
              <div className="w-8 h-8" />
              <Cart />
            </Header>
            <main className="relative z-10 pt-48 sm:pt-52 md:pt-56 lg:pt-60 xl:pt-40">{children}</main>
            <EnhancedMarketingBanners />
            <Footer />
            <WhatsAppButton />
            <ToastManager />
          </Providers>
        </CurrencyProvider>
      </body>
    </html>
  );
}
