import { FC, ReactNode, useEffect } from "react";
import DashBoardNavBar from "./dashboard-navbar";
import SideBar from "./sidebar";
import { useAuthentication } from "@/hooks/use-authentication";
import { useTheme } from "./theme-provider";
import { ManageStoreAddress } from "./manage-store-address";
import { Navigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { AIChat } from "./ai-chat";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { PATHS } from "@/types";
import queryString from "query-string";
import { Text } from "./text";

const DashboardProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuthentication();
  const { setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:767px)");

  useEffect(() => {
    setTheme("dark");
  }, []);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 size={90} className="animate-spin" />
        <Text className="text-xl">Trying to authenticate you....</Text>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = location.pathname + location.search;
    const q = queryString.stringify({
      redirectTo,
    });
    return <Navigate to={PATHS.SIGNIN + `?${q}`} />;
  }

  return (
    <div>
      <ManageStoreAddress open={location.hash === "#manage-address"} />
      <DashBoardNavBar />
      {!isMobile && <SideBar />}
      <main className={cn("pt-20 pl-16", isMobile && "pl-0 relative")}>
        <AIChat>
          <Button
            variant="shine"
            size="icon"
            className="rounded-full text-white fixed bottom-6 right-4 z-40"
          >
            <Sparkles size={18} />
          </Button>
        </AIChat>
        {children}
      </main>
    </div>
  );
};

export default DashboardProvider;
