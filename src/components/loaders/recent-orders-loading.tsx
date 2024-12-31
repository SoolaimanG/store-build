import { Skeleton } from "../ui/skeleton";

const RecentOrdersLoading = () => {
  return Array.from({ length: 3 }).map((_, i) => (
    <div
      key={i}
      className="flex items-center justify-between p-4 rounded-lg border"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16 mt-1" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24 mt-1" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  ));
};

export default RecentOrdersLoading;
