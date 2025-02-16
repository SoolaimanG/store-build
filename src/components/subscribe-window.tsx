"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useAuthentication } from "@/hooks/use-authentication";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Text } from "./text";
import {
  appConfig,
  errorMessageAndStatus,
  formatAmountToNaira,
  storeBuilder,
} from "@/lib/utils";
import { tiers } from "@/constants";
import { Badge } from "./ui/badge";
import { useRef, useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bell,
  CreditCard,
} from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

const SubscribeWindow = () => {
  const [isPending, startTransition] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user } = useAuthentication();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [months, setMonths] = useState(1);
  const location = useLocation();
  const n = useNavigate();

  const qs = queryString.parse(location.hash) as Record<string, any>;

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  }, []);

  const handleClose = () => {
    n(location.pathname + `${location.search}`);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const incrementMonths = useCallback(() => {
    setMonths((prev) => Math.min(prev + 1, 12)); // Max 12 months
  }, []);

  const decrementMonths = useCallback(() => {
    setMonths((prev) => Math.max(prev - 1, 1)); // Min 1 month
  }, []);

  const handleInitializeSubscription = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.initializeChargeForSubscription(
        reminderEnabled,
        months
      );
      toast({ title: "SUCCESS", description: res.message });

      window.open(res.data.data.authorization_url, "_blank");
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const premiumFeatures = (
    <div className="relative mt-4">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {tiers[1].features.map((feature, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="rounded-full whitespace-nowrap gap-2 cursor-pointer py-2 px-3"
          >
            <CheckCircle2 size={17} className="text-green-500" />
            {feature}
          </Badge>
        ))}
      </div>
      {showRightArrow && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const totalPrice = appConfig.premiumAmount * months;
  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + months);

  const paymentDetails = (
    <div className="p-2 md:p-0 space-y-6 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
      <Card className="p-6 rounded-lg w-full shadow-md">
        <CardContent className="p-0 w-full">
          <CardHeader className="p-0 space-y-4">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user?.email[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Account</h3>
                  <Text className="text-sm text-gray-500">{user?.email}</Text>
                </div>
              </div>
              <div>
                <Text className="text-sm font-medium">
                  {new Date().toLocaleDateString()}
                </Text>
              </div>
            </div>
            <Separator />
            <div>
              <Text className="text-5xl font-bold">
                {formatAmountToNaira(totalPrice)}
              </Text>
              <Text className="text-sm text-gray-500">
                Total for {months} {months === 1 ? "month" : "months"}
              </Text>
            </div>
            <div className="flex items-center justify-between bg-slate-900 p-3 rounded-md">
              <Text className="font-medium">Subscription period:</Text>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementMonths}
                  disabled={months === 1}
                  className="w-8 h-8 rounded-full"
                >
                  -
                </Button>
                <Text className="w-8 text-center font-bold">{months}</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementMonths}
                  disabled={months === 12}
                  className="w-8 h-8 rounded-full"
                >
                  +
                </Button>
                <Text className="font-medium">
                  {months === 1 ? "MONTH" : "MONTHS"}
                </Text>
              </div>
            </div>
            {premiumFeatures}
          </CardHeader>
        </CardContent>
      </Card>
      <Card className="p-6 space-y-4 shadow-md rounded-lg">
        <div>
          <h3 className="text-xl font-semibold mb-2">Subscription Details</h3>
          <Text className="text-gray-400 tracking-tight">
            Unlock premium features and enhance your experience with our
            subscription plan.
          </Text>
        </div>
        <Separator />
        <div>
          <h4 className="font-medium mb-1">Next Payment Date</h4>
          <Text className="text-primary">
            {nextPaymentDate.toLocaleDateString()}
          </Text>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="reminder"
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
          <Label
            htmlFor="reminder"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Bell size={16} className="text-primary" />
            Remind me before subscription ends
          </Label>
        </div>
      </Card>

      <Progress value={(months / 12) * 100} className="w-full" />

      <Button
        variant="ringHover"
        size="lg"
        onClick={handleInitializeSubscription}
        className="w-full font-semibold"
        disabled={isPending}
      >
        <CreditCard className="mr-2 h-5 w-5" /> Upgrade Now
      </Button>

      <Text className="text-center text-sm text-gray-500">
        {months} out of 12 months selected
      </Text>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        open={Object.keys(qs)[0] === "subscribe"}
        onOpenChange={(e) => {
          if (!e) {
            handleClose();
          }
        }}
      >
        <DrawerContent>
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold tracking-tight">
              Upgrade to Premium
            </DrawerTitle>
          </DrawerHeader>
          {paymentDetails}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={Object.keys(qs)[0] === "subscribe"}
      onOpenChange={(e) => {
        if (!e) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold tracking-tight text-center">
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>
        {paymentDetails}
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeWindow;
