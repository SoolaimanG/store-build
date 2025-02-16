import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { Skeleton } from "./ui/skeleton";

interface StatsCardProps {
  label: string;
  value: number | string;
}

function StatsCard({ label, value }: StatsCardProps) {
  return (
    <Card className="p-3 rounded-none bg-slate-900 cursor-pointer">
      <CardContent className="p-2 flex flex-col gap-2">
        <CardDescription className="text-sm text-muted-foreground leading-none tracking-tight">
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-wider">
          {value}
        </CardTitle>
      </CardContent>
    </Card>
  );
}

export function OrderStats() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["order-metrics"],
    queryFn: () => storeBuilder.getOrderMetrics(),
  });

  useToastError(error);

  const { data: response } = data || {};

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, idx) => (
          <Skeleton
            key={idx}
            className="p-3 rounded-none bg-slate-900 cursor-pointer w-full h-[5.5rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatsCard label="Total orders" value={response?.totalOrders || 0} />
      <StatsCard
        label="Delivered over time"
        value={response?.deliveredOverTime || 0}
      />
      <StatsCard label="Returns" value={response?.returns || 0} />
      <StatsCard
        label="Avg. order value"
        value={formatAmountToNaira(response?.avgOrderValue || 0)}
      />
      <StatsCard
        label="Total order amount"
        value={formatAmountToNaira(response?.totalOrderAmount || 0)}
      />
    </div>
  );
}
