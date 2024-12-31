import { toast } from "@/hooks/use-toast";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { FC, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { btnVariant } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

const ConnectAppBtn: FC<{
  children: ReactNode;
  integrationId: string;
  className?: string;
  variant?: btnVariant;
  onSuccess?: () => void;
}> = ({
  children,
  className = "w-full",
  integrationId,
  variant,
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const connectApp = async () => {
    try {
      setIsLoading(true);
      const res = await storeBuilder.connectAndDisconnectIntegrations(
        integrationId
      );

      queryClient.invalidateQueries({ queryKey: ["integrations"] });

      onSuccess();

      toast({ title: "SUCCESS", description: res.message });
    } catch (error) {
      const err = errorMessageAndStatus(error);
      toast({
        title: err.status,
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      asChild
      disabled={isLoading}
      onClick={connectApp}
      className={className}
      variant={variant}
    >
      {children}
    </Button>
  );
};

export default ConnectAppBtn;
