import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOrder } from "@/types";
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

export function EditDelivery({
  onClose,
  orderData: { _id = "", ...order },
}: {
  orderData: IOrder;
  onClose: () => void;
}) {
  const [deliveryType, setDeliveryType] = useState(
    order.shippingDetails.shippingMethod
  );
  const [carrier, setCarrier] = useState("SENDBOX");
  const [trackingNo, setTrackingNo] = useState(
    order.paymentDetails.tx_ref || ""
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: Implement update logic
    console.log("Updating delivery info:", { carrier, trackingNo });
    onClose();
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
            onChange={(e) => setCarrier(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="speed" className="text-left">
            Delivery Type
          </Label>
          <Select
            value={deliveryType}
            onValueChange={(e: "REGULAR" | "EXPRESS") => setDeliveryType(e)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a delivery type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Delivery Type</SelectLabel>
                <SelectItem value="STANDARD">Standard</SelectItem>
                <SelectItem value="EXPRESS">Express</SelectItem>
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
        <Button type="submit">Save changes</Button>
        {order.shippingDetails.trackingNumber !== "pending" && (
          <Button variant="destructive">Cancel Delivery</Button>
        )}
      </div>
    </form>
  );
}
