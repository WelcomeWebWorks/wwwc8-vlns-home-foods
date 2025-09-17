const TwSizeIndicator = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div 
        className="fixed left-0 top-0 z-50 flex w-[30px] items-center justify-center bg-gray-200 py-[2.5px] text-[12px] uppercase text-black sm:bg-red-200 md:bg-yellow-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-pink-200"
        suppressHydrationWarning={true}
      >
        <span className="block sm:hidden" suppressHydrationWarning={true}>all</span>
        <span className="hidden sm:block md:hidden" suppressHydrationWarning={true}>sm</span>
        <span className="hidden md:block lg:hidden" suppressHydrationWarning={true}>md</span>
        <span className="hidden lg:block xl:hidden" suppressHydrationWarning={true}>lg</span>
        <span className="hidden xl:block 2xl:hidden" suppressHydrationWarning={true}>xl</span>
        <span className="hidden 2xl:block" suppressHydrationWarning={true}>2xl</span>
      </div>
    );
  } else {
    return null;
  }
};

export default TwSizeIndicator;
