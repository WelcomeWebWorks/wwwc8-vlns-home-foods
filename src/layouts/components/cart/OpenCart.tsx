import Link from "next/link";
import Image from "next/image";

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
      suppressHydrationWarning={true}
    >
      <Image
        src="/images/shopping-cart.svg"
        alt="Shopping Cart"
        width={48}
        height={48}
        className={`${className || ''}`}
        suppressHydrationWarning={true}
      />

      {quantity && quantity > 0 ? (
        <div 
          className="bg-[#800020] text-white text-sm font-bold rounded-full absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white"
          suppressHydrationWarning={true}
        >
          {quantity > 99 ? '99+' : quantity}
        </div>
      ) : null}
    </Link>
  );
}
