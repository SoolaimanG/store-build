"use client";

import { Check, ChevronRight, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { IOrder, PATHS } from "@/types";
import { useStoreBuildState } from ".";
import { useNavigate } from "react-router-dom";
import { copyToClipboard, generateWhatsAppOrderMessage } from "@/lib/utils";

export function OrderSuccess({
  onClose,
  _id,
  ...order
}: IOrder & { onClose: () => void }) {
  const { currentStore: store } = useStoreBuildState();
  const n = useNavigate();

  return (
    <div className="sm:max-w-md p-0 gap-0 overflow-hidden">
      <div className="flex flex-col items-center px-2 pt-8">
        <div className="bg-emerald-500 rounded-full p-5 mb-6">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-medium mb-8">
          Thank you for <span className="font-bold">Your Order!</span>
        </h2>

        <div className="w-full space-y-2 mb-8">
          <Button
            variant="secondary"
            className="w-full justify-between font-medium"
            onClick={() => n(PATHS.ORDERS + _id)}
          >
            View or Edit Order
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-between font-medium"
            onClick={() => copyToClipboard(_id!, "Order Id")}
          >
            Copy Order Id
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-between font-medium"
            onClick={() => {
              const link = generateWhatsAppOrderMessage({
                phone: order.customerDetails?.phoneNumber || "",
                customerName: order.customerDetails?.name || "Unknown Customer",
                deliveryMethod: order?.deliveryType || "Not specified",
                itemDetails:
                  order?.products
                    ?.map(
                      (product) =>
                        `${product.productName} - NGN ${product.price.default}`
                    )
                    .join(", ") || "No products specified",
                orderId: _id || "Unknown Order ID",
                orderLink: PATHS.STORE_ORDERS + _id || "#",
                paymentOptions: {
                  bankAccount: {
                    accountName: "STEADY GADGETS by Emmanuel",
                    accountNumber: "4565590278",
                    bankName: "FIDELITY BANK",
                  },
                },
                totalPrice: `${order?.amountLeftToPay || "0"}`,
              });

              window.open(link, "_blank");
            }}
          >
            Send to Whatsapp
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-between font-medium"
            onClick={() => {
              n(PATHS.INVOICE + _id);
            }}
          >
            Make Payment
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          style={{ background: store?.customizations?.theme?.primary }}
          className="w-full bg-indigo-800 hover:bg-indigo-900 text-white"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
