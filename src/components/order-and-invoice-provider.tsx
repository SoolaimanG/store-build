import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import PaymentOptions from "@/store/payment-option";
import Logo from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { FC, ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

const OrderAndInvoiceProvider: FC<{
  children: ReactNode;
  headerBtn: ReactNode;
  phoneNumber?: string;
  addBackgroundToPaymentOptions?: boolean;
  storeCode?: string;
}> = ({
  children,
  headerBtn,
  phoneNumber,
  addBackgroundToPaymentOptions = false,
  storeCode = "",
}) => {
  const { id = "" } = useParams() as { id: string };
  const isMobile = useMediaQuery("(max-width:767px)");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const disabledOptions = ["mono"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full fixed p-4 bg-slate-900 z-10">
        <div className="flex justify-between items-center container m-auto">
          <Logo />
          {headerBtn}
        </div>
      </header>

      <div className="w-full flex gap-2">
        <div className="md:w-[65%] w-full pt-16">{children}</div>
        {/* Fixed payment section for desktop */}
        <div
          className={cn(
            "md:w-[35%] hidden md:block",
            addBackgroundToPaymentOptions && "bg-slate-900/50"
          )}
        >
          <div className="fixed top-0 right-0 w-[35%] h-screen md:pt-[12rem] pb-8 px-4">
            <div className="h-full overflow-auto">
              <PaymentOptions
                disabledOptions={disabledOptions}
                phoneNumber={phoneNumber}
                orderId={id}
                storeCode={storeCode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Pay Button and Drawer */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-10">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <div className="flex items-center justify-center flex-col cursor-pointer">
                <div className="h-2 w-[9rem] bg-slate-700 rounded-lg" />
                <div className=" w-full flex items-start justify-start gap-2 mt-2">
                  <span>Click here to Pay</span>
                  <Badge variant="destructive">FAST</Badge>
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="px-4 pb-6">
              <div className=" w-full flex items-start justify-start gap-2 mt-2">
                <span>Click here to Pay</span>
                <Badge variant="destructive">FAST</Badge>
              </div>
              <div className="h-full overflow-auto py-7">
                <PaymentOptions
                  disabledOptions={disabledOptions}
                  phoneNumber={phoneNumber}
                  orderId={id}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default OrderAndInvoiceProvider;
