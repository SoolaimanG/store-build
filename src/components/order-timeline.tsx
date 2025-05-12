import { formatDate } from "@/lib/utils";
import { IOrderStatus } from "@/types";

interface StatusItem {
  label: string;
  description: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export const OrderTimeLine = ({
  orderStatus,
  createdAt,
  updatedAt,
  estimatedDeliveryDate,
}: {
  orderStatus: IOrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate: string;
}) => {
  // Helper function to get all statuses in order with their completion state
  const getOrderStatuses = (): StatusItem[] => {
    const statuses: StatusItem[] = [
      {
        label: "Order Placed",
        description: "Your order has been placed",
        date: createdAt,
        completed: true, // Order placed is always completed
        current: orderStatus === "Pending",
      },
      {
        label: "Processing",
        description: "Your order is being processed",
        date: orderStatus === "Processing" ? updatedAt : undefined,
        completed: ["Processing", "Shipped", "Delivered"].includes(orderStatus),
        current: orderStatus === "Processing",
      },
      {
        label: "Shipped",
        description: "Your order has been shipped",
        date: orderStatus === "Shipped" ? updatedAt : undefined,
        completed: ["Shipped", "Delivered"].includes(orderStatus),
        current: orderStatus === "Shipped",
      },
      {
        label: "Delivered",
        description: "Your order has been delivered",
        date: estimatedDeliveryDate,
        completed: orderStatus === "Completed",
        current: orderStatus === "Completed",
      },
    ];

    // Add cancelled or refunded status if applicable
    if (orderStatus === "Cancelled") {
      statuses.push({
        label: "Cancelled",
        description: "Your order has been cancelled",
        date: updatedAt,
        completed: true,
        current: true,
      });
    } else if (orderStatus === "Refunded") {
      statuses.push({
        label: "Refunded",
        description: "Your order has been refunded",
        date: updatedAt,
        completed: true,
        current: true,
      });
    }

    return statuses;
  };

  // Generate timeline based on current order status
  const renderTimeline = () => {
    const statuses = getOrderStatuses();

    return (
      <div className="mt-4 border-t pt-4">
        {statuses.map((status, index) => (
          <div
            key={status.label}
            className={`flex gap-3 ${
              index < statuses.length - 1 ? "mb-3" : ""
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full mt-1 ${
                status.completed
                  ? status.current
                    ? "bg-primary"
                    : "bg-gray-300"
                  : "bg-gray-300"
              }`}
            />
            <div>
              <p
                className={`font-medium ${
                  status.current ? "text-primary" : ""
                }`}
              >
                {status.label}
              </p>
              <p className="text-sm text-gray-500">{status.description}</p>
              {status.date && (
                <p className="text-xs text-gray-400">
                  {formatDate(status.date)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Special timeline for cancelled orders
  const CancelledTimeLine = () => {
    return (
      <div className="mt-4 border-t pt-4">
        <div className="flex gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
          <div>
            <p className="font-medium">Order Placed</p>
            <p className="text-sm text-gray-500">
              {formatDate(createdAt || "")}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
          <div>
            <p className="font-medium text-red-500">Cancelled</p>
            <p className="text-sm text-gray-500">
              Your order has been cancelled
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(updatedAt || "")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Special timeline for refunded orders
  const RefundedTimeLine = () => {
    return (
      <div className="mt-4 border-t pt-4">
        <div className="flex gap-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
          <div>
            <p className="font-medium">Order Placed</p>
            <p className="text-sm text-gray-500">
              {formatDate(createdAt || "")}
            </p>
          </div>
        </div>
        {orderStatus === "Completed" && (
          <div className="flex gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
            <div>
              <p className="font-medium">Delivered</p>
              <p className="text-sm text-gray-500">
                Your order has been delivered
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(estimatedDeliveryDate || "")}
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 mt-1"></div>
          <div>
            <p className="font-medium text-amber-500">Refunded</p>
            <p className="text-sm text-gray-500">
              Your order has been refunded
            </p>
            <p className="text-xs text-gray-400">
              {formatDate(updatedAt || "")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Map order statuses to their respective timeline components
  const timeLine: Record<IOrderStatus, JSX.Element> = {
    Pending: renderTimeline(),
    Processing: renderTimeline(),
    Shipped: renderTimeline(),
    Cancelled: <CancelledTimeLine />,
    Refunded: <RefundedTimeLine />,
    Completed: renderTimeline(),
  };

  return (
    <div className="order-timeline">
      {timeLine[orderStatus] || renderTimeline()}
    </div>
  );
};
