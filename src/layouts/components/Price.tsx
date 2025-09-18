"use client";

import { useCurrency } from '@/contexts/CurrencyContext';

const Price = ({
  amount,
  className,
  currencyCode,
  currencyCodeClassName,
  showCurrencyCode = true,
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
  showCurrencyCode?: boolean;
} & React.ComponentProps<"p">) => {
  const { formatPrice, getCurrencySymbol } = useCurrency();
  
  const displayPrice = formatPrice(amount, currencyCode);
  const symbol = getCurrencySymbol(currencyCode);
  const code = currencyCode || 'INR';

  return (
    <p suppressHydrationWarning={true} className={className}>
      {displayPrice}
      {showCurrencyCode && (
        <span
          className={`ml-1 inline ${currencyCodeClassName}`}
        >
          {code}
        </span>
      )}
    </p>
  );
};

export default Price;
