"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatAmountToNaira } from "@/lib/utils";
import { Img } from "react-image";
import { ICartItem, IProduct } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoreBuildState } from ".";
import { useLocalStorage } from "@uidotdev/usehooks";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { menu } from "@/constants";

interface QuickProductViewProps {
  children: React.ReactNode;
  product: IProduct;
}

export function QuickProductView({
  children,
  product: {
    media = [],
    productName = "",
    price,
    discount = 0,
    availableColors = [],
    availableSizes = [],
    _id = "",
    ...p
  },
}: QuickProductViewProps) {
  const { currentStore } = useStoreBuildState();
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState(availableSizes[0]);
  const [color, setColor] = React.useState(availableColors[0].name);
  const [isMobile, setIsMobile] = React.useState(false);
  const { currentStore: store } = useStoreBuildState();

  const [cart, setCart] = useLocalStorage<Record<string, ICartItem[]>>(
    "storeCarts",
    {}
  );

  const currentCart = cart[store?.storeCode!] || [];

  const removeItemFromCart = () => {
    setCart({
      ...cart,
      [store?.storeCode!]: currentCart.filter(
        (cart) =>
          cart.productId !== _id || cart.color !== color || cart.size !== size
      ),
    });
  };

  const addItemToCart = () => {
    // Check if item of the same color and size exist
    const itemExisted = currentCart.find(
      (cart) =>
        cart.productId === _id! && cart.color === color && cart.size === size
    );

    const payload: ICartItem = {
      productId: _id!,
      color: color,
      quantity: 1,
      size: size,
    };

    if (!itemExisted) {
      setCart({ ...cart, [store?.storeCode!]: [...currentCart, payload] });
      const t = toast({
        title: "ITEM ADDED",
        description: `${productName} has been added to your cart`,
        action: (
          <Button
            onClick={() => {
              removeItemFromCart();
              t.dismiss();
            }}
            size="sm"
            variant="secondary"
          >
            Undo
          </Button>
        ),
      });
    } else {
      // Increment the quantity by one
      const newPayload = currentCart.map((cart) =>
        cart.productId === itemExisted.productId &&
        cart.color === itemExisted.color &&
        cart.size === itemExisted.size
          ? { ...cart, quantity: cart.quantity + 1 }
          : cart
      );

      setCart({ ...cart, [store?.storeCode!]: newPayload });
    }
  };

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const Content = () => (
    <div className="grid mt-2 gap-4 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative md:aspect-square">
          <Img
            src={media[0]?.url}
            alt={media[0]?.altText || productName}
            className="object-cover w-full h-[20rem] md:h-full rounded-md md:rounded-none"
          />
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <h3 className="text-2xl font-bold">{productName}</h3>
            <p className="text-xl">
              {formatAmountToNaira(discount || price.default)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  style={{
                    color: currentStore?.customizations?.theme.secondary,
                    fill: currentStore?.customizations?.theme.secondary,
                  }}
                  key={i}
                  className="h-5 w-5 fill-primary"
                />
              ))}
              {[...Array(0)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-muted-foreground" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {p.averageRating || 0.0}
            </span>
            <Button
              style={{ color: currentStore?.customizations?.theme.primary }}
              variant="link"
              className="text-sm text-primary"
            >
              See all {p.totalReviews || 0} reviews
            </Button>
          </div>
          <div className="grid gap-2">
            <span className="font-medium">Color</span>
            <RadioGroup
              defaultValue={color}
              onValueChange={setColor}
              className="flex gap-2"
            >
              {availableColors.map((c, idx) => (
                <label
                  style={{
                    borderColor:
                      c.name === color
                        ? currentStore?.customizations?.theme.primary
                        : "",
                  }}
                  key={idx}
                  className={cn("cursor-pointer rounded-full border-2 p-1")}
                >
                  <RadioGroupItem value={c.name} className="sr-only" />
                  <div
                    style={{ background: c.colorCode }}
                    className="h-6 w-6 rounded-full"
                  />
                </label>
              ))}
            </RadioGroup>
          </div>
          {!!availableSizes.length && (
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Size</span>
                <Button variant="link" className="text-sm text-primary">
                  Size guide
                </Button>
              </div>
              <RadioGroup
                defaultValue={size}
                onValueChange={setSize}
                className="grid grid-cols-4 gap-2 sm:grid-cols-7"
              >
                {availableSizes.map((s) => (
                  <label
                    key={s}
                    className={cn(
                      "flex cursor-pointer items-center justify-center rounded-md border py-2 text-sm uppercase",
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input hover:bg-accent"
                    )}
                  >
                    <RadioGroupItem value={s} className="sr-only" />
                    {s}
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          <Button
            onClick={addItemToCart}
            style={{
              background: currentStore?.customizations?.theme.primary,
            }}
            className="w-full bg-primary text-primary-foreground"
          >
            Add to bag
          </Button>
          <Button
            style={{ color: currentStore?.customizations?.theme.secondary }}
            variant="link"
            className="text-primary"
            asChild
          >
            <Link to={menu(store?.storeCode!)[2].path + _id}>
              View full details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <ScrollArea className="h-[650px]">
            <Content />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <Content />
      </DialogContent>
    </Dialog>
  );
}
