import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "./address-autocomplete";
import {} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CreatePickupFormProps {
  onSubmit: () => void;
}

export function CreatePickupForm({ onSubmit }: CreatePickupFormProps) {
  const [__, setPickupAddress] = useState("");
  const [_, setDeliveryAddress] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);

    // Process form data
    // const pickupData = {
    //   pickup_address: {
    //     address: pickupAddress,
    //     contact_name: formData.get("pickupName"),
    //     contact_phone: formData.get("pickupPhone"),
    //   },
    //   delivery_address: {
    //     address: deliveryAddress,
    //     contact_name: formData.get("deliveryName"),
    //     contact_phone: formData.get("deliveryPhone"),
    //   },
    //   type: formData.get("type"),
    //   payment_method: formData.get("paymentMethod"),
    //   is_express_delivery: isExpress,
    //   pickup_timing: new Date(
    //     formData.get("pickupTime") as string
    //   ).toISOString(),
    //   notes: formData.get("notes"),
    // };

    // console.log("Pickup data:", pickupData);
    // TODO: Send data to API

    onSubmit();
  };

  return (
    <div>
      <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddressAutocomplete
            id="pickupAddress"
            label="Pickup Address"
            onAddressSelect={setPickupAddress}
          />

          <AddressAutocomplete
            id="deliveryAddress"
            label="Delivery Address"
            onAddressSelect={setDeliveryAddress}
          />

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" name="type" required />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select defaultValue="bank-trf">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a payment Method to use" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Payment method</SelectLabel>
                  <SelectItem value="cash-on-delivery">
                    Cash On Delivery
                  </SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank-trf">Bank Transfer</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <Input
              id="pickupTime"
              name="pickupTime"
              type="datetime-local"
              required
            />
          </div>

          <Button className="w-full" size="lg" type="submit">
            Create Pickup
          </Button>
        </form>
      </div>
    </div>
  );
}
