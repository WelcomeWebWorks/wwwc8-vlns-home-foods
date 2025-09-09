import { BsCart3 } from "react-icons/bs";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative text-3xl text-yellow-500 hover:text-yellow-600 transition-colors duration-200">
      <BsCart3
        className={`${className || ''}`}
      />

      {quantity && quantity > 0 ? (
        <div className="bg-[#800020] text-white text-xs font-bold rounded-full absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
          {quantity > 99 ? '99+' : quantity}
        </div>
      ) : null}
    </div>
  );
}
