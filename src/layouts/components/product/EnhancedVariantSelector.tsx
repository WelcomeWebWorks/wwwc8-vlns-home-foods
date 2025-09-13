"use client";

import { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BsCheckLg } from "react-icons/bs";
import { ImageItem } from "./ProductGallery";
import VariantDropDown from "./VariantDropDown";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export const generateImageMap = (images: ImageItem[]) => {
  const imageMap: { [altText: string]: string } = {};

  images.forEach((image) => {
    if (!(image.altText in imageMap)) {
      imageMap[image.altText] = image.url;
    }
  });

  return imageMap;
};

export function EnhancedVariantSelector({
  options,
  variants,
  images,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  images: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const imageMap = generateImageMap(images);

  // Get all option parameters from URL
  const optionParams: { [key: string]: string } = {};
  options.forEach(option => {
    const paramValue = searchParams.get(option.name.toLowerCase());
    if (paramValue) {
      optionParams[option.name.toLowerCase()] = paramValue;
    }
  });

  // Set default options based on available options
  const defaultOption: { [key: string]: string } = {};
  options.forEach(option => {
    const optionKey = option.name.toLowerCase();
    if (optionParams[optionKey]) {
      defaultOption[optionKey] = optionParams[optionKey];
    } else {
      defaultOption[optionKey] = option.values[0];
    }
  });

  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  // Find options that should be rendered as dropdowns (typically Size, etc.)
  const dropdownOptions = options.filter(option =>
    option.name.toLowerCase() === "size" ||
    (option.name.toLowerCase() !== "weight" && option.values.length > 5)
  );

  // Find options that should be rendered as buttons (typically Color, Oil Type, Weight, etc.)
  const buttonOptions = options.filter(option =>
    !dropdownOptions.includes(option)
  );

  return (
    <div className="space-y-8">
      {/* Render button options with enhanced sizing */}
      {buttonOptions.map((option) => (
        <div className="space-y-4" key={option.id}>
          <h5 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span>{option.name}</span>
          </h5>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();
              const optionSearchParams = new URLSearchParams(
                searchParams.toString(),
              );
              optionSearchParams.set(optionNameLowerCase, value);
              const optionUrl = createUrl(pathname, optionSearchParams);

              const filtered = Array.from(optionSearchParams.entries()).filter(
                ([key, value]) =>
                  options?.find(
                    (option) =>
                      option.name.toLowerCase() === key &&
                      option.values.includes(value),
                  ),
              );

              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, value]) =>
                    combination[key] === value && combination.availableForSale,
                ),
              );

              const isActive =
                searchParams.get(optionNameLowerCase) === value ||
                (!searchParams.get(optionNameLowerCase) &&
                  value === defaultOption[optionNameLowerCase]);

              return (
                <div key={value} className="w-full">
                  <button
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    onClick={() => {
                      router.replace(optionUrl, { scroll: false });
                    }}
                    title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                    className={`w-full min-h-[60px] md:min-h-[65px] lg:min-h-[70px] flex items-center justify-center rounded-xl border-2 text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 ease-in-out transform ${
                      isActive && option.name !== "Color"
                        ? "border-primary bg-gradient-to-br from-primary to-[#600018] text-white shadow-2xl scale-105 ring-4 ring-primary/20"
                        : ""
                    } ${
                      !isActive && isAvailableForSale && option.name !== "Color"
                        ? "border-border dark:border-darkmode-border bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-primary/10"
                        : ""
                    } ${
                      !isAvailableForSale
                        ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    {/* Enhanced Color option rendering */}
                    {option.name === "Color" ? (
                      <div
                        className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out ${
                          isActive
                            ? "border-primary shadow-xl transform scale-105 ring-2 ring-primary/20"
                            : "border-border dark:border-darkmode-border hover:border-primary hover:scale-105 hover:shadow-lg"
                        }`}
                      >
                        <Image
                          src={imageMap[value]}
                          alt={value}
                          width={80}
                          height={80}
                          className={`w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] object-cover transition-all duration-300 ${
                            isActive ? "opacity-90" : "opacity-100"
                          }`}
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                            <div className="bg-primary text-white rounded-full p-2 shadow-lg">
                              <BsCheckLg size={24} />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="px-4 py-2 text-center leading-tight">{value}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Enhanced dropdown options */}
      {dropdownOptions.map((option) => (
        <div className="space-y-4" key={option.id}>
          <h5 className="text-xl md:text-2xl font-bold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span>{option.name}</span>
          </h5>
          <Suspense>
            <VariantDropDown sizeOption={option} options={options} />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
