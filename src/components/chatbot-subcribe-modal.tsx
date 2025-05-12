import { ReactNode, useState } from "react";
import {
  CreditCard,
  Clock,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  storeBuilder,
} from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ChatbotSubscriptionModalProps {
  onSubscribe: () => void;
  onDismiss: () => void;
  userBalance: number;
  children: ReactNode;
}

export default function ChatbotSubscriptionModal({
  onSubscribe,
  onDismiss,
  userBalance = 0,
  children,
}: ChatbotSubscriptionModalProps) {
  const [isPending, startTransition] = useState(false);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const subscriptionCost = Number(
    import.meta.env.VITE_CHATBOT_SUBSCRIPTION_FEE || 2000
  );
  const remainingBalance = userBalance - subscriptionCost;

  const handleSubscribe = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.subscribeToChatBot();
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast({
        title: "SUCCESS",
        description: res.message,
      });

      setOpen(false);
      onSubscribe();
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);
    onDismiss();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[100%] md:max-w-4xl p-0 rounded-lg sm:rounded-xl flex flex-col h-[100vh] sm:h-auto sm:max-h-[90vh]">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-2 sm:p-3 flex-none">
          <DialogHeader className="mb-2 space-y-4">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="bg-background text-primary border-primary px-2 py-1 text-xs sm:px-3"
              >
                Premium Feature
              </Badge>
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                Subscribe to Access the Chatbot
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm sm:text-base">
                Get instant assistance with your order inquiries, customer
                complaints, and product-related questions.
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 order-2 lg:order-1">
                  <h3 className="font-medium text-base sm:text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Chatbot Benefits
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Track orders and delivery status in real-time",
                      "Get immediate resolution for complaints",
                      "Receive detailed product information",
                      "Get personalized product recommendations",
                      "24/7 instant support availability",
                      "Multi-language support",
                      "Order history access",
                      "Smart product suggestions",
                      "Automated return processing",
                      "Delivery tracking updates",
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-muted rounded-xl h-fit p-4 order-1 lg:order-2">
                  <div className="space-y-4">
                    <h3 className="font-medium text-base sm:text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Subscription Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly fee:</span>
                        <span className="font-medium">
                          {formatAmountToNaira(subscriptionCost)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current balance:</span>
                        <span className="font-medium">
                          {formatAmountToNaira(userBalance)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Remaining balance:</span>
                        <span className="font-bold">
                          {formatAmountToNaira(Math.max(0, remainingBalance))}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        Amount will be deducted from your account balance
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-3">
                <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-xs sm:text-sm">
                  <span className="font-medium">Cancel anytime.</span> You can
                  unsubscribe from the chatbot service at any time from your
                  account settings.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 bg-muted/40 flex-none border-t">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="sm:order-1 order-2 w-full sm:w-auto"
          >
            Not now
          </Button>

          <Button
            onClick={handleSubscribe}
            disabled={isPending}
            size="lg"
            className="sm:order-2 order-1 w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Subscribe for {formatAmountToNaira(subscriptionCost)}/month
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
