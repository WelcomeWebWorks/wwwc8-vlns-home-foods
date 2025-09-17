const SkeletonCategory = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8" suppressHydrationWarning={true}>
      {Array(3)
        .fill(0)
        .map((_, index) => {
          return (
            <div
              key={index}
              className="h-[150px] md:h-[250px] lg:h-[306px] rounded-md animate-pulse bg-neutral-200 dark:bg-neutral-700"
              suppressHydrationWarning={true}
            />
          );
        })}
    </div>
  );
};

export default SkeletonCategory;
