"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import ProductCardWithQuantityIncrementation from "./product-card-with-quantity-incrementation";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useStoreBuildState } from ".";
import { IProduct } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { cn, formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";

type IBuyNowPreviewProps = {
  children: React.ReactNode;
  products: (IProduct & { quantity: number; color?: string; size?: string })[];
};

export const BuyNowPreview: React.FC<IBuyNowPreviewProps> = ({
  children,
  products: _p,
}) => {
  const { currentStore: store } = useStoreBuildState();
  const [products, setProducts] = React.useState(_p);

  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");

  const handleQuantityChange = (id: string, quantity: number) => {
    const products = _p?.map((product) =>
      product._id === id ? { ...product, quantity } : product
    );
    setProducts(products);
  };

  const deliveryPrice = 3.99;

  const cartItems = products.flatMap((product) =>
    Array(product.quantity)
      .fill(null)
      .map(() => ({
        productId: product._id || "",
        color: product.color,
        size: product.size,
      }))
  );

  const { isLoading, data, error } = useQuery({
    queryKey: ["calculate-product-price", products],
    queryFn: () => storeBuilder.calculateProductsPrice(cartItems),
    enabled: isOpen,
  });

  const subtotal = data?.data.totalAmount || 0 + deliveryPrice;

  useToastError(error);

  const OrderContent = () => (
    <div className="md:space-x-4 space-y-4 flex md:flex-row flex-col w-full">
      <div className="w-full">
        <ScrollArea
          className={cn("space-y-4", products.length > 1 && "h-[300px]")}
        >
          {products.map((product) => (
            <ProductCardWithQuantityIncrementation
              key={product._id}
              color={product.color}
              size={product.size}
              quantity={product.quantity}
              product={product}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </ScrollArea>

        <div className="space-y-4">
          <div className="flex flex-col space-y-3">
            <Label htmlFor="fullName">Full Name (Optional)</Label>
            <Input
              className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              id="fullName"
              placeholder="Enter your full name"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <Label htmlFor="email">Email Address</Label>
            <Input
              className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex flex-col space-y-3">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Delivery</Label>
            <Select defaultValue="regular">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">
                  Regular (€{deliveryPrice.toFixed(2)})
                </SelectItem>
                <SelectItem value="express">Express (€9.99)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-3">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              placeholder="Enter your delivery address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Write a note..." />
          </div>

          <div className="flex gap-2">
            <Input
              className="ring-0 focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
              placeholder="APPLY COUPON"
            />
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatAmountToNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Discount ({data?.data.discountPercentage || 0}%)</span>
              <span>
                -{formatAmountToNaira(data?.data.discountedAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>€{deliveryPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              {isLoading ? (
                <span className="dark:text-slate-500 text-gray-400">
                  Calculating...
                </span>
              ) : (
                <span>{formatAmountToNaira(data?.data.totalAmount! || 0)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            style={{ background: store?.customizations?.theme.primary }}
            className="w-full"
            size="lg"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Order Details</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="px-4 pb-4 h-[75vh]">
            <OrderContent />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <OrderContent />
      </DialogContent>
    </Dialog>
  );
};
