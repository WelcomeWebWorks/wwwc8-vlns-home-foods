"use client";

import { SortFilterItem as SortFilterItemType } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ListItem,
  PathFilterItem as PathFilterItemType,
} from "../product/ProductLayouts";

function PathFilterItem({ item, onItemClick }: { item: PathFilterItemType; onItemClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={`w-full text-sm ${active ? "bg-green-400" : "hover:underline"
          }`}
        onClick={onItemClick}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item, onItemClick }: { item: SortFilterItemType; onItemClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q");

  const newParams = new URLSearchParams(searchParams.toString());

  if (item.slug) {
    newParams.set("sort", item.slug);
  } else {
    newParams.delete("sort");
  }

  const href = createUrl(pathname, newParams);

  const active = searchParams.get("sort") === item.slug;

  const DynamicTag = active ? "p" : Link;

  return (
    <li
      className="flex text-sm text-text-dark dark:text-darkmode-text-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
      key={item.title}
    >
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={`w-full px-4 py-3 transition-colors duration-200 ${
          active
            ? "bg-primary text-white font-semibold"
            : "hover:text-primary dark:hover:text-primary"
        }`}
        onClick={onItemClick}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterDropdownItem({ item, onItemClick }: { item: ListItem; onItemClick?: () => void }) {
  return "path" in item ? (
    <PathFilterItem item={item} onItemClick={onItemClick} />
  ) : (
    <SortFilterItem item={item} onItemClick={onItemClick} />
  );
}
