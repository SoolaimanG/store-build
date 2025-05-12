"use client";

import {
  ArrowLeft,
  Pencil,
  ChevronDown,
  FileText,
  Receipt,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router-dom";
import { type IOrder, type IOrderStatus, PATHS } from "@/types";
import {
  allProductsAreDigital,
  errorMessageAndStatus,
  formatAmountToNaira,
  getInitials,
  getOrderProductCount,
  storeBuilder,
} from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Img } from "react-image";
import { Fragment, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { SendEmailButton } from "@/components/send-email";
import { EditModal } from "@/components/edit-modal";
import { OrderDetailsSkeleton } from "@/components/loaders/order-details-loader";
import { useToastError } from "@/hooks/use-toast-error";

import { toast } from "@/hooks/use-toast";
import { useStoreBuildState } from "@/store";
import { OrderTimeLine } from "@/components/order-timeline";
import queryString from "query-string";
import { ConfirmationModal } from "@/components/confirmation-modal";

const orderStatuses: IOrderStatus[] = [
  "Cancelled",
  "Completed",
  "Pending",
  "Refunded",
  "Shipped",
  "Processing",
];

const DashboardOrderDetails = () => {
  const { id: orderId = "" } = useParams();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isPending, startTransition] = useState(false);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useStoreBuildState();
  const [orderStatus, setOrderStatus] = useState<IOrderStatus>();
  const { phoneNumber = "" } = queryString.parse(location.search) as {
    phoneNumber?: string;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      storeBuilder.getOrder<{ order: IOrder; deliveryDetails: null }>(
        orderId,
        phoneNumber
      ),
    enabled: Boolean(orderId && user),
  });

  const { data: __data, error: integrationError } = useQuery({
    queryKey: ["integration"],
    queryFn: () => storeBuilder.getIntegration("sendbox"),
  });

  const { data: _data } = data || {};

  const changeOrderStatus = async (orderStatus: IOrderStatus) => {
    const { _id = "" } = _data?.order as IOrder;

    try {
      startTransition(true);
      const res = await storeBuilder.editOrder(_id || "", {
        orderStatus,
      });

      queryClient.invalidateQueries({ queryKey: ["order", _id] });

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
    } finally {
      startTransition(false);
    }
  };

  const handleGenerateReceipt = async () => {
    const { _id = "" } = _data?.order as IOrder;

    try {
      setIsGeneratingReceipt(true);
      // TODO: Implement receipt generation logic
      // This would typically call an API endpoint that generates a PDF receipt

      toast({
        title: "Receipt Generated",
        description: "The receipt has been generated successfully.",
      });

      // Simulate download or open in new tab
      setTimeout(() => {
        window.open(`/api/receipts/${_id}`, "_blank");
      }, 1000);
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReceipt(false);
    }
  };

  useToastError(error || integrationError);

  if (isLoading || !user) {
    return <OrderDetailsSkeleton />;
  }

  return (
    <Fragment>
      <div className="container mx-auto p-3">
        <div className="mb-8 w-full">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 w-fit">
              <Link to={PATHS.STORE_ORDERS}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="md:text-xl text-lg font-semibold line-clamp-1">
                    Order #
                    {_data?.order?._id?.slice(
                      0,
                      !isDesktop ? 13 : _data.order._id.length
                    )}
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(
                    _data?.order?.createdAt || Date.now(),
                    "d MMM yyyy h:mm aaa"
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  defaultValue={_data?.order.orderStatus}
                  asChild
                >
                  <Button size="sm" variant="outline" className="gap-1">
                    {_data?.order.orderStatus}{" "}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="flex flex-col">
                  {orderStatuses.map((status) => (
                    <DropdownMenuItem
                      key={status}
                      disabled={isPending}
                      onClick={() => setOrderStatus(status)}
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex md:flex-row flex-col items-start md:items-center justify-between">
                <h2 className="text-lg font-semibold">Details</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={handleGenerateReceipt}
                    disabled={isGeneratingReceipt}
                  >
                    <Receipt className="h-4 w-4 mr-1" />
                    {isGeneratingReceipt ? "Generating..." : "Generate Receipt"}
                  </Button>
                  <Link
                    to={`/invoices/${_data?.order._id}`}
                    target="_blank"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Invoice
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {_data?.order.products.map((product) => (
                  <div key={product._id} className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-lg border overflow-hidden">
                      <Img
                        src={product.media[0].url}
                        alt={product.media[0].altText}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {product.productName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product._id?.slice(
                              0,
                              !isDesktop ? 13 : product._id.length
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            x
                            {getOrderProductCount(
                              _data.order.products,
                              product._id || ""
                            )}
                          </div>
                          <div className="font-semibold">
                            {formatAmountToNaira(product.price.default)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator className="my-6" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TX-Ref</span>
                    <span className="font-medium">
                      {_data?.order?.paymentDetails.tx_ref || _data?.order._id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatAmountToNaira(_data?.order?.totalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-red-500">
                      {formatAmountToNaira(
                        _data?.order?.shippingDetails?.shippingCost || 0
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium">
                      {formatAmountToNaira(_data?.order.amountPaid || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Amount left to pay
                    </span>
                    <span className="font-medium">
                      {formatAmountToNaira(_data?.order.amountLeftToPay || 0)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {formatAmountToNaira(_data?.order.totalAmount || 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* @ts-ignore */}
            {__data?.data?.integration.isConnected && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Delivery Tracks</h2>
                </CardHeader>
                <CardContent>
                  <OrderTimeLine
                    createdAt={_data?.order.createdAt!}
                    estimatedDeliveryDate={
                      _data?.order?.shippingDetails?.estimatedDeliveryDate!
                    }
                    updatedAt={_data?.order.updatedAt!}
                    orderStatus={_data?.order.orderStatus!}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">Customer info</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setEditingSection("customer")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {getInitials(_data?.order.customerDetails.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {_data?.order.customerDetails.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {_data?.order.customerDetails.email}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  IP address: 192.158.1.38
                </div>
                <SendEmailButton
                  orderId={_data?.order._id || ""}
                  isDesktop={isDesktop}
                  customerEmail={_data?.order.customerDetails.email}
                  phoneNumber={_data?.order.customerDetails.phoneNumber!}
                />
              </CardContent>
            </Card>

            {!allProductsAreDigital(_data?.order.products) && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-semibold">Delivery</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setEditingSection("delivery")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Courier</div>
                      <div className="text-sm text-muted-foreground">
                        {_data?.order.shippingDetails?.carrier ||
                          "Not Applicable"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Delivery Type</div>
                      <div className="text-sm text-muted-foreground">
                        {_data?.order.deliveryType || "Not Applicable"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tracking No.</div>
                    <div className="text-sm text-muted-foreground">
                      <a href="#" className="hover:underline">
                        {_data?.order.shippingDetails?.trackingNumber ||
                          "Not Applicable"}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">Shipping</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setEditingSection("shipping")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 h-full">
                <div>
                  <div className="text-sm font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">
                    {_data?.order.customerDetails.shippingAddress.addressLine1}
                    <br />
                    {_data?.order.customerDetails.shippingAddress.addressLine2}
                  </div>
                </div>
                {_data?.order.customerDetails.shippingAddress.postalCode && (
                  <div>
                    <div className="text-sm font-medium">Postal Code</div>
                    <div className="text-sm text-muted-foreground">
                      {_data?.order.customerDetails.shippingAddress.postalCode}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium">Phone Number</div>
                  <div className="text-sm text-muted-foreground">
                    {_data?.order.customerDetails.phoneNumber}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <EditModal
          isOpen={editingSection !== null}
          onClose={() => setEditingSection(null)}
          section={editingSection}
          isDesktop={isDesktop}
          orderData={_data?.order}
        />

        <ConfirmationModal
          key={orderStatus}
          onConfirm={() => changeOrderStatus(orderStatus!)}
          isOpen={Boolean(orderStatus)}
          onClose={() => setOrderStatus(undefined)}
          message={`Clicking on "Update status" would update the status of this order to ${orderStatus?.toUpperCase()}, and ${_data?.order.customerDetails.name?.toUpperCase()} will be notified via email`}
          title="Update Order Status"
          btnText="Confirm"
          btnVariant="default"
        />
      </div>
    </Fragment>
  );
};

export default DashboardOrderDetails;
