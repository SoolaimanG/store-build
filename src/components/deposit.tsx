import { useMediaQuery } from "@uidotdev/usehooks";
import { FC, ReactNode, useState } from "react";
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
import { Button } from "./ui/button";
import { EmptyProductState } from "./empty";
import { Copy, LandmarkIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  copyToClipboard,
  errorMessageAndStatus,
  storeBuilder,
} from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { toast } from "@/hooks/use-toast";

const Deposit: FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["get-dedicated-account"],
    queryFn: () => storeBuilder.getDedicatedAccount(),
    enabled: isOpen,
  });

  const createDedicatedAccount = async () => {
    startTransition(true);
    try {
      const { message } = await storeBuilder.createDedicatedAccount(); //use this util function to create a new account.

      refetch(); //Get the account details after creating new account.

      //Notify the user about the success.
      toast({
        title: "Success",
        description: message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          errorMessageAndStatus(error).message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const Modal = isMobile ? Drawer : Dialog;
  const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const ModalContent = isMobile ? DrawerContent : DialogContent;
  const ModalFooter = isMobile ? DrawerFooter : DialogFooter;
  const ModalClose = isMobile ? DrawerClose : DialogClose;
  const ModalHeader = isMobile ? DrawerHeader : DialogHeader;
  const ModalTitle = isMobile ? DrawerTitle : DialogTitle;
  const ModalDescription = isMobile ? DrawerDescription : DialogDescription;

  return (
    <Modal open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <ModalTrigger>{children}</ModalTrigger>
      <ModalContent className="md:max-w-2xl">
        <ModalHeader>
          <ModalTitle className="tracking-tight">
            Do you want to make deposit?
          </ModalTitle>
          <ModalDescription className="tracking-tight">
            If you ever want to make a deposit to your account you can use your
            dedicated and reserve Account Number to make the deposit and get
            funded immediately
          </ModalDescription>
        </ModalHeader>

        {/**Create a skeleton loading for display account number details */}
        {isLoading ? (
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ) : data ? (
          <div className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Account Number</p>
                  <p className="text-xl font-bold">
                    {data.accountDetails.accountNumber}
                  </p>
                </div>
                <Copy
                  onClick={() =>
                    copyToClipboard(
                      data.accountDetails.accountNumber,
                      "Account Number"
                    )
                  }
                  size={18}
                  className="hover:text-primary cursor-pointer"
                />
              </div>
              <div>
                <p className="text-sm font-medium">Bank Name</p>
                <p className="text-xl font-bold">
                  {data.accountDetails.bankName}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Account Name</p>
                <p className="text-xl font-bold">
                  {data.accountDetails.accountName}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyProductState
            icon={LandmarkIcon}
            header="No Account Details"
            message="We couldn't fetch your account details at this time"
          >
            <Button
              className="rounded-none gap-2"
              size="lg"
              variant="ringHover"
              disabled={isPending}
              onClick={createDedicatedAccount}
            >
              {isPending && <Loader2 className="animate-spin" size={19} />}
              Get Account
            </Button>
          </EmptyProductState>
        )}

        <ModalFooter>
          <ModalDescription className="text-center text-primary">
            Get Funded In Less Than 10secs
          </ModalDescription>
          <ModalClose asChild>
            <Button className="rounded-sm">Close</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Deposit;
