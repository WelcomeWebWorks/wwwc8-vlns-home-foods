"use client";
import { createUrl } from "@/lib/utils";
import { slugify } from "@/lib/utils/textConverter";
import { useRouter, useSearchParams } from "next/navigation";

type ShowTagsProps = {
  tags: string[];
};

const ShowTags: React.FC<ShowTagsProps> = ({ tags }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("t");

  const handleTagClick = (name: string) => {
    const slugName = slugify(name.toLowerCase());
    const newParams = new URLSearchParams(searchParams.toString());

    if (slugName === selectedTag) {
      newParams.delete("t");
    } else {
      newParams.set("t", slugName);
    }

    router.push(createUrl("/products", newParams), { scroll: false });
  };

  // Debug logging for tags
  console.log("ShowTags received tags:", tags);
  console.log("ShowTags number of tags:", tags.length);

  // Filter out empty or invalid tags
  const validTags = tags.filter(tag => tag && tag.trim() !== "");

  return (
    <div className="flex flex-wrap gap-3">
      {validTags.length > 0 ? (
        validTags.map((tag: string) => (
          <span
            key={tag}
            className={`cursor-pointer px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium text-sm transform hover:scale-105 ${
              selectedTag === slugify(tag.toLowerCase())
                ? "bg-primary text-white border-primary shadow-lg"
                : "bg-white dark:bg-darkmode-body border-border dark:border-darkmode-border text-text-dark dark:text-darkmode-text-dark hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-md"
            }`}
            onClick={() => handleTagClick(tag)}
          >
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{tag}</span>
            </div>
          </span>
        ))
      ) : (
        <p className="text-text-light dark:text-darkmode-text-light text-sm italic">
          No tags available
        </p>
      )}
    </div>
  );
};

export default ShowTags;
