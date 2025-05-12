import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IDeliveryType, IOrder } from "@/types";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "@/hooks/use-toast";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";

export function EditDelivery({
  onClose,
  orderData: { _id = "", ...order },
}: {
  orderData: IOrder;
  onClose: () => void;
}) {
  const [deliveryType, setDeliveryType] = useState<IDeliveryType>(
    order?.deliveryType
  );
  const [carrier, setCarrier] = useState<"SENDBOX">("SENDBOX");
  const [trackingNo, setTrackingNo] = useState(
    order?.shippingDetails?.trackingNumber || ""
  );
  const [isPending, startTransition] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    startTransition(true);

    try {
      await storeBuilder.editOrder(_id, {
        ...order,
        shippingDetails: {
          ...order.shippingDetails,
          carrier,
          trackingNumber: trackingNo,
        },
        deliveryType,
      });
    } catch (error) {
      toast({
        title: "ERROR",
        description: errorMessageAndStatus(error).message,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-0 space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="carrier" className="text-left">
            Ship by
          </Label>
          <Input
            id="carrier"
            readOnly
            value={"SENDBOX"}
            onChange={(e) => setCarrier(e.target.value as "SENDBOX")}
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="delivery-type" className="text-left">
            Delivery Type
          </Label>
          <Select
            value={deliveryType}
            onValueChange={(e: IDeliveryType) => setDeliveryType(e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a delivery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Delivery Type</SelectLabel>
                <SelectItem value="sendbox">Send Box</SelectItem>
                <SelectItem value="pick_up">Pick Up</SelectItem>
                <SelectItem value="waybill">Way Bill</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="trackingNo" className="text-left">
            Tracking No.
          </Label>
          <Input
            id="trackingNo"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button disabled={isPending} type="submit">
          Save changes
        </Button>
        {order?.shippingDetails?.trackingNumber !== "pending" && (
          <Button variant="destructive">Cancel Delivery</Button>
        )}
      </div>
    </form>
  );
}
