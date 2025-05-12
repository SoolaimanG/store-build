"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

import ProductCardWithQuantityIncrementation from "./product-card-with-quantity-incrementation";
import { useStoreBuildState } from ".";
import { useToastError } from "@/hooks/use-toast-error";
import { toast } from "@/hooks/use-toast";
import {
  allProductsAreDigital,
  cn,
  errorMessageAndStatus,
  formatAmountToNaira,
  storeBuilder,
} from "@/lib/utils";

import type {
  IDeliveryIntegration,
  IDeliveryType,
  IOrder,
  IProduct,
} from "@/types";
import { nigeriaStates } from "@/constants";
import { OrderSuccess } from "./store-order-success";

const formSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  coupon: z.string().optional(),
  delivery: z.enum(["waybill", "pickup", "sendbox"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface IBuyNowPreviewProps {
  children: React.ReactNode;
  products: (IProduct & { quantity: number; color?: string; size?: string })[];
  disableQuantityIncrement?: boolean;
}

export const BuyNowPreview: React.FC<IBuyNowPreviewProps> = ({
  children,
  products: initialProducts,
  disableQuantityIncrement,
}) => {
  const {
    currentStore: store,
    setOrderPlaced,
    orderPlaced,
  } = useStoreBuildState();
  const [products, setProducts] = React.useState(initialProducts);
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");
  const [orderSuccess, setOrderSuccess] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "nigeria",
      notes: "",
      coupon: "",
      delivery: "waybill",
    },
  });

  const handleQuantityChange = React.useCallback(
    (
      id: string,
      quantity: number,
      options?: { color?: string; size?: string }
    ) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id &&
          product.color === options?.color &&
          product.size === options?.size
            ? { ...product, quantity }
            : product
        )
      );
    },
    []
  );

  const cartItems = React.useMemo(
    () =>
      products.flatMap((product) =>
        Array(product.quantity)
          .fill(null)
          .map(() => ({
            productId: product._id || "",
            color: product.color,
            size: product.size,
            quantity: product.quantity,
          }))
      ),
    [products]
  );

  const enableDeliveryCheck = !!(
    products.length &&
    form.watch("state") &&
    form.watch("fullName") &&
    form.watch("email") &&
    form.watch("phone") &&
    form.watch("delivery") === "sendbox"
  );

  const { isLoading, data, error } = useQuery({
    queryKey: ["calculate-product-price", cartItems, form.watch("coupon")],
    queryFn: () =>
      storeBuilder.calculateProductsPrice(cartItems, form.watch("coupon")),
    enabled: isOpen,
  });

  const {
    isLoading: deliveryIntegrationLoading,
    data: deliveryIntegrationData,
  } = useQuery({
    queryKey: ["integration", "sendbox"],
    queryFn: () => storeBuilder.getIntegration("sendbox"),
  });

  const deliverySettings = deliveryIntegrationData?.data.integration
    .settings as IDeliveryIntegration;

  const states = deliveryIntegrationData?.data.integration.isConnected
    ? deliverySettings.shippingRegions || []
    : nigeriaStates.map((_) => _.value) || [];

  const {
    isLoading: deliveryLoading,
    data: deliveryData,
    error: deliveryError,
  } = useQuery({
    queryKey: ["delivery-cost", form.watch("delivery"), form.watch("state")],
    queryFn: () =>
      storeBuilder.calculateDeliveryCost(store?._id!, {
        products,
        phoneNumber: form.watch("phone"),
        email: form.watch("email"),
        name: form.watch("fullName")!,
        couponCode: form.watch("coupon")!,
        address: {
          addressLine1: form.watch("addressLine1")!,
          city: form.watch("city")!,
          country: "Nigeria",
          state: form.watch("state")!,
          postalCode: "",
          addressLine2: "",
        },
      }),
    enabled: enableDeliveryCheck,
  });

  const deliveryPrice = deliveryData?.data.rates[1].fee || 0;

  const subtotal = React.useMemo(
    () => (data?.data.totalAmount || 0) + deliveryPrice,
    [data?.data.totalAmount]
  );

  const onSubmit = async (values: FormValues) => {
    try {
      const modifiedProducts = products.flatMap((product) =>
        Array(product.quantity)
          .fill(null)
          .map(() => ({
            ...product,
            productId: product._id || "",
            color: product.color,
            size: product.size,
            quantity: product.quantity,
          }))
      );

      const order: Partial<IOrder> = {
        ...values,
        customerDetails: {
          email: values.email,
          name: values.fullName || store?.storeName || "",
          phoneNumber: values.phone,
          shippingAddress: {
            addressLine1: values.addressLine1 || "",
            addressLine2: values.addressLine2 || "",
            city: values.city || "",
            state: values.state || "",
            postalCode: values.postalCode,
            country: values.country || "",
          },
        },
        products: modifiedProducts,
        deliveryType: (values.delivery as IDeliveryType) || "waybill",
        note: values.notes,
        storeId: store?._id!,
      };

      const {
        data: newOrder,
        message = "ORDER_CREATION_SUCCESS: Your order has been placed and is being processed.",
      } = await storeBuilder.createOrder(order, store?._id);
      setOrderPlaced(newOrder);
      setOrderSuccess(true);
      toast({
        title: "Order placed successfully",
        description: message,
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      setOrderSuccess(false);
      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  };

  useToastError(error || deliveryError);

  const OrderContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className={cn(
            "md:space-x-4 space-y-4 flex w-full",
            allProductsAreDigital(products)
              ? "flex-col"
              : "md:flex-row flex-col"
          )}
        >
          <div className="w-full">
            <ScrollArea
              className={cn(
                "space-y-4 p-3 pt-0 dark:bg-slate-800 bg-gray-100 mb-3 rounded-md",
                products.length > 1 && "h-[250px]"
              )}
            >
              {products.map((product) => (
                <ProductCardWithQuantityIncrementation
                  key={product._id}
                  color={product.color}
                  size={product.size}
                  quantity={product.quantity}
                  product={product}
                  onQuantityChange={handleQuantityChange}
                  disableQuantityIncrement={disableQuantityIncrement}
                />
              ))}
            </ScrollArea>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        placeholder="Enter your full name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        type="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        type="tel"
                        placeholder="Enter your phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        placeholder="Write a note..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className={cn("w-full")}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        placeholder="Enter your address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        placeholder="Enter your city"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={deliveryIntegrationLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states?.map((state) => (
                          <SelectItem
                            key={state}
                            value={state}
                            className="capitalize"
                          >
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                        placeholder="Enter your postal code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="delivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="waybill">Way Bill</SelectItem>
                        <SelectItem value="pick_up">Pick Up</SelectItem>
                        {deliveryIntegrationData?.data.integration
                          .isConnected && (
                          <SelectItem
                            disabled={deliveryIntegrationLoading}
                            value="sendbox"
                          >
                            Send Box
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <FormField
            control={form.control}
            name="coupon"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                    placeholder="APPLY COUPON"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className={cn(
              "space-y-2 pt-4 border-t flex flex-col",
              allProductsAreDigital(products) && "mr-7 w-full"
            )}
          >
            <div className="flex justify-between text-muted-foreground">
              <span>Discount ({data?.data.discountPercentage || 0}%)</span>
              <span>
                -{formatAmountToNaira(data?.data.discountedAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              {deliveryLoading ? (
                <span className="dark:text-slate-500 text-gray-400">
                  Calculating delivery...
                </span>
              ) : (
                <span>{formatAmountToNaira(deliveryPrice || 0)}</span>
              )}
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>

              {isLoading ? (
                <span className="dark:text-slate-500 text-gray-400">
                  Calculating...
                </span>
              ) : (
                <span className="dark:text-slate-300 text-gray-200">
                  {formatAmountToNaira(subtotal)}
                </span>
              )}
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              {isLoading ? (
                <span className="dark:text-slate-500 text-gray-400">
                  Calculating...
                </span>
              ) : (
                <span>
                  {formatAmountToNaira(
                    (data?.data.totalAmount! || 0) + deliveryPrice
                  )}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex flex-col gap-2 mt-2",
              allProductsAreDigital(products) && "mr-7 w-full"
            )}
          >
            <Button
              type="submit"
              style={{ background: store?.customizations?.theme?.primary }}
              className="w-full"
              size="lg"
              disabled={form.formState.isSubmitting || form.formState.isLoading}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Order Details</DrawerTitle>
          </DrawerHeader>
          <ScrollArea
            className={cn(!orderSuccess ? "px-4 pb-4 h-[80vh]" : "h-fit py-4")}
          >
            {orderSuccess ? (
              <OrderSuccess
                {...orderPlaced!}
                onClose={() => setIsOpen(false)}
              />
            ) : (
              OrderContent
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-keyshortcuts="off"
        className={cn(
          "max-w-5xl max-h-[90vh] overflow-y-auto",
          allProductsAreDigital(products) && "max-w-xl",
          orderPlaced && "md:max-w-lg"
        )}
      >
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        {orderSuccess ? (
          <OrderSuccess onClose={() => setIsOpen(false)} {...orderPlaced!} />
        ) : (
          OrderContent
        )}
      </DialogContent>
    </Dialog>
  );
};
