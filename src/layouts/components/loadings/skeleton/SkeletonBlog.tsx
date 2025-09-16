const SkeletonBlog = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="group">
          <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white dark:bg-darkmode-light">
            {/* Image Skeleton */}
            <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-6 text-center">
              {/* Title Skeleton */}
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4 w-3/4 mx-auto"></div>
              
              {/* Description Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mx-auto"></div>
              </div>

              {/* Button Skeleton */}
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonBlog;
