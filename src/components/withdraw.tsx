import { FC, ReactNode, useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "./ui/button";
import { EmptyProductState } from "./empty";
import { LandmarkIcon } from "lucide-react";
import AddBankAccount from "./add-bank-account";
import { useQuery } from "@tanstack/react-query";
import { cn, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useStoreBuildState } from "@/store";
import { IStoreBankAccounts } from "@/types";
import { ScrollArea } from "./ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";
import { Text } from "./text";
import { Label } from "./ui/label";
import { toast } from "@/hooks/use-toast";

const Withdraw: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:767px)");
  const { user, setOpenOTPValidator } = useStoreBuildState();
  const [selectedBank, setSelectedBank] = useState<IStoreBankAccounts>();
  const [currentView, setCurrentView] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isPending, startTransition] = useState(false);

  const { data = [] } = useQuery({
    queryKey: ["get-store-accouns", isOpen],
    queryFn: async () =>
      (await storeBuilder.getStoreBank(user?.storeCode!, true)).data,
    enabled: Boolean(user?.storeCode && isOpen),
  });

  useEffect(() => {
    if (!data?.length) return;

    const defaultAccount = data.find((account) => account.isDefault);

    setSelectedBank(defaultAccount);
  }, [data]);

  const Modal = isMobile ? Drawer : Dialog;
  const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const ModalContent = isMobile ? DrawerContent : DialogContent;
  const ModalFooter = isMobile ? DrawerFooter : DialogFooter;
  const ModalClose = isMobile ? DrawerClose : DialogClose;
  const ModalHeader = isMobile ? DrawerHeader : DialogHeader;
  const ModalTitle = isMobile ? DrawerTitle : DialogTitle;
  const ModalDescription = isMobile ? DrawerDescription : DialogDescription;

  //Select account from bank list
  const selectAccount = !data?.length ? (
    <EmptyProductState
      icon={LandmarkIcon}
      header="No Account Found"
      message="There is no account added to your store. Please add an account to withdraw your store balance."
    >
      <AddBankAccount>
        <Button variant="ringHover" size="lg" className="rounded-none">
          Add Account
        </Button>
      </AddBankAccount>
    </EmptyProductState>
  ) : (
    <div className="p-4 space-y-3">
      {data?.map((account) => (
        <Button
          variant="secondary"
          key={account._id}
          onClick={() => setSelectedBank(account)}
          className={cn(
            "w-full h-20 flex items-center justify-between p-4 text-left",
            selectedBank?._id === account._id && "border-primary border-2"
          )}
        >
          <div className="flex items-center gap-2">
            <LandmarkIcon className="h-8 w-8 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium">{account.bankName}</span>
              <span className="text-sm text-muted-foreground">
                {account.accountNumber}
              </span>
            </div>
          </div>
          <span className="text-sm">{account.accountName}</span>
        </Button>
      ))}
    </div>
  );

  const enterAmount = (
    <div className="p-4 w-full">
      <div className="flex items-center gap-3">
        <LandmarkIcon size={50} />
        <div>
          <h2 className="font-semibold text-lg">{selectedBank?.bankName}</h2>
          <Text className="text-xs">{selectedBank?.accountNumber}</Text>
        </div>
      </div>
      <div className="mt-5">
        <Label className="">Amount to withdraw</Label>
        <Input
          className="h-[3.5rem] mt-1 text-lg"
          placeholder="Amount to withdraw"
          value={amount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (!isNaN(value)) {
              setAmount(value);
            }
          }}
        />
      </div>
    </div>
  );

  const handleWithdrawal = async (otp = "") => {
    try {
      const { message } = await storeBuilder.requestWithdraw({
        otp,
        amount,
        accountId: selectedBank?._id!,
      });
      toast({
        title: "SUCCESS",
        description: message,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "ERROR",
        description:
          errorMessageAndStatus(error).message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const initiateWithdrawal = async () => {
    if (isPending) return;

    startTransition(true);
    try {
      const { message } = await storeBuilder.sendOTP("withdraw", user?.email!);

      setOpenOTPValidator({
        desc: "Use the otp sent to your inbox to request withdrawal.",
        header: "Verify OTP",
        onSuccess: handleWithdrawal,
        open: true,
        otpFor: "withdraw",
        userEmail: user?.email,
      });

      toast({
        title: "SUCCESS",
        description: message,
      });
    } catch (error) {
      toast({
        title: "ERROR",
        description:
          errorMessageAndStatus(error).message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const btns = [
    {
      label: "Select Account",
      onClick: () => setCurrentView(1),
      disable: Boolean(!selectedBank),
    },
    {
      label: "Withdraw",
      onClick: initiateWithdrawal,
      disable: Number(amount) <= 1000,
    },
  ];

  const views = [selectAccount, enterAmount];

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalClose />
          <ModalTitle>Withdraw</ModalTitle>
          <ModalDescription>
            Withdraw your store balance to your bank account.
          </ModalDescription>
        </ModalHeader>

        <ScrollArea className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              {views[currentView]}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
        <ModalFooter>
          <Button
            disabled={btns[currentView].disable || isPending}
            onClick={btns[currentView].onClick}
            variant="destructive"
          >
            {btns[currentView].label}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Withdraw;
