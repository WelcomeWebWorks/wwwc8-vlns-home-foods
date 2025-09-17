"use client";

import config from "@/config/config.json";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  const { default_theme } = config.settings;
  const [mounted, setMounted] = useState(false);

  // Force light theme on client side after mount
  useEffect(() => {
    setMounted(true);
    // Remove any existing theme from localStorage
    localStorage.removeItem('theme');
    // Force light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableColorScheme={false}
        disableTransitionOnChange={false}
      >
        {children}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableColorScheme={false}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
};

export default Providers;
