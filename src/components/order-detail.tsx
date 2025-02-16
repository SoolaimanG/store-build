import { Section } from "./section";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  formatDate,
  storeBuilder,
} from "@/lib/utils";
import { Link } from "react-router-dom";
import { useStoreBuildState } from "@/store";
import {
  ArrowRight,
  Ban,
  Calendar,
  CheckIcon,
  CreditCard,
  Crosshair,
  DollarSign,
  HelpCircle,
  HelpingHand,
  Info,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCcw,
  ScrollTextIcon,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ICustomerAddress, IOrder, PATHS, VerifyChargeResponse } from "@/types";
import { FC, ReactNode, useState } from "react";
import OrderProductView from "./order-product-view";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./text";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { AddressForm } from "./manage-store-address";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { menu } from "@/constants";

const OrderDetails: FC<
  IOrder & { transactionDetails?: VerifyChargeResponse }
> = ({ shippingDetails, transactionDetails, ...order }) => {
  const [isHovered, setIsHovered] = useState(0);
  const { currentStore: store } = useStoreBuildState();
  const [isPending, startTransition] = useState(false);

  const {
    isLoading: isCouponLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["coupon", order.coupon],
    queryFn: () => storeBuilder.getCoupon(order.coupon!),
    enabled: Boolean(order.coupon),
  });

  const { data: coupon } = data || {};

  const completeOrderPayment = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.completeOrderPayment(
        order._id!,
        store?._id
      );

      toast({
        title: "SUCCESS",
        description: "A new charge has been created for this order.",
      });

      window.open(res.data.paymentDetails.paymentLink, "_blank");
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const requestCancelOrder = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.requestCancelOrder(
        order._id!,
        store?._id!
      );

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const requestConfirmationOrder = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.requestConfirmationOrder(
        order._id!,
        store?._id!
      );

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  useToastError(error);

  return (
    <Section className="p-2 md:p-4">
      <div className="container mx-auto md:p-0 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            to={`/store/${store?.storeCode}`}
            className="hover:text-foreground"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to={menu(store?.storeCode!)[3].path}
            className="hover:text-foreground"
          >
            Orders
          </Link>
          <span>/</span>
          <span className="text-foreground">{order?._id}</span>
        </nav>

        {/* Order Header */}
        <div className="flex md:justify-between md:flex-row flex-col items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              Order ID: {order?._id}
            </h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>
                Order date:{" "}
                {formatDate(order?.createdAt || new Date().toISOString())}
              </span>
              <div className="flex items-center gap-2 text-green-600">
                <span>
                  Estimated delivery:{" "}
                  {formatDate(
                    shippingDetails?.estimatedDeliveryDate ||
                      new Date().toISOString()
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 md:mt-0 mt-3">
            <Button
              style={{
                borderColor: store?.customizations?.theme.primary,
                background:
                  isHovered === 1 ? store?.customizations?.theme.primary : "",
              }}
              size="sm"
              variant="outline"
              className="gap-2"
              onMouseEnter={() => {
                setIsHovered(1);
              }}
              onMouseLeave={() => {
                setIsHovered(0);
              }}
            >
              <ScrollTextIcon size={16} />
              Receipt
            </Button>
            {Boolean(shippingDetails?.trackingNumber) &&
              shippingDetails.carrier === "SENDBOX" && (
                <Button
                  style={{ background: store?.customizations?.theme.primary }}
                  size="sm"
                  asChild
                >
                  <Link
                    to={"/" + shippingDetails.trackingNumber!}
                    target="__blank"
                    className="gap-2 flex"
                  >
                    <Crosshair size={16} />
                    Track order
                  </Link>
                </Button>
              )}
          </div>
        </div>

        {/* Order Products Views */}
        <ScrollArea className="mb-4 max-h-[200px]">
          {order?.products?.map((product) => (
            <OrderProductView
              key={product._id}
              product={product}
              products={order.products}
            />
          ))}
        </ScrollArea>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Payment */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {transactionDetails?.authorization.brand.toUpperCase()}
                    {"****".repeat(3)}
                    {transactionDetails?.authorization.last4}
                  </span>
                  <Badge
                    className="rounded-md"
                    variant={
                      transactionDetails?.status === "success"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {transactionDetails?.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <Text>
                    {formatAmountToNaira(transactionDetails?.amount || 0 / 100)}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Text>{transactionDetails?.customer.email}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Text>
                    {new Date(
                      transactionDetails?.created_at || new Date().toISOString()
                    ).toLocaleString()}
                  </Text>
                </div>
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-2">Additional Information</h3>
                  <div className="flex items-center gap-1">
                    <strong className="font-light">Reference:</strong>{" "}
                    <Text className=" capitalize font-bold">
                      {" "}
                      {transactionDetails?.reference}
                    </Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <strong className="font-light">Channel:</strong>{" "}
                    <Text className=" capitalize font-bold">
                      {transactionDetails?.channel}
                    </Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <strong className="font-light">Bank:</strong>{" "}
                    <Text className=" capitalize font-bold">
                      {transactionDetails?.authorization.bank}
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Delivery Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    Shipping Address
                  </div>
                  <address className="not-italic">
                    <p>{order?.customerDetails?.shippingAddress.country}</p>
                    {order?.customerDetails?.shippingAddress.state && (
                      <p>{order?.customerDetails?.shippingAddress.city}</p>
                    )}
                    <Text>
                      {order?.customerDetails?.shippingAddress.city ||
                        "Not Applicable"}
                      ,{" "}
                      {order?.customerDetails?.shippingAddress.state ||
                        "Not Applicable"}{" "}
                      {order?.customerDetails?.shippingAddress.postalCode}
                    </Text>
                    <p>{order?.customerDetails?.shippingAddress.country}</p>
                  </address>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      Phone Number
                    </div>
                    <p>{order?.customerDetails?.phoneNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </div>
                    <p className="truncate">{order?.customerDetails?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Delivery Type</div>
                  <div className=" capitalize">{order.deliveryType}</div>
                </div>
                {order.note && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Note</div>
                    <Text>{order.note}</Text>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Order Status</div>
                  <Badge
                    className="w-fit rounded-md"
                    style={{ background: store?.customizations?.theme.primary }}
                  >
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Payment Method</div>
                  <div>{order.paymentMethod}</div>
                </div>
                {order.coupon && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Coupon</div>
                    {isCouponLoading ? (
                      <Skeleton className="h-4 w-[100px]" />
                    ) : coupon ? (
                      <div>
                        <Badge variant="secondary">{coupon.couponCode}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {coupon.type === "percentageCoupon"
                            ? `${coupon.discountValue}% off`
                            : `${formatAmountToNaira(
                                coupon.discountValue
                              )} off`}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Not found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col space-y-7">
            <Card className="">
              <CardHeader className="pb-5 flex items-center justify-between flex-row">
                <h2 className="text-lg font-medium">Order Summary</h2>
                {!order.amountLeftToPay && (
                  <Button
                    onClick={completeOrderPayment}
                    className="gap-2 items-center"
                    style={{ background: store?.customizations?.theme.primary }}
                    size="sm"
                  >
                    {isPending ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <CheckIcon size={17} />
                    )}
                    Complete Payment
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span>{formatAmountToNaira(order?.amountPaid || 0)}</span>
                </div>
                {order?.coupon && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Discount (20%)
                    </span>
                    <span className="text-muted-foreground">
                      - {formatAmountToNaira(order?.totalAmount * 0.2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Delivery</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>
                    {formatAmountToNaira(shippingDetails?.shippingCost || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Tax</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>
                    + {formatAmountToNaira(order?.totalAmount || 0 * 0.04)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatAmountToNaira(order?.totalAmount || 0)}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <h2 className="text-lg font-medium">Need help?</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={requestConfirmationOrder}
                  disabled={isPending}
                >
                  <HelpingHand className="mr-2 h-4 w-4" />
                  Request Confirmation
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={PATHS.HOME}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Order Issues
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
                <ChangeDeliveryAddress
                  orderId={order._id}
                  address={order.customerDetails.shippingAddress}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Delivery Info
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </ChangeDeliveryAddress>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/help/returns">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Returns
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={requestCancelOrder}
                  disabled={isPending}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Request Order Cancel
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
};

const ChangeDeliveryAddress: FC<{
  children: ReactNode;
  address: ICustomerAddress;
  orderId?: string;
}> = ({ children, address, orderId = "" }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");
  const { currentStore: store } = useStoreBuildState();
  const queryClient = useQueryClient();

  const editAddress = async (_address: ICustomerAddress) => {
    try {
      const res = await storeBuilder.editDeliveryAddress(
        orderId,
        store?._id!,
        _address
      );
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="p-3">
          <ScrollArea className="h-[600px]">
            <AddressForm
              address={address}
              useStoreTheme
              onSave={editAddress}
              onCancel={() => setOpen(false)}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <ScrollArea className="h-[600px]">
          <AddressForm
            address={address}
            useStoreTheme
            onSave={editAddress}
            onCancel={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
