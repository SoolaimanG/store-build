import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOrder } from "@/types";
import { useState } from "react";
import { Label } from "./ui/label";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function EditShipping({
  orderData: { _id = "", ...order },
  onClose,
}: {
  orderData: IOrder;
  onClose: () => void;
}) {
  const [address1, setAddress1] = useState(
    order.customerDetails.shippingAddress.addressLine1
  );
  const [address2, setAddress2] = useState(
    order.customerDetails.shippingAddress.addressLine2
  );
  const [phoneNumber, setPhoneNumber] = useState(
    order.customerDetails.phoneNumber
  );
  const [postalCode, setPostalCode] = useState(
    order.customerDetails.shippingAddress.postalCode
  );

  const queryClient = useQueryClient();
  const [isPending, startTransition] = useState(false);

  const handleSubmit = async (e: any) => {
    try {
      startTransition(true);
      e.preventDefault();
      // TODO: Implement update logic
      const res = await storeBuilder.editOrder(
        _id || "",
        {
          customerDetails: {
            ...order.customerDetails,
            phoneNumber,
            shippingAddress: {
              ...order.customerDetails.shippingAddress,
              addressLine1: address1,
              addressLine2: address2,
              postalCode,
            },
          },
        },
        order.customerDetails.phoneNumber
      );

      onClose();

      queryClient.invalidateQueries({ queryKey: ["order", _id] });

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      startTransition(false);
      const { status: title, message: description } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="space-y-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="address1" className="text-left">
            Address Line 1
          </Label>
          <Input
            id="address1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address2" className="text-left">
            Address Line 2
          </Label>
          <Input
            id="address2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="postalCode" className="text-left">
            Postal Code
          </Label>
          <Input
            id="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phoneNumber" className="text-left">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Button disabled={isPending} variant="ringHover" type="submit">
          Save changes
        </Button>
      </div>
    </form>
  );
}
