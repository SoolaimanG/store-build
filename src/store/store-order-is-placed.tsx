import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck } from "lucide-react";
import { FC, ReactNode, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStoreBuildState } from ".";
import {
  allProductsAreDigital,
  formatAmountToNaira,
  sumUpValues,
} from "@/lib/utils";
import { IProduct } from "@/types";
import { Link } from "react-router-dom";

const StoreOrderIsPlaced: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const { orderPlaced: order, currentStore: store } = useStoreBuildState();
  const [open, setOpen] = useState(Boolean(order));
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");

  const closeButton = (children: ReactNode) =>
    isMobile ? (
      <DrawerFooter className="p-0">
        <DrawerClose asChild>{children}</DrawerClose>
      </DrawerFooter>
    ) : (
      <DialogFooter>
        <DialogClose asChild>{children}</DialogClose>
      </DialogFooter>
    );

  const Content = (
    <div className="flex items-center justify-center p-4">
      <div className="w-full space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <CheckCircle2
            style={{ color: store?.customizations?.theme.primary }}
            size={70}
          />
          <h1 className="text-xl font-semibold">Your order is made!</h1>
          <p className="text-sm text-gray-500">
            Congratulations! Your order has been successfully proceed, we will
            pick up your order as soon as possible!
          </p>
        </div>

        <div className="space-y-4">
          <div
            style={{ borderColor: store?.customizations?.theme.secondary }}
            className="flex items-center gap-2 p-3 rounded-lg border"
          >
            <Truck
              style={{ color: store?.customizations?.theme.primary }}
              className="w-5 h-5 text-blue-600"
            />
            <div>
              <div className="text-sm font-medium">ORDER ID #{order?._id}</div>
              <div className="text-sm text-gray-500">
                {order?.shippingDetails?.shippingMethod}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Store Name</div>
              <div className="text-sm font-medium">{store?.storeName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Recipient Name</div>
              <div className="text-sm font-medium">
                {order?.customerDetails.name || "Customer Name"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Order Status</div>
              <div className="text-sm font-medium">{order?.orderStatus}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Delivery Address</div>
              <div className="text-sm font-medium">
                {allProductsAreDigital(order?.products as IProduct[])
                  ? "Not Specified"
                  : order?.customerDetails.shippingAddress.addressLine1 +
                    ", " +
                    order?.customerDetails.shippingAddress.state}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Weight</div>
              <div className="text-sm font-medium">
                {Boolean(sumUpValues(order?.products, "weight"))
                  ? sumUpValues(order?.products, "weight")
                  : "Weightless"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Amount</div>
              <div className="text-sm font-medium">
                {formatAmountToNaira(order?.totalAmount || 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            style={{ background: store?.customizations?.theme.primary }}
            variant="secondary"
            className="w-full"
            asChild
          >
            <Link target="__blank" to={order?.paymentDetails.paymentLink!}>
              Complete Payment
            </Link>
          </Button>
          {closeButton(
            <Button
              style={{
                borderColor: store?.customizations?.theme.primary,
                background: isHovered
                  ? store?.customizations?.theme.primary
                  : "",
              }}
              variant="outline"
              className="w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Back to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DrawerContent className="p-2">{Content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>{Content}</DialogContent>
    </Dialog>
  );
};

export default StoreOrderIsPlaced;
