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
          <h5 className="mb-2 max-md:text-base">{option.name}</h5>
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
                    className={`flex min-w-[48px] items-center justify-center rounded-md border border-border text-sm cursor-pointer ${isActive && option.name !== "Color"
                      ? "cursor-default ring-2 ring-dark dark:ring-darkmode-dark"
                      : ""
                      } ${!isActive && isAvailableForSale && option.name !== "Color"
                        ? "ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-dark hover:dark:ring-darkmode-dark"
                        : ""
                      } ${!isAvailableForSale
                        ? "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
                        : ""
                      }`}
                  >
                    {/* Render the color image for the current value */}
                    {option.name === "Color" ? (
                      <div
                        key={value}
                        className={`relative rounded-md overflow-hidden ${isActive &&
                          "outline-1 outline-dark dark:outline-darkmode-dark"
                          }`}
                      >
                        <Image
                          src={imageMap[value]}
                          alt={value}
                          width={50}
                          height={50}
                          className={`${isActive && "opacity-80"}`}
                        />
                        {isActive && (
                          <span className="text-inherit h-full opacity-100 absolute top-2 right-2">
                            <BsCheckLg size={35} />
                          </span>
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
          <h5 className="mb-2 max-md:text-base">{option.name}</h5>
          <Suspense>
            <VariantDropDown sizeOption={option} options={options} />
          </Suspense>
        </div>
      ))}
    </div>
  );
}
