import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { IDeliveryIntegration, IOrder, IShippingMethods } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { cn, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { DatePicker } from "./date-picker";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface CreatePickupFormProps {
  onSubmit: () => void;
  order: IOrder;
}

export function CreatePickupForm({ onSubmit, order }: CreatePickupFormProps) {
  const [customerState, setcustomerState] = useState(
    order.customerDetails.shippingAddress.state || ""
  );
  const [customerCity, setCustomerCity] = useState(
    order.customerDetails.shippingAddress.city || ""
  );
  const [shippingMethod, setShippingMethod] = useState(
    order.shippingDetails.shippingMethod
  );
  const [pickUpType, setPickUpType] = useState("pickup");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { isLoading, data, error } = useQuery({
    queryKey: ["integration"],
    queryFn: () => storeBuilder.getIntegration("sendbox"),
  });

  const { data: integration } = data || {};

  const { integration: sendBox } = integration || {};

  const { settings } = sendBox as { settings: IDeliveryIntegration };

  useToastError(error);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await storeBuilder.createDeliveryPickup(
        order._id!,
        pickUpType,
        date?.toISOString()
      );
      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    }

    onSubmit();
  };

  return (
    <div className="h-full">
      <div className="p-3 md:p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Customer State</Label>
            <Select
              disabled={isLoading}
              value={customerState}
              onValueChange={(e) => setcustomerState(e)}
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select state for delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select State</SelectLabel>

                  {settings.shippingRegions?.map((region) => (
                    <SelectItem
                      key={region}
                      className="capitalize"
                      value={region}
                    >
                      {region}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">City</Label>
            <Input
              value={customerCity}
              onChange={(e) => setCustomerCity(e.target.value)}
              id="city"
              name="city"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={pickUpType}
              onValueChange={(e) => setPickUpType(e)}
              defaultValue="pickup"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types</SelectLabel>
                  <SelectItem value="pickup">Pick Up</SelectItem>
                  <SelectItem value="dropoff">Drop Off</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Shipping Method</Label>
            <Select
              value={shippingMethod}
              onValueChange={(e: IShippingMethods) => setShippingMethod(e)}
              defaultValue="STANDARD"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a shipping Method to use" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Shipping method</SelectLabel>
                  <SelectItem value="STANDARD">STANDARD</SelectItem>
                  <SelectItem value="EXPRESS">EXPRESS</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {pickUpType === "pickup" && (
            <div className="space-y-2">
              <Label htmlFor="pickupTime">Pickup Time</Label>
              <DatePicker date={date!} setDate={setDate}>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal hover:bg-slate-800 border-slate-800",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Select date for order pick up or drop off</span>
                  )}
                </Button>
              </DatePicker>
            </div>
          )}

          <Button
            disabled={!sendBox?.isConnected}
            className="w-full"
            size="lg"
            type="submit"
          >
            Create Pickup
          </Button>
        </form>
      </div>
    </div>
  );
}
