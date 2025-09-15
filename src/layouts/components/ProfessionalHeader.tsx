"use client";

import React from "react";

interface ProfessionalHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  showUnderline?: boolean;
  underlineColor?: string;
  textAlign?: "left" | "center" | "right";
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  title,
  subtitle,
  description,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  descriptionClassName = "",
  showUnderline = true,
  underlineColor = "primary",
  textAlign = "center"
}) => {
  const getTextAlignClass = () => {
    switch (textAlign) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  const getUnderlineColorClass = () => {
    switch (underlineColor) {
      case "primary":
        return "bg-primary";
      case "accent":
        return "bg-accent";
      case "secondary":
        return "bg-secondary";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className={`${getTextAlignClass()} ${className}`}>
      {/* Subtitle */}
      {subtitle && (
        <div className={`mb-3 ${subtitleClassName}`}>
          <span className="inline-block px-4 py-2 text-sm font-semibold text-primary bg-primary/10 rounded-full border border-primary/20 tracking-wide uppercase">
            {subtitle}
          </span>
        </div>
      )}

      {/* Main Title */}
      <h2 className={`font-secondary text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-dark dark:text-darkmode-text-dark leading-tight tracking-tight mb-6 ${titleClassName}`}>
        {title}
      </h2>

      {/* Underline */}
      {showUnderline && (
        <div className={`flex ${textAlign === "center" ? "justify-center" : textAlign === "right" ? "justify-end" : "justify-start"} mb-6`}>
          <div className={`w-24 h-1 ${getUnderlineColorClass()} rounded-full`}></div>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className={`text-lg md:text-xl text-text-light dark:text-darkmode-text-light leading-relaxed max-w-4xl ${textAlign === "center" ? "mx-auto" : ""} ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default ProfessionalHeader;
