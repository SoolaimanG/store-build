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
import { Textarea } from "./ui/textarea";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const CancelOrder: FC<{
  children: ReactNode;
  orderId: string;
  phoneNumber: string;
  storeId: string;
  reason?: string;
}> = ({ children, orderId, ...props }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isPending, startTransition] = useState(false);
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const Modal = isMobile ? Drawer : Dialog;
  const ModalTrigger = isMobile ? DrawerTrigger : DialogTrigger;
  const ModalTitle = isMobile ? DrawerTitle : DialogTitle;
  const ModalHeader = isMobile ? DrawerHeader : DialogHeader;
  const ModalDescription = isMobile ? DrawerDescription : DialogDescription;
  const ModalContent = isMobile ? DrawerContent : DialogContent;
  const ModalFooter = isMobile ? DrawerFooter : DialogFooter;
  const ModalClose = isMobile ? DrawerClose : DialogClose;

  const cancelOrder = async () => {
    startTransition(true);

    try {
      const { message } = await storeBuilder.requestCancelOrder(orderId, {
        ...props,
      });
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
      setOpen(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>{children}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Request Order Cancellation</ModalTitle>
          <ModalDescription>
            Are you sure you want to cancel this order?
          </ModalDescription>
        </ModalHeader>
        <div className="p-5 md:p-0">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason For Cancellation (OPTIONAL)"
          />
        </div>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="secondary">Cancel</Button>
          </ModalClose>
          <Button onClick={cancelOrder} disabled={isPending}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CancelOrder;
