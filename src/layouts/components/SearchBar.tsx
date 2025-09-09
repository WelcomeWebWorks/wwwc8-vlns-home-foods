"use client";

import { createUrl } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInputEditing, setInputEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const inputField = document.getElementById(
      "searchInput",
    ) as HTMLInputElement;
    if (isInputEditing || searchParams.get("q")) {
      inputField.focus();
    }
  }, [searchParams, isInputEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEditing(true);
    setInputValue(e.target.value);

    const newParams = new URLSearchParams(searchParams.toString());

    if (e.target.value) {
      newParams.set("q", e.target.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/products", newParams), { scroll: false });
  };

  const handleClear = () => {
    setInputValue("");
    setInputEditing(false);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("q");

    router.push(createUrl("/products", newParams));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/products", newParams));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border-2 border-gray-300 hover:border-[#800020] focus-within:border-[#800020] rounded-xl flex bg-white shadow-lg transition-all duration-300 pl-4 relative"
    >
      <input
        id="searchInput"
        className="bg-transparent border-none search-input focus:ring-transparent p-3 w-full text-gray-800 placeholder-gray-500"
        key={searchParams?.get("q")}
        type="search"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        value={inputValue}
        onChange={handleChange}
      />
      {inputValue && (
        <button
          type="button"
          className="p-2 m-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={handleClear}
        >
          <IoClose size={20} className="text-gray-500" />
        </button>
      )}
      <button className="search-icon p-2 m-1 rounded-full bg-[#800020] hover:bg-[#600018] transition-colors duration-200">
        <IoSearch size={20} className="text-white" />
      </button>
    </form>
  );
};

export default SearchBar;
