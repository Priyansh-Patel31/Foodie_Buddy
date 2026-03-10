export function RestaurantSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 animate-pulse">
      <div className="h-48 sm:h-56 w-full bg-gray-200" />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-gray-200 rounded w-2/3" />
          <div className="h-5 bg-gray-200 rounded w-10" />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>
    </div>
  );
}

export function FoodItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 bg-white animate-pulse">
      <div className="flex-1">
        <div className="w-4 h-4 bg-gray-200 rounded mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
      <div className="w-32 sm:w-40 flex-shrink-0">
        <div className="w-full aspect-square bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-200" />
      <div className="h-3 bg-gray-200 rounded w-14" />
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded-full w-24" />
        <div className="h-10 bg-gray-200 rounded-full w-24" />
        <div className="h-10 bg-gray-200 rounded-full w-24" />
      </div>
    </div>
  );
}
