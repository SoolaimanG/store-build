import { useState, type ReactNode } from "react";
import { X, CreditCard, MessageCircle, BadgeDollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useStoreBuildState } from "@/store";
import { Text } from "./text";
import { appConfig } from "@/lib/utils";

// Define payment method types
type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  discount?: {
    percentage: number;
    label: string;
  };
};

// Define component props
interface PaymentModalProps {
  children: ReactNode;
  open?: boolean;
  onPay: (method: "flutterwave" | "manual") => void;
  title?: string;
  amount: number;
}

export function SelectPaymentOption({
  children,
  open = false,
  onPay,
  title = "Select your payment option.",
  amount = 4750.0,
}: PaymentModalProps) {
  const { currentStore: store } = useStoreBuildState();
  const [isOpen, setIsOpen] = useState(open);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedMethod, setSelectedMethod] = useState<
    "manual" | "flutterwave" | null
  >(null);

  const onOpenChange = (e: boolean) => {
    setIsOpen(e);
  };

  // Payment methods data
  const paymentMethods: PaymentMethod[] = [
    {
      id: "manual",
      name: "Pay manually",
      description: "Complete your order payment manually on whatsapp",
      icon: <MessageCircle className="h-6 w-6 text-blue-500" />,
    },
    {
      id: "flutterwave",
      name: "Pay with Flutterwave",
      description: "Complete your order payment with flutterwave",
      icon: <BadgeDollarSign className="h-6 w-6 text-teal-500" />,
    },
  ];

  const handlePayment = () => {
    if (selectedMethod) {
      onPay(selectedMethod);
      onOpenChange(false);
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6 flex flex-col items-center text-center space-y-2">
        <div className="bg-orange-500 rounded-full p-4 mb-2">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold">Pay</h2>
        <p className="text-3xl font-bold">
          {"NGN"} {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <Text>SECURED BY {appConfig.name.toUpperCase()}</Text>
      </div>

      <div className="flex-1 overflow-auto px-4">
        <RadioGroup
          value={selectedMethod || ""}
          onValueChange={(e: "flutterwave" | "manual") => setSelectedMethod(e)}
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="border-t py-4">
              <Label
                htmlFor={method.id}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {method.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{method.name}</span>
                      {method.discount && (
                        <span className="text-xs text-white px-2 py-0.5 rounded bg-green-500">
                          {method.discount.label}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="h-5 w-5"
                  style={{
                    color: store?.customizations?.theme?.primary,
                    borderColor: store?.customizations?.theme?.primary,
                  }}
                />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="border-t p-4 space-y-2">
        <Button
          style={{ background: store?.customizations?.theme?.primary }}
          onClick={handlePayment}
          disabled={!selectedMethod}
          className="w-full py-6 text-lg"
        >
          Pay {"NGN"}{" "}
          {amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          *Final amount will include processing fees
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        {children && <div onClick={() => onOpenChange(true)}>{children}</div>}
        <DrawerContent className="h-[85vh] max-h-[85vh]">
          <div className="absolute right-4 top-4">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          <DrawerTitle className="text-lg font-semibold px-4 pt-4">
            {title}
          </DrawerTitle>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <div onClick={() => onOpenChange(true)}>{children}</div>}
      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="text-lg font-semibold">
          Subscribe to {title}
        </DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
}
