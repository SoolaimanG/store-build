"use client";

import { CircleOff, DollarSign, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { appConfig, storeBuilder } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import { useToastError } from "@/hooks/use-toast-error";
import { EmptyProductState } from "@/components/empty";
import { PATHS } from "@/types";
import OrderAndInvoiceProvider from "@/components/order-and-invoice-provider";
import InvoiceDetails from "@/components/invoice-details";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import PaymentOptions from "@/store/payment-option";
import { useDocumentTitle, useMediaQuery } from "@uidotdev/usehooks";

export default function Invoice() {
  const { id = "" } = useParams() as { id: string };
  const isMobile = useMediaQuery("(max-width:767px)");

  useDocumentTitle("Invoice " + id);

  const { isLoading, data, error } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => (await storeBuilder.getInvoice(id)).data,
    enabled: Boolean(id),
  });

  const { status } = useToastError(error);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className=" animate-spin" size={100} />
      </div>
    );
  }

  if (status === "NOT FOUND") {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <EmptyProductState
          icon={CircleOff}
          message="We could not find this invoice you are looking for."
          header="This invoice is not found."
        >
          <Button asChild size="lg" variant="ringHover" className="mt-4">
            <Link to={PATHS.HOME}>Visit {appConfig.name}</Link>
          </Button>
        </EmptyProductState>
      </div>
    );
  }

  return (
    <OrderAndInvoiceProvider
      phoneNumber={data?.customerPhone}
      headerBtn={
        <div>
          {isMobile ? (
            <Drawer>
              <DrawerTrigger>
                <Button size="sm" variant="secondary" className="gap-1">
                  <DollarSign size={16} />
                  Pay Now
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="h-full overflow-auto py-7">
                  <PaymentOptions
                    orderId={id}
                    phoneNumber={data?.customerPhone}
                    disabledOptions={["mono"]}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Button size="sm" variant="outline" className="gap-2">
              <Download size={16} />
              Download PDF
            </Button>
          )}
        </div>
      }
      storeCode={data?.storeCode}
    >
      <InvoiceDetails {...data} />
    </OrderAndInvoiceProvider>
  );
}
