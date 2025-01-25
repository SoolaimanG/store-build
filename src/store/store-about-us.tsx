import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC } from "react";
import { useStoreBuildState } from ".";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const StoreAboutUs: FC<{ isOpen?: boolean }> = ({ isOpen = false }) => {
  const { currentStore } = useStoreBuildState();
  const n = useNavigate();
  const location = useLocation();

  const onOpenChange = (_: boolean) => {
    n(location.pathname);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-light">About Us</DialogTitle>
        </DialogHeader>
        <DialogDescription
          dangerouslySetInnerHTML={{ __html: currentStore?.aboutStore! }}
        />
        <DialogFooter>
          <DialogClose>
            <Button
              style={{
                background: currentStore?.customizations?.theme.primary,
              }}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoreAboutUs;
