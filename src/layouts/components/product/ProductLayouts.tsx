"use client";

import { SortFilterItem, sorting } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import ProductFilters from "@/partials/ProductFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BsGridFill } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { TbFilter, TbFilterX } from "react-icons/tb";
import DropdownMenu from "../filter/DropdownMenu";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

const ProductLayouts = ({
  categories,
  vendors,
  tags,
  vendorsWithCounts,
  categoriesWithCounts,
}: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInputEditing, setInputEditing] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const isListView = searchParams.get("layout") === "list";

  useEffect(() => {
    const inputField = document.getElementById(
      "searchInput",
    ) as HTMLInputElement;
    if (isInputEditing || searchParams.get("q")) {
      inputField.focus();
    }
  }, [searchParams, isInputEditing]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".collapse-container-class") &&
        !target.closest(".filter-button-container") &&
        isExpanded
      ) {
        setExpanded(false);
      }

      // set input editing state to false when clicking outside the input
      if (
        !target.closest("#searchInput") &&
        isInputEditing &&
        document.getElementById("searchInput")
      ) {
        setInputEditing(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isExpanded, setExpanded, isInputEditing]);

  function layoutChange(isCard: string) {
    const newParams = new URLSearchParams(searchParams.toString());

    if (isCard == "list") {
      newParams.set("layout", isCard);
    } else {
      newParams.delete("layout");
    }
    router.push(createUrl("/products", newParams), { scroll: false });
  }

  return (
    <section className="pt-6 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-3 max-lg:hidden" />

          <div className="col-12 lg:col-9">
            <div className="bg-white dark:bg-darkmode-body rounded-2xl shadow-lg p-4 lg:p-6 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-x-6 items-center">
                  <div className="flex items-center gap-x-3">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <p className="font-semibold text-text-dark dark:text-darkmode-text-dark max-md:hidden">
                      View Options
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => layoutChange("card")}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        isListView 
                          ? "border-border dark:border-darkmode-border text-text-light dark:text-darkmode-text-light hover:border-primary hover:text-primary" 
                          : "border-primary bg-primary text-white shadow-md"
                      }`}
                    >
                      <BsGridFill className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => layoutChange("list")}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        isListView 
                          ? "border-primary bg-primary text-white shadow-md" 
                          : "border-border dark:border-darkmode-border text-text-light dark:text-darkmode-text-light hover:border-primary hover:text-primary"
                      }`}
                    >
                      <FaList className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-x-6 items-center">
                  {/* Filter Button Trigger - Professional styling */}
                  <div className="filter-button-container block lg:hidden">
                    <button 
                      onClick={() => setExpanded(!isExpanded)}
                      className="flex items-center gap-x-2 px-4 py-2 bg-primary hover:bg-[#600018] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      {isExpanded ? (
                        <>
                          <TbFilterX className="w-4 h-4" />
                          <span>Close Filters</span>
                        </>
                      ) : (
                        <>
                          <TbFilter className="w-4 h-4" />
                          <span>Filters</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex gap-x-4 items-center">
                    <div className="flex items-center gap-x-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <p className="font-semibold text-text-dark dark:text-darkmode-text-dark max-md:hidden">
                        Sort By
                      </p>
                    </div>
                    <Suspense>
                      <DropdownMenu list={sorting} />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 lg:col-3">
            <div className="lg:block relative">
              <div className="block lg:hidden w-full">
                <section
                  className="collapse-container-class z-20 w-full"
                  style={{ display: isExpanded ? "block" : "none" }}
                >
                  <div className="pb-8">
                    <Suspense>
                      <ProductFilters
                        categories={categories}
                        vendors={vendors}
                        tags={tags}
                        vendorsWithCounts={vendorsWithCounts}
                        categoriesWithCounts={categoriesWithCounts}
                      />
                    </Suspense>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductLayouts;
