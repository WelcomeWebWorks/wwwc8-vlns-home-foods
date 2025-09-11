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
    // Use the first image encountered for each unique altText
    if (!(image.altText in imageMap)) {
      imageMap[image.altText] = image.url;
    }
  });

  return imageMap;
};

export function VariantSelector({
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

  // Find options that should be rendered as dropdowns (typically Size, Weight, etc.)
  const dropdownOptions = options.filter(option => 
    option.name.toLowerCase() === "size" || 
    option.name.toLowerCase() === "weight" ||
    option.values.length > 5 // If more than 5 values, use dropdown
  );

  // Find options that should be rendered as buttons (typically Color, Oil Type, etc.)
  const buttonOptions = options.filter(option => 
    !dropdownOptions.includes(option)
  );

  return (
    <div>
      {/* Render button options (Color, Oil Type, etc.) */}
      {buttonOptions.map((option) => (
        <div className="mb-6" key={option.id}>
          <h5 className="mb-3 text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{option.name}</span>
          </h5>
          <div className="flex flex-wrap gap-3">
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
                <div key={value}>
                  <button
                    key={value}
                    aria-disabled={!isAvailableForSale}
                    disabled={!isAvailableForSale}
                    onClick={() => {
                      router.replace(optionUrl, { scroll: false });
                    }}
                    title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""
                      }`}
                    className={`flex min-w-[48px] items-center justify-center rounded-lg border-2 text-sm font-medium transition-all duration-300 ease-in-out ${
                      isActive && option.name !== "Color"
                        ? "border-primary bg-primary text-white shadow-lg transform scale-105"
                        : ""
                      } ${
                        !isActive && isAvailableForSale && option.name !== "Color"
                          ? "border-border dark:border-darkmode-border bg-white dark:bg-darkmode-body text-text-dark dark:text-darkmode-text-dark hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-md"
                          : ""
                      } ${
                        !isAvailableForSale
                          ? "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                  >
                    {/* Render the color image for the current value */}
                    {option.name === "Color" ? (
                      <div
                        key={value}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ease-in-out ${
                          isActive
                            ? "border-primary shadow-lg transform scale-110"
                            : "border-border dark:border-darkmode-border hover:border-primary hover:scale-105"
                        }`}
                      >
                        <Image
                          src={imageMap[value]}
                          alt={value}
                          width={60}
                          height={60}
                          className={`transition-opacity duration-300 ${
                            isActive ? "opacity-90" : "opacity-100"
                          }`}
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-white rounded-full p-1">
                              <BsCheckLg size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      value
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Render dropdown options (Size, Weight, etc.) */}
      {dropdownOptions.map((option) => (
        <div className="mb-8 mt-8" key={option.id}>
          <h5 className="mb-3 text-lg font-semibold text-text-dark dark:text-darkmode-text-dark flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
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
