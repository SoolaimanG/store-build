import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { useStoreBuildState } from "@/store";

export const useAuthentication = (key?: any, retry?: number) => {
  //
  const { setUser, setIsPaymentDetailsConfirmed } = useStoreBuildState();

  const { isLoading, data, error, isSuccess } = useQuery({
    queryKey: ["is-user-authenticated", key],
    queryFn: () => storeBuilder.getUser(),
    refetchInterval: retry,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(data.data);
      setIsPaymentDetailsConfirmed();
    }
  }, [isSuccess]);

  return { isLoading, user: data?.data, error, isAuthenticated: isSuccess };
};
