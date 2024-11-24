import { useMediaQuery } from "@uidotdev/usehooks";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useAuthentication } from "@/hooks/use-authentication";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Text } from "./text";
import { appConfig, formatAmountToNaira } from "@/lib/utils";
import { buttonVariants, tiers } from "@/constants";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Button } from "./ui/button";
import CompletePaymentBtn from "./complete-payment-btn";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

const SubscribeWindow = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user } = useAuthentication();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const location = useLocation();
  const n = useNavigate();

  const qs = queryString.parse(location.hash) as Record<string, any>;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const handleClose = () => {
    n(location.pathname + `?${location.search}`);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const premiumFeatures = (
    <div className="relative">
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
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Badge
              variant="secondary"
              className="rounded-sm whitespace-nowrap gap-2 cursor-pointer"
            >
              <CheckCircle2
                size={17}
                className="text-purple-500 fill-purple-500"
              />
              {feature}
            </Badge>
          </motion.div>
        ))}
      </div>
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const paymentDetails = (
    <div className="p-2 md:p-0 space-y-4 w-full max-h-[calc(100vh-200px)] overflow-y-auto">
      <Card className="p-3 rounded-md w-full">
        <CardContent className="p-0 w-full">
          <CardHeader className="p-0 py-2 space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-row items-center justify-between w-full"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user?.email[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3>Account</h3>
                  <Text>{user?.email}</Text>
                </div>
              </div>
              <div>
                <h2 className="font-bold">{new Date().toLocaleDateString()}</h2>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Text className="text-4xl font-bold">
                {formatAmountToNaira(appConfig.premiumAmount)}
              </Text>
            </motion.div>
            {premiumFeatures}
          </CardHeader>
        </CardContent>
      </Card>
      <Card className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Subscription Details</h3>
          <Text>
            Unlock premium features and enhance your experience with our
            subscription plan.
          </Text>
        </div>
        <div>
          <h4 className="font-medium mb-1">Next Payment Date</h4>
          <Text>{nextPaymentDate.toLocaleDateString()}</Text>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="reminder"
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
          />
          <Label htmlFor="reminder" className="flex items-center gap-2">
            <Bell size={16} />
            Remind me before subscription ends
          </Label>
        </div>
      </Card>
      <CompletePaymentBtn
        amount={appConfig.premiumAmount}
        customer={{
          email: user?.email!,
          name: user?.storeName!,
          phone_number: "",
        }}
      >
        <motion.div
          variants={buttonVariants(1.008, 0.99)}
          whileHover="hover"
          whileTap="tap"
        >
          <Button variant="ringHover" className="h-[3rem] w-full">
            Complete Payment
          </Button>
        </motion.div>
      </CompletePaymentBtn>
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
          <DrawerHeader>
            <DrawerTitle className="text-3xl">Payment Details</DrawerTitle>
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
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        {paymentDetails}
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeWindow;
