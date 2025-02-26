import { errorMessageAndStatus } from "@/lib/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "./use-toast";
import { PATHS } from "@/types";

export const useToastError = (error: any) => {
  const _error = errorMessageAndStatus(error);
  const n = useNavigate();

  useEffect(() => {
    if (error) {
      toast({
        title: `Something went wrong: ${_error.status || "SERVER"}`,
        description: _error.message,
        variant: "destructive",
      });

      _error?.code === 4400 && n(PATHS.SIGNIN);
    }
  }, [error]);

  return _error;
};
