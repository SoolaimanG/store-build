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
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { Text } from "./text";
import { toast } from "@/hooks/use-toast";

export default function AddBankAccount({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");
  const [isPending, startTransition] = useState(false);
  const [data, setData] = useState({
    accountNumber: "",
    nin: "",
    bankCode: "",
    bankName: "",
  });

  const {
    isLoading,
    data: banks = [],
    error,
  } = useQuery({
    queryKey: ["getBanks"],
    queryFn: () => storeBuilder.listBank(),
  });

  const { isLoading: verifyingAccountNumber, data: account } = useQuery({
    queryKey: [data.accountNumber, data.bankCode],
    queryFn: () =>
      storeBuilder.verifyAccountNumber(data.bankCode, data.accountNumber),
    enabled: Boolean(data.bankCode && data.accountNumber.length >= 10),
  });

  const addBankAccount = async () => {
    startTransition(true);
    try {
      const res = await storeBuilder.addBankAccount(
        data.accountNumber,
        data.nin,
        data.bankCode,
        data.bankName
      );

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  useToastError(error);

  const accountForm = (
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
        <Select
          disabled={isLoading}
          value={data.bankCode}
          onValueChange={(e) => {
            const [code, name] = e.split("-");
            setData({ ...data, bankCode: code, bankName: name });
          }}
        >
          <SelectTrigger id="bank-name" className="w-full">
            <SelectValue placeholder="Select bank" />
          </SelectTrigger>
          <SelectContent>
            {banks.map((bank) => (
              <SelectItem key={bank.id} value={bank.code + "-" + bank.name}>
                {bank.name}
              </SelectItem>
            ))}
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
          value={data.accountNumber}
          onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
        />
        {account && <Text>{account.data.account_name}</Text>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nin" className="sr-only">
          NIN (National Identification Number)
        </Label>
        <Input
          value={data.nin}
          onChange={(e) => setData({ ...data, nin: e.target.value })}
          id="nin"
          placeholder="Enter NIN number"
          className="w-full"
        />
      </div>

      <Button
        disabled={verifyingAccountNumber || isPending}
        onClick={addBankAccount}
        variant="ringHover"
        className="w-full text-white"
      >
        ADD ACCOUNT
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
          <div className="p-6">{accountForm}</div>
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
        <div className="py-4">{accountForm}</div>
      </DialogContent>
    </Dialog>
  );
}
