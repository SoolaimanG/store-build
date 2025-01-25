import { toast } from "@/hooks/use-toast";
import { cn, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { IStore } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { FC, ReactNode, useState } from "react";
import { Button, ButtonProps } from "./ui/button";

interface SaveChangesProps extends ButtonProps {
  btnText?: string;
  updates: Partial<IStore>;
  partial?: boolean;
  children?: ReactNode;
  onSave?: (payload: IStore) => void;
}

export const SaveChanges: FC<SaveChangesProps> = ({
  btnText,
  updates,
  partial = false,
  children,
  className,
  onSave,
  ...props
}) => {
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      setPending(true);
      const res = await storeBuilder.editStore(updates, partial);

      queryClient.invalidateQueries({ queryKey: ["store"] });

      toast({
        title: "Success",
        description: res.message,
      });

      if (onSave) {
        onSave(res.data);
      }
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);
      toast({ title, description, variant: "destructive" });
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      disabled={pending}
      onClick={handleSave}
      type="button"
      className={cn("w-full", className)}
      {...props}
    >
      {pending ? "Saving..." : children || btnText || "Save Changes"}
    </Button>
  );
};
