"use client";

import config from "@/config/config.json";
import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  const { default_theme } = config.settings;

  // Force light theme on client side
  useEffect(() => {
    // Remove any existing theme from localStorage
    localStorage.removeItem('theme');
    // Force light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

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
