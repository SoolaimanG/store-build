import { FC, ReactNode, useEffect, useState } from "react";
import { HeroSectionNavBar } from "./hero";
import { Link, useLocation, useParams } from "react-router-dom";
import { useStoreBuildState } from ".";
import { useQuery } from "@tanstack/react-query";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { Bot, Clock, Loader2, Store } from "lucide-react";
import { Text } from "@/components/text";
import StoreAboutUs from "./store-about-us";
import StoreFooter from "./footer";
import StoreOrderIsPlaced from "./store-order-is-placed";
import { EmptyProductState } from "@/components/empty";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/types";
import { toast } from "@/hooks/use-toast";
import { AIChat } from "@/components/ai-chat";
import { useDocumentTitle } from "@uidotdev/usehooks";

const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isPending, startTransition] = useState(false);
  const { storeCode = "" } = useParams();

  const { setCurrentStore } = useStoreBuildState();
  const location = useLocation();

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["store", storeCode],
    queryFn: () => storeBuilder.getStore(storeCode),
    retry: 1,
  });

  const {
    isLoading: integrationLoading,
    data: integration,
    error: integrationError,
  } = useQuery({
    queryKey: ["integration", "chatbot"],
    queryFn: () => storeBuilder.getIntegration("chatbot"),
  });

  //Set the title to the store name
  useDocumentTitle(
    `${data?.data?.storeName || "Store"} | ${
      data?.data?.description || "Description"
    }`
  );

  useEffect(() => {
    if (data?.data) {
      setCurrentStore(data.data);

      // <----- CART LOGIC ----->
    }
  }, [data?.data]);

  const previewStore = async () => {
    try {
      startTransition(true);
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30);

      await storeBuilder.editStore({
        previewFor: now.toISOString(),
      });
      refetch();
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const err = useToastError(error || integrationError);

  if (isLoading || integrationLoading) {
    return (
      <div className="w-screen h-screen flex items-center flex-col gap-2 justify-center">
        <Loader2 size={80} className="animate-spin text-purple-500" />
        <Text>Please Wait Loading Store</Text>
      </div>
    );
  }

  if (err?.code === 1100) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <EmptyProductState
          icon={Store}
          header="Store Not Active"
          message="Sorry, Its seems that this store is not yet active. Please try again later"
        >
          <Button
            size="lg"
            asChild
            variant="ringHover"
            className="rounded-none"
          >
            <Link to={PATHS.HOME}>Go Home</Link>
          </Button>
        </EmptyProductState>
      </div>
    );
  }

  if (err?.code === 3300) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <EmptyProductState
          icon={Clock}
          header="Preview Time Expired"
          message="Your preview time has expired, If you are the store owner please click on the button below!"
        >
          <Button
            disabled={isPending}
            variant="ringHover"
            onClick={previewStore}
          >
            Extend Preview Time
          </Button>
        </EmptyProductState>
      </div>
    );
  }

  return (
    <div>
      <StoreAboutUs isOpen={location.hash === "#about-us"} />
      <StoreOrderIsPlaced />
      <HeroSectionNavBar />
      {children}
      {data?.data.customizations?.footer && <StoreFooter />}

      {/* AI Chat-Bot */}
      {integration?.data?.integration.isConnected && (
        <AIChat
          // @ts-ignore
          aiName={integration.data.integration.settings?.name}
          type="customerHelper"
          userId={storeBuilder.generateSessionId}
        >
          <Button
            variant="default"
            style={{
              background: data?.data.customizations?.theme?.secondary,
            }}
            className="fixed bottom-5 right-3 rounded-full w-12 h-12"
            size="icon"
          >
            <Bot />
          </Button>
        </AIChat>
      )}
    </div>
  );
};

export default StoreProvider;
