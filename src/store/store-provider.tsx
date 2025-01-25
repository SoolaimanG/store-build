import { FC, ReactNode, useEffect } from "react";
import { HeroSectionNavBar } from "./hero";
import { useLocation, useParams } from "react-router-dom";
import { useStoreBuildState } from ".";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { Loader2 } from "lucide-react";
import { Text } from "@/components/text";
import StoreAboutUs from "./store-about-us";
import StoreFooter from "./footer";

const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { storeCode = "" } = useParams();

  const { setCurrentStore } = useStoreBuildState();
  const location = useLocation();
  // const { setTheme } = useTheme();

  const { isLoading, data, error } = useQuery({
    queryKey: ["store", storeCode],
    queryFn: () => storeBuilder.getStore(storeCode),
  });

  useEffect(() => {
    if (data?.data) {
      setCurrentStore(data.data);

      // <----- CART LOGIC ----->
    }
  }, [data?.data]);

  useToastError(error);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center flex-col gap-2 justify-center">
        <Loader2 size={80} className="animate-spin text-purple-500" />
        <Text>Please Wait Loading Store</Text>
      </div>
    );
  }

  return (
    <div>
      <StoreAboutUs isOpen={location.hash === "#about-us"} />
      <HeroSectionNavBar />
      {children}
      {data?.data.customizations?.footer && <StoreFooter />}
    </div>
  );
};

export default StoreProvider;
