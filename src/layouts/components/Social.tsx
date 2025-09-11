"use client";

import DynamicIcon from "@/helpers/DynamicIcon";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Social: React.FC<{ socialName: string; className: string }> = ({
  socialName,
  className,
}: {
  socialName: string;
  className: string;
}) => {
  const pathname = usePathname();
  const [baseUrl, setBaseUrl] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopyLink = () => {
    const fullLink = `${baseUrl}${pathname}`;
    const textArea = document.createElement("textarea");
    textArea.value = fullLink;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    // Show the tooltip
    setIsTooltipVisible(true);
    setTimeout(() => {
      setIsTooltipVisible(false);
    }, 1000);
  };

  return (
    <ul className={className}>
      <li>
        <a
          aria-label={socialName}
          href={`https://www.facebook.com/sharer/sharer.php?u=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="w-5 h-5" icon={"FaFacebookF"} />
        </a>
      </li>

      <li>
        <a
          aria-label={socialName}
          href={`https://twitter.com/intent/tweet?text=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="w-5 h-5" icon={"FaXTwitter"} />
        </a>
      </li>

      <li>
        <a
          aria-label={socialName}
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center justify-center w-10 h-10 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="w-5 h-5" icon={"FaLinkedinIn"} />
        </a>
      </li>

      <li>
        <a
          className="cursor-pointer relative flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
          onClick={handleCopyLink}
          aria-label="Copy Link"
        >
          <span className="sr-only">Copy Link</span>
          {isTooltipVisible && (
            <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              <DynamicIcon
                className="inline-block text-green-400 mr-1"
                icon={"FaLink"}
              />
              copied!
            </span>
          )}
          <DynamicIcon className="w-5 h-5" icon={"FaRegCopy"} />
        </a>
      </li>
    </ul>
  );
};

export default Social;
