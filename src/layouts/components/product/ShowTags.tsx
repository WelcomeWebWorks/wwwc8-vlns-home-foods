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
            className={`cursor-pointer px-3 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
              selectedTag === slugify(tag.toLowerCase())
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-darkmode-body border-border dark:border-darkmode-border text-text-dark dark:text-darkmode-text-dark hover:border-primary hover:text-primary"
            }`}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </span>
        ))
      ) : (
        <p className="text-text-light dark:text-darkmode-text-light text-sm">
          No tags available
        </p>
      )}
    </div>
  );
};

export default ShowTags;
