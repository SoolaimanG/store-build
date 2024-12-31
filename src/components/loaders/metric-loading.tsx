import { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const MetricLoading: FC<{ className?: string }> = ({ className }) => {
  return [...Array(4)].map((_, idx) => (
    <Skeleton className={cn("w-full h-[6.5rem]", className)} key={idx} />
  ));
};

export default MetricLoading;
