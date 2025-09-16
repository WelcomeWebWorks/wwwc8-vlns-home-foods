import { BsCart3 } from "react-icons/bs";
import Link from "next/link";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <Link 
      href="/cart" 
      className="relative text-4xl sm:text-5xl text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
      aria-label="View cart"
    >
      <BsCart3
        className={`${className || ''}`}
      />

      {quantity && quantity > 0 ? (
        <div className="bg-[#800020] text-white text-sm font-bold rounded-full absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white">
          {quantity > 99 ? '99+' : quantity}
        </div>
      ) : null}
    </Link>
  );
}
