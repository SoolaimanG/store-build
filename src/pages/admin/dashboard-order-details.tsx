import { Circle } from "lucide-react";
import { ArrowLeft, Pencil, ChevronDown } from "lucide-react";
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
import { IOrder, IOrderStatus, PATHS } from "@/types";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  getInitials,
  getOrderProductCount,
  storeBuilder,
} from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Img } from "react-image";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { SendEmailButton } from "@/components/send-email";
import { EditModal } from "@/components/edit-modal";
import { OrderDetailsSkeleton } from "@/components/loaders/order-details-loader";
import { useToastError } from "@/hooks/use-toast-error";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreatePickupForm } from "@/components/create-pickup-form";
import { Text } from "@/components/text";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";

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
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => storeBuilder.getOrder(orderId),
  });

  const { data: __data, error: integrationError } = useQuery({
    queryKey: ["integration"],
    queryFn: () => storeBuilder.getIntegration("kwik"),
  });

  const { data: _data } = data || {};

  const changeOrderStatus = async (orderStatus: IOrderStatus) => {
    const { _id = "" } = _data?.order as IOrder;

    try {
      startTransition(true);
      // TODO: Implement update logic
      const res = await storeBuilder.editOrder(
        _id || "",
        {
          orderStatus,
        },
        true
      );

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

  useToastError(error || integrationError);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flew-wrap">
          <div className="flex items-center gap-2">
            <Link to={PATHS.STORE_ORDERS}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold line-clamp-1">
                  Order #{_data?.order?._id}
                </h1>
                {/* <Badge variant="secondary">Refunded</Badge> */}
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
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                  {_data?.order.orderStatus} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {orderStatuses.map((status) => (
                  <DropdownMenuItem
                    disabled={isPending}
                    key={status}
                    onClick={() => changeOrderStatus(status)}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Details</h2>
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
                        <h3 className="font-semibold">{product.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product._id}
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
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatAmountToNaira(_data?.order?.totalAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-red-500">-$10</span>
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
          {__data?.data.integration.isConnected && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Delivery Tracks</h2>
              </CardHeader>
              <CardContent>
                <OrderTimeline deliveryDetails={_data?.deliveryDetails} />
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
              />
            </CardContent>
          </Card>

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
                  <div className="text-sm font-medium">Ship by</div>
                  <div className="text-sm text-muted-foreground">DHL</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Speedy</div>
                  <div className="text-sm text-muted-foreground">Standard</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Tracking No.</div>
                <div className="text-sm text-muted-foreground">
                  <a href="#" className="hover:underline">
                    SPX037739199373
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
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
            <CardContent className="grid gap-4">
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
    </div>
  );
};

export default DashboardOrderDetails;

interface DeliveryDetails {
  // Add the necessary properties here
}

interface OrderTimelineProps {
  deliveryDetails: DeliveryDetails | null;
}

export function OrderTimeline({ deliveryDetails }: OrderTimelineProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width:767px)");

  const ModalComponent = isDesktop ? Dialog : Drawer;
  const ContentComponent = isDesktop ? DialogContent : DrawerContent;
  const HeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  const TitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  const TriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;

  const timelineData = [
    {
      status: "Delivery successful",
      date: "28 Nov 2024 1:55 am",
      completed: true,
    },
    {
      status: "Transporting to [2]",
      date: "27 Nov 2024 12:55 am",
      completed: false,
    },
    {
      status: "Transporting to [1]",
      date: "25 Nov 2024 11:55 pm",
      completed: false,
    },
    {
      status: "The shipping unit has picked up the goods",
      date: "24 Nov 2024 10:55 pm",
      completed: false,
    },
    {
      status: "Order has been created",
      date: "23 Nov 2024 9:55 pm",
      completed: false,
    },
  ];

  if (!deliveryDetails)
    return (
      <div className="mb-4 flex flex-col gap-3 w-full space-y-4">
        <Text className="text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero illo
          quia dolores ut expedita est commodi perspiciatis atque tempora alias.
        </Text>
        <ModalComponent open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <TriggerComponent asChild>
            <Button variant="outline">Create Pickup</Button>
          </TriggerComponent>
          <ContentComponent>
            <HeaderComponent>
              <TitleComponent>Create Pickup</TitleComponent>
            </HeaderComponent>
            <CreatePickupForm onSubmit={() => setIsDialogOpen(false)} />
          </ContentComponent>
        </ModalComponent>
      </div>
    );

  return (
    <div className="relative">
      <div className="absolute left-3 top-3 h-[calc(100%-24px)] w-px bg-border" />
      <div className="space-y-8">
        {timelineData.map((item, index) => (
          <div key={index} className="md:flex md:space-x-10">
            <div className="flex gap-4">
              <div
                className={`h-6 w-6 rounded-full border-2 z-20 ${
                  item.completed
                    ? "border-primary bg-primary text-white"
                    : "border-muted bg-background"
                } flex items-center justify-center`}
              >
                <Circle
                  className={`h-2 w-2 ${item.completed ? "fill-current" : ""}`}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium leading-none">{item.status}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <div className="flex-1">
              {index === 0 && (
                <>
                  <div className="space-y-1 ml-10 md:ml-0 mt-3 md:mt-0">
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Order time</span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">
                        Payment time
                      </span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">
                        Delivery time for the carrier
                      </span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">
                        Completion time
                      </span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
