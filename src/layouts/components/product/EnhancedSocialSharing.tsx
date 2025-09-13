"use client";

import DynamicIcon from "@/helpers/DynamicIcon";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface EnhancedSocialSharingProps {
  productTitle: string;
  productDescription?: string;
  productImage?: string;
  className?: string;
}

const EnhancedSocialSharing: React.FC<EnhancedSocialSharingProps> = ({
  productTitle,
  productDescription = "",
  productImage = "",
  className = "flex flex-wrap gap-4",
}) => {
  const pathname = usePathname();
  const [baseUrl, setBaseUrl] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState("");
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    // Check if Web Share API is supported
    setCanShare(!!navigator.share);
  }, []);

  const fullUrl = `${baseUrl}${pathname}`;
  const shareText = `Check out this amazing product: ${productTitle}`;
  const shareData = {
    title: productTitle,
    text: productDescription || shareText,
    url: fullUrl,
  };

  const showTooltip = (type: string) => {
    setIsTooltipVisible(type);
    setTimeout(() => {
      setIsTooltipVisible("");
    }, 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      showTooltip("copied");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showTooltip("copied");
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share(shareData);
      showTooltip("shared");
    } catch (err) {
      console.log("Error sharing:", err);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappText = encodeURIComponent(`${shareText}\n\n${fullUrl}`);
    window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
    showTooltip("whatsapp");
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "FaFacebookF",
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      action: "link"
    },
    {
      name: "Twitter",
      icon: "FaXTwitter",
      color: "bg-gray-900 hover:bg-gray-800",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
      action: "link"
    },
    {
      name: "LinkedIn",
      icon: "FaLinkedinIn",
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(productTitle)}`,
      action: "link"
    },
    {
      name: "Instagram",
      icon: "FaInstagram",
      color: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600",
      url: `https://www.instagram.com/`,
      action: "link"
    },
    {
      name: "WhatsApp",
      icon: "FaWhatsapp",
      color: "bg-green-600 hover:bg-green-700",
      action: "whatsapp"
    },
  ];

  return (
    <div className={className}>
      {/* Native Share Button (Mobile) */}
      {canShare && (
        <div className="relative">
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-[#600018] text-white rounded-2xl hover:from-[#600018] hover:to-primary transition-all duration-300 transform hover:scale-110 hover:shadow-xl ring-2 ring-primary/20"
            aria-label="Share via device"
          >
            <DynamicIcon className="w-6 h-6" icon="FaShareAlt" />
          </button>
          {isTooltipVisible === "shared" && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
              <DynamicIcon className="inline-block text-green-400 mr-1" icon="FaCheck" />
              Shared!
            </div>
          )}
        </div>
      )}

      {/* Social Media Buttons */}
      {socialLinks.map((social) => (
        <div key={social.name} className="relative">
          {social.action === "link" ? (
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 ${social.color} text-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl ring-2 ring-white/20`}
              aria-label={`Share on ${social.name}`}
              onClick={() => showTooltip(social.name.toLowerCase())}
            >
              <DynamicIcon className="w-6 h-6" icon={social.icon} />
            </a>
          ) : social.action === "whatsapp" ? (
            <button
              onClick={handleWhatsAppShare}
              className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 ${social.color} text-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl ring-2 ring-white/20`}
              aria-label={`Share on ${social.name}`}
            >
              <DynamicIcon className="w-6 h-6" icon={social.icon} />
            </button>
          ) : null}
          
          {isTooltipVisible === social.name.toLowerCase() && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
              <DynamicIcon className="inline-block text-green-400 mr-1" icon="FaExternalLinkAlt" />
              Opening {social.name}...
            </div>
          )}
          
          {isTooltipVisible === "whatsapp" && social.name === "WhatsApp" && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
              <DynamicIcon className="inline-block text-green-400 mr-1" icon="FaWhatsapp" />
              Opening WhatsApp...
            </div>
          )}
        </div>
      ))}

      {/* Copy Link Button */}
      <div className="relative">
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-xl ring-2 ring-white/20"
          aria-label="Copy product link"
        >
          <DynamicIcon className="w-6 h-6" icon="FaRegCopy" />
        </button>
        {isTooltipVisible === "copied" && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
            <DynamicIcon className="inline-block text-green-400 mr-1" icon="FaCheck" />
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSocialSharing;
