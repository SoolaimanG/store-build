"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { apiResponse, IOrder, IOrderStatus, IPaymentStatus } from "@/types";
import { orderForm, orderSchema } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { useStoreBuildState } from "@/store";
import { ProductSelector } from "./product-selector";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type FormData = z.infer<typeof orderSchema>;

export default function CreateOrderForm({
  isEditingMode = false,
  id,
}: {
  isEditingMode?: boolean;
  id: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedProducts, onProductSelect, removeProduct, user } =
    useStoreBuildState();

  const { data: orderData, error: orderError } = useQuery({
    queryKey: ["order", id],
    queryFn: () => storeBuilder.getOrder(id),
    enabled: Boolean(isEditingMode && id),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm<FormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      storeId: id,
      orderStatus: "Pending",
      paymentStatus: "pending",
      amountPaid: 0,
      totalAmount: 0,
      shippingCost: 0,
    },
  });

  const { data, error } = useQuery({
    queryKey: ["states"],
    queryFn: () => storeBuilder.getIntegration("kwik"),
  });

  const { data: i } = data || {};
  const { data: _data } = orderData || {};

  useToastError(error || orderError);

  useEffect(() => {
    if (_data) {
      const { order } = _data;

      form.setValue("amountPaid", order.amountPaid);
      form.setValue("customerEmail", order.customerDetails.email);
      form.setValue("customerName", order.customerDetails.name);
      form.setValue("customerPhone", order.customerDetails.phoneNumber);
      form.setValue(
        "estimatedDeliveryDate",
        new Date(order.shippingDetails.estimatedDeliveryDate)
      );
      form.setValue("note", order.note);
      form.setValue("orderStatus", order.orderStatus);
      form.setValue("paymentMethod", order.paymentMethod);
      form.setValue("paymentStatus", order.paymentDetails.paymentStatus);
      form.setValue("products", order.products);
      form.setValue("shippingAddress", order.customerDetails.shippingAddress);
      form.setValue("shippingCost", order.shippingDetails.shippingCost);
      form.setValue("shippingMethod", order.shippingDetails.shippingMethod);
      form.setValue("totalAmount", order.totalAmount);

      onProductSelect(order.products);
    }
  }, [orderData]);

  useEffect(() => {
    const total = selectedProducts.reduce(
      (sum, product) => sum + product.price.default,
      0
    );
    form.setValue("totalAmount", total);
  }, [selectedProducts, form]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = form.getValues();
      const orderData: IOrder = {
        storeId: user?.storeId || "",
        orderStatus: data.orderStatus as IOrderStatus,
        paymentDetails: {
          paymentStatus: data.paymentStatus as IPaymentStatus,
          paymentMethod: data.paymentMethod as "Credit Card",
          transactionId: "TXN-" + Math.random().toString(36).substr(2, 9),
          paymentDate: new Date().toISOString(),
        },
        customerDetails: {
          email: data.customerEmail,
          phoneNumber: data.customerPhone,
          name: data.customerName,
          shippingAddress: {
            ...data.shippingAddress,
            addressLine2: data.shippingAddress.addressLine2 || "",
          },
        },
        paymentMethod: data.paymentMethod || "",
        amountPaid: data.amountPaid || 0,
        amountLeftToPay: 0,
        totalAmount: data.totalAmount || 0,
        shippingDetails: {
          shippingMethod: data.shippingMethod,
          shippingCost: data.shippingCost || 0,
          estimatedDeliveryDate: new Date(
            data?.estimatedDeliveryDate || ""
          ).toISOString(),
          trackingNumber: "TRK-" + Math.random().toString(36).substr(2, 9),
          carrier: "DHL",
        },
        note: data.note,
        products: selectedProducts,
      };

      let result: apiResponse<IOrder>;

      if (isEditingMode) {
        result = await storeBuilder.editOrder(id, orderData, false);
      } else {
        result = await storeBuilder.createOrder(orderData);
      }

      toast({
        title: !isEditingMode ? "Order Created" : "Order Editted",
        description: result.message,
      });

      form.reset();
      !isEditingMode && onProductSelect([]);
    } catch (error) {
      console.error("Error creating order:", error);
      const {
        status: title = "SERVER",
        message: description = "Something went wrong",
      } = errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderStatus = isEditingMode
    ? ["Pending", "Completed", "Cancelled", "Refunded"]
    : undefined;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-min">
        <Card className="h-full bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 lg:col-span-3">
          <CardHeader className="bg-muted/50 rounded-t-lg">
            <CardTitle className="text-lg font-semibold">
              Selected Products
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-5">
            {selectedProducts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <Package2 className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">
                  No products selected
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Use the button below to add products to your order
                </p>
                <ProductSelector
                  products={selectedProducts}
                  onSelect={onProductSelect}
                >
                  <Button type="button" variant="ringHover" size="sm">
                    Select Products
                  </Button>
                </ProductSelector>
              </div>
            ) : (
              <div>
                <ul className="space-y-2">
                  <AnimatePresence>
                    {selectedProducts?.map((product) => (
                      <motion.li
                        key={product._id}
                        initial={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="relative overflow-hidden py-2"
                      >
                        <motion.div
                          className="flex items-center justify-between border-b pb-2 pr-10"
                          whileHover={{ x: -40 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="rounded-md">
                              <AvatarImage
                                src={product.media[0].url}
                                alt={product.media[0].altText}
                                className="rounded-md"
                              />
                              <AvatarFallback className="rounded-md">
                                {getInitials(product.productName)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{product.productName}</span>
                          </div>
                          <span>
                            {formatAmountToNaira(product.price.default)}
                          </span>
                          <motion.div
                            className="absolute right-0 -mr-10 top-0 bottom-0 flex items-center"
                            animate={{ opacity: 1 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              type="button"
                              onClick={() => removeProduct(product._id || "")}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete product</span>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">
                    {formatAmountToNaira(
                      selectedProducts?.reduce(
                        (total, product) => total + product.price.default,
                        0
                      )
                    )}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* @ts-ignore */}
        {orderForm(i?.integration?.settings.shippingRegions, orderStatus).map(
          (section, sectionIndex) => (
            <motion.div
              key={section.title}
              className={`${section.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
                <CardHeader className="bg-muted/50 rounded-t-lg">
                  <CardTitle className="text-lg font-semibold">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 p-6">
                  {section.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium text-muted-foreground"
                      >
                        {field.label}
                      </label>
                      <Controller
                        name={field.name as any}
                        control={control}
                        render={({ field: { onChange, value } }) =>
                          field.type === "select" ? (
                            <Select onValueChange={onChange} value={value}>
                              <SelectTrigger className="bg-background/50 backdrop-blur-sm capitalize">
                                <SelectValue
                                  placeholder={`Select ${field.label}`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === "textarea" ? (
                            <Textarea
                              {...field}
                              id={field.name}
                              onChange={onChange}
                              value={value}
                              className="bg-background/50 backdrop-blur-sm resize-none h-32"
                            />
                          ) : (
                            <Input
                              {...field}
                              id={field.name}
                              type={field.type}
                              onChange={onChange}
                              value={value}
                              className="bg-background/50 backdrop-blur-sm"
                            />
                          )
                        }
                      />
                      {errors[field.name as keyof typeof errors] && (
                        <p className="text-sm text-destructive">
                          {
                            errors[field.name as keyof typeof errors]
                              ?.message as string
                          }
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: orderForm().length * 0.1 }}
      >
        <Button
          type="submit"
          disabled={isSubmitting || selectedProducts.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Order...
            </>
          ) : (
            "Create Order"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
