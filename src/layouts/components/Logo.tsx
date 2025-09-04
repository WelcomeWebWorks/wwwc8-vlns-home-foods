"use client";

import config from "@/config/config.json";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Logo = ({ src }: { src?: string }) => {

  const {
    logo,
    logo_darkmode,
    logo_width,
    logo_height,
    logo_text,
    title,
  }: {
    logo: string;
    logo_darkmode: string;
    logo_width: any;
    logo_height: any;
    logo_text: string;
    title: string;
  } = config.site;

  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const resolvedLogo =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? logo_darkmode
      : logo;
  const logoPath = src ? src : resolvedLogo;

  // Desktop logo size (larger)
  const desktopLogoHeight = parseInt(logo_height.replace("px", "")) * 0.5; // 60px for desktop
  const desktopLogoWidth = parseInt(logo_width.replace("px", "")) * 0.5; // 225px for desktop
  
  // Mobile/tablet logo size (original)
  const mobileLogoHeight = parseInt(logo_height.replace("px", "")); // 40px for mobile
  const mobileLogoWidth = parseInt(logo_width.replace("px", "")); // 150px for mobile

  return (
    <Link href="/" className="navbar-brand inline-block">
      {logoPath ? (
        <Image
          width={desktopLogoWidth * 2}
          height={desktopLogoHeight * 2}
          src={logoPath}
          alt={title}
          priority
          className="lg:h-[60px] lg:w-[225px] h-[40px] w-[150px]"
          style={{
            height: "auto",
            width: "auto",
          }}
        />
      ) : logo_text ? (
        logo_text
      ) : (
        title
      )}
    </Link>
  );
};

export default Logo;
