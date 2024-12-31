"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IProduct } from "@/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useStoreBuildState } from "@/store";

interface UpdateStockDialogProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateStockDialog({
  product,
  isOpen,
  onClose,
}: UpdateStockDialogProps) {
  const { user } = useStoreBuildState();
  const queryClient = useQueryClient();
  const [newStock, setNewStock] = useState(product?.stockQuantity || 0);
  const [maxStock, setMaxStock] = useState(product?.maxStock || 0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isPending, startTransition] = useState(false);

  useEffect(() => {
    if (product) {
      setNewStock(product.stockQuantity);
      setMaxStock(product.maxStock);
    }
  }, [product]);

  if (!product) return null;

  const handleUpdate = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.createOrEditProduct({
        ...product,
        maxStock,
      });

      queryClient.invalidateQueries({
        queryKey: ["products", user?.storeId, location.search],
      });

      toast({
        title: "SUCCESS",
        description: res.message,
      });

      onClose();
    } catch (error) {
      const { message: description, status: title } =
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

  const content = (
    <>
      <div className="grid gap-4 py-4 px-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="stockQuantity" className="text-left">
            Stock Quantity
          </Label>
          <Input
            id="stockQuantity"
            type="number"
            value={newStock}
            readOnly
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="maxStock" className="text-left">
            Max Stock
          </Label>
          <Input
            id="maxStock"
            type="number"
            value={maxStock}
            onChange={(e) => setMaxStock(Number(e.target.value))}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 px-4">
        <Button disabled={isPending} className="w-full" onClick={handleUpdate}>
          Update Stock
        </Button>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock: {product.productName}</DialogTitle>
          </DialogHeader>
          {content}
          <DialogFooter className="pt-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Update Stock: {product.productName}</DrawerTitle>
        </DrawerHeader>
        {content}
        <DrawerFooter className="pt-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
