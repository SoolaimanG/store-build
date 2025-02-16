import { Section } from "@/components/section";
import { storeBuilder } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useStoreBuildState } from ".";
import { IOrder, VerifyChargeResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import OrderDetails from "@/components/order-detail";

const StoreOrderDetail = () => {
  const { orderId = "" } = useParams();
  const { currentStore: store } = useStoreBuildState();

  const { isLoading, data, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      storeBuilder.getOrder<{
        order: IOrder;
        deliveryDetails: null;
        transactionDetails?: VerifyChargeResponse;
      }>(orderId, store?._id),
    enabled: Boolean(store?._id),
  });

  const { data: orderData } = data || {};
  const { order } = orderData || {};

  if (error) {
    return (
      <Section>
        <div className="mt-24 text-center text-red-600">
          Error loading order: {(error as Error).message}
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24">
      {isLoading || !order ? (
        <OrderSkeleton />
      ) : (
        <OrderDetails
          {...order!}
          transactionDetails={orderData?.transactionDetails}
        />
      )}
    </Section>
  );
};

const OrderSkeleton = () => (
  <div className="mt-24 space-y-4">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-1/2" />
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-6 w-full" />
      ))}
    </div>
  </div>
);

export default StoreOrderDetail;
