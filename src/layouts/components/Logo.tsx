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

  // Always use light logo to prevent hydration mismatch
  // Since theme switcher is disabled, we always use light mode
  const logoPath = src ? src : logo;

  // Responsive logo sizing
  const baseLogoHeight = parseInt(logo_height.replace("px", ""));
  const baseLogoWidth = parseInt(logo_width.replace("px", ""));

  return (
    <Link href="/" className="navbar-brand inline-block">
      {logoPath ? (
        <Image
          width={baseLogoWidth * 2}
          height={baseLogoHeight * 2}
          src={logoPath}
          alt={title}
          priority
          className="h-[24px] w-[90px] sm:h-[28px] sm:w-[110px] xl:h-[40px] xl:w-[150px] 2xl:h-[45px] 2xl:w-[170px]"
          style={{
            height: "auto",
            width: "auto",
          }}
        />
      ) : logo_text ? (
        <span className="text-xs sm:text-sm xl:text-lg font-bold text-primary">
          {logo_text}
        </span>
      ) : (
        <span className="text-xs sm:text-sm xl:text-lg font-bold text-primary">
          {title}
        </span>
      )}
    </Link>
  );
};

export default Logo;
