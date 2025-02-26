import type React from "react";
import { type FC, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, storeBuilder } from "@/lib/utils";
import { useStoreBuildState } from ".";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ellipsis, ShoppingBag, Trash2 } from "lucide-react";
import Logo from "@/components/logo";
import { Text } from "@/components/text";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ICartItem, IProduct } from "@/types";
import ProductCardWithQuantityIncrementation from "./product-card-with-quantity-incrementation";
import { useToastError } from "@/hooks/use-toast-error";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { menu } from "@/constants";
import { BuyNowPreview } from "./store-buy-now-preview";

export interface CartProduct extends IProduct, ICartItem {}

interface CARTProps {
  children: React.ReactNode;
  open?: boolean;
}

const CartItem: FC<{
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}> = ({ productId, ...props }) => {
  const { currentStore: store } = useStoreBuildState();
  const { isLoading, data, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => storeBuilder.getProduct(productId),
  });

  useToastError(error);

  const [cart, setCart] = useLocalStorage<Record<string, ICartItem[]>>(
    "storeCarts",
    {}
  );

  const currentCart = cart[store?.storeCode!];

  const removeItemFromCart = () => {
    const newCart = currentCart.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.color === props.color &&
          item.size === props.size
        )
    );
    setCart({ ...cart, [store?.storeCode!]: newCart });
  };

  const onQuantityChange = (
    id: string,
    quantity: number,
    options?: { color?: string; size?: string }
  ) => {
    const newCart = currentCart.map((cart) =>
      cart.productId === id &&
      cart.color === options?.color &&
      cart.size === options?.size
        ? { ...cart, quantity }
        : cart
    );

    setCart({ ...cart, [store?.storeCode!]: newCart });
  };

  return (
    <ProductCardWithQuantityIncrementation
      isLoading={isLoading}
      product={{ ...data?.data!, ...props }}
      size={props.size}
      color={props.color}
      quantity={props.quantity}
      onQuantityChange={onQuantityChange}
      onDeleteProduct={removeItemFromCart}
    />
  );
};

export function CART({ children, open: initialOpen = false }: CARTProps) {
  const [open, setOpen] = useState(initialOpen);
  const { currentStore } = useStoreBuildState();
  const { storeCode = "" } = currentStore || {};
  const { customizations } = currentStore || {};

  const [storeCart, setStoreCart] = useLocalStorage<
    Record<string, ICartItem[]>
  >("storeCarts", {});

  const currentCart = storeCart[storeCode] || [];

  const clearCart = () => {
    setStoreCart({ ...storeCart, [storeCode]: [] });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["products-with-id", currentCart.map((c) => c.productId)],
    queryFn: () =>
      storeBuilder.getProductsWithIds(currentCart.map((c) => c.productId)),
  });

  const { data: products = [] } = data || {};

  const _products = currentCart
    .map((cartItem) => {
      const product = products.find((p) => p._id === cartItem.productId);

      if (!product) return null;
      return {
        ...product,
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
      };
    })
    .filter(Boolean) as CartProduct[];

  const productsKey = JSON.stringify(
    _products.map((p) => ({ id: p._id, quantity: p.quantity }))
  );

  useToastError(error);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {currentCart.length > 0 && (
            <span
              style={{ backgroundColor: customizations?.theme.primary }}
              className={cn(
                "absolute -top-2 -right-1 h-5 w-5 rounded-full text-primary-foreground text-xs flex items-center justify-center"
              )}
            >
              {currentCart.length}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-[90%]">
        <SheetHeader className="flex-row items-center justify-between">
          <SheetTrigger>
            <Button className="rounded-full" size={"icon"} variant="ghost">
              <ArrowLeft size={18} />
            </Button>
          </SheetTrigger>
          <SheetTitle>My Cart</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="rounded-full" size={"icon"} variant="ghost">
                <Ellipsis size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={clearCart}>
                  <Trash2 />
                  Clear Cart
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>
        <div className="flex items-center justify-between mt-2">
          <Logo path={location.href} name={currentStore?.storeName} />
          <Text className="">{currentCart.length} Items</Text>
        </div>
        <ScrollArea className="h-[530px]">
          {!!currentCart.length ? (
            currentCart.map((c, idx) => (
              <CartItem
                key={idx}
                productId={c.productId}
                color={c.color}
                size={c.size}
                quantity={c.quantity}
              />
            ))
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center flex-col gap-2">
              <div>
                <ShoppingBag size={50} />
              </div>
              <h2>No Item On Your Cart</h2>
              <Button
                asChild
                size="sm"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                <Link to={menu(storeCode)[2].path}>View Products</Link>
              </Button>
            </div>
          )}
        </ScrollArea>
        {/* Add cart content here */}
        {!!currentCart.length && (
          <SheetFooter>
            <BuyNowPreview
              key={productsKey}
              disableQuantityIncrement
              products={_products}
            >
              <Button
                disabled={isLoading}
                style={{ background: customizations?.theme.primary }}
              >
                CheckOut {currentCart.length} Items
              </Button>
            </BuyNowPreview>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
