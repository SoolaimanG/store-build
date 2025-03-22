import { errorMessageAndStatus } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "./use-toast";
import { PATHS } from "@/types";

export const useToastError = (error: any) => {
  const _error = errorMessageAndStatus(error);

  useEffect(() => {
    if (error) {
      toast({
        title: `Something went wrong: ${_error.status || "SERVER"}`,
        description: _error.message,
        variant: "destructive",
      });

      if (_error?.code === 4400) {
        location.href = PATHS.SIGNIN + ""
      }
    }
  }, [error]);

  return _error;
};
