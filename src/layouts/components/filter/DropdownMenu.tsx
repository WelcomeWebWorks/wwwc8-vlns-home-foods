"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ListItem } from "../product/ProductLayouts";
import { FilterDropdownItem } from "./FilterDropdownItem";

const DropdownMenu = ({ list }: { list: ListItem[] }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");

  const [openSelect, setOpenSelect] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (openSelect && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 200, // 200px is max-width
        width: rect.width
      });
    }
  }, [openSelect]);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathname === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      ) {
        setActive(listItem.title);
      }
    });
  }, [pathname, list, searchParams]);

  if (!mounted) {
    return (
      <div className="dropdown-menu-container inline-block text-left text-text-light w-full max-w-[200px]" ref={menuRef}>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-2 rounded-lg bg-white dark:bg-darkmode-body px-3 py-2 text-sm font-semibold shadow-lg border-2 border-border dark:border-darkmode-border hover:border-primary dark:hover:border-primary cursor-pointer transition-all duration-300 text-text-dark dark:text-darkmode-text-dark hover:text-primary dark:hover:text-primary min-w-[120px] max-w-[200px]"
          id="menu-button"
          aria-haspopup="true"
        >
          <div className="truncate text-xs sm:text-sm">{active || "Select Sort"}</div>
          <svg
            className="-mr-1 h-4 w-4 text-text-light dark:text-darkmode-text-light transition-transform duration-300 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="dropdown-menu-container inline-block text-left text-text-light w-full max-w-[200px]" ref={menuRef}>
      <button
        type="button"
        className="inline-flex w-full justify-center gap-x-2 rounded-lg bg-white dark:bg-darkmode-body px-3 py-2 text-sm font-semibold shadow-lg border-2 border-border dark:border-darkmode-border hover:border-primary dark:hover:border-primary cursor-pointer transition-all duration-300 text-text-dark dark:text-darkmode-text-dark hover:text-primary dark:hover:text-primary min-w-[120px] max-w-[200px]"
        onClick={() => {
          setOpenSelect(!openSelect);
        }}
        id="menu-button"
        aria-haspopup="true"
      >
        <div className="truncate text-xs sm:text-sm">{active || "Select Sort"}</div>
        <svg
          className={`-mr-1 h-4 w-4 text-text-light dark:text-darkmode-text-light transform ${openSelect ? "rotate-180" : ""
            } transition-transform duration-300 flex-shrink-0`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {openSelect && mounted && createPortal(
        <div
          className="fixed bg-white dark:bg-darkmode-body shadow-2xl border-2 border-border dark:border-darkmode-border rounded-lg overflow-hidden max-h-60 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxWidth: '200px',
            zIndex: 999999,
            position: 'fixed'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            {list.map((item: ListItem, i) => (
              <Suspense key={i}>
                <FilterDropdownItem 
                  item={item} 
                  onItemClick={() => setOpenSelect(false)}
                />
              </Suspense>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DropdownMenu;
