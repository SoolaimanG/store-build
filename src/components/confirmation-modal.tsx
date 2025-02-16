import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";

interface ConfirmationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  message?: string;
  title?: string;
  children?: ReactNode;
}

export function ConfirmationModal({
  isOpen = false,
  onClose = () => {},
  onConfirm,
  message = "Are you sure you want to delete the product? This action cannot be undone.",
  title = "Delete",
  children = <div />,
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(isOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        onClose();
      }}
    >
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            variant="destructive"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
