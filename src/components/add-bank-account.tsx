import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";

export default function AddBankAccount({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");

  const { isLoading, data, error } = useQuery({
    queryKey: ["getBanks"],
    queryFn: () => storeBuilder.getBanks(),
  });

  console.log({ isLoading, data, error });

  const AccountForm = () => (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-bold">
        Enter your account number to continue
      </h2>

      <Alert className="bg-purple-50 border-purple-200 text-purple-800">
        <AlertDescription>
          Important: The account number must be the store owner's own account.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="bank-name" className="text-xs text-gray-500 uppercase">
          Bank Name
        </Label>
        <Select defaultValue="9payment">
          <SelectTrigger id="bank-name" className="w-full">
            <SelectValue placeholder="Select bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9payment">9 payment service Bank</SelectItem>
            <SelectItem value="access">Access Bank</SelectItem>
            <SelectItem value="gtb">GTBank</SelectItem>
            <SelectItem value="zenith">Zenith Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="account-number" className="sr-only">
          Account Number
        </Label>
        <Input
          id="account-number"
          placeholder="Enter account number"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nin" className="sr-only">
          NIN (National Identification Number)
        </Label>
        <Input id="nin" placeholder="Enter NIN number" className="w-full" />
      </div>

      <Button variant="ringHover" className="w-full text-white">
        VERIFY ACCOUNT
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-bold">
                CONNECT ACCOUNT
              </DrawerTitle>
            </div>
          </DrawerHeader>
          <div className="p-6">
            <AccountForm />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              CONNECT ACCOUNT
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="py-4">
          <AccountForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
