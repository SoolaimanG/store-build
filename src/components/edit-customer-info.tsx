import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { IOrder } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function EditCustomerInfo({
  orderData: { _id = "", ...order },
  onClose,
}: {
  orderData: IOrder;
  onClose: () => void;
}) {
  const [name, setName] = useState(order.customerDetails.name);
  const [email, setEmail] = useState(order.customerDetails.email);
  const [isPending, startTransition] = useState(false);

  const queryClient = useQueryClient();

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
            email,
            name,
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
    <form onSubmit={handleSubmit} className="p-4 md:p-0">
      <div className=" space-y-3 py-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-left">
            Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[3rem]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-left">
            Email
          </label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[3rem]"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="ringHover" disabled={isPending} type="submit">
          Save changes
        </Button>
      </div>
    </form>
  );
}
