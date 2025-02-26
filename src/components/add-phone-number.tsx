import type React from "react";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Check } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuthentication } from "@/hooks/use-authentication";
import { Text } from "./text";

export default function AddPhoneNumber({
  children,
  type = "submit",
}: {
  children: ReactNode;
  type?: "button" | "submit";
}) {
  const { user } = useAuthentication();
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [isSuccess, setIsSuccess] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isPending, startTransition] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      startTransition(true);
      const res = await storeBuilder.updateUser({ phoneNumber });
      toast({
        title: "SUCCESS",
        description: res.message,
      });
      setIsSuccess(true);
    } catch (error) {
      const { message: description = "Something went wrong..." } =
        errorMessageAndStatus(error);

      toast({ title: "ERROR", description, variant: "destructive" });
    } finally {
      startTransition(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsSuccess(false);
  };

  const Content = () => (
    <>
      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              type={type}
              className="w-full"
            >
              Add Phone Number
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Success!</h3>
          <Text className=" leading-4 tracking-tight">
            Your phone number has been modify successfully.
          </Text>
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Modify Phone Number</DrawerTitle>
            <DrawerDescription>
              Enter your phone number to receive updates and improve your app
              security.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            <Content />
          </div>
          <DrawerFooter className="py-0 pb-3">
            <DrawerClose asChild>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modify Phone Number</DialogTitle>
          <DialogDescription>
            Enter your phone number to receive updates and improve your app
            security.
          </DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
