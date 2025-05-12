import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { IOrderStatus, IPaymentStatus } from "@/types";

export function PaymentStatusBadge({
  status,
}: {
  status: IOrderStatus | IPaymentStatus;
}) {
  const _status = status?.toLowerCase();
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize text-xs px-2 py-0.5 rounded-sm",
        _status === "completed" &&
          "bg-green-50 text-green-700 border-green-200",
        _status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
        _status === "failed" && "bg-red-50 text-red-700 border-red-200"
      )}
    >
      {status}
    </Badge>
  );
}
