import { FC, ReactNode, useEffect } from "react";
import DashBoardNavBar from "./dashboard-navbar";
import SideBar from "./sidebar";
import { useAuthentication } from "@/hooks/use-authentication";
import { useTheme } from "./theme-provider";
import { ManageStoreAddress } from "./manage-store-address";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

const DashboardProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useAuthentication();
  const { setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:767px)");

  useEffect(() => {
    setTheme("dark");
  }, []);

  return (
    <div>
      <ManageStoreAddress open={location.hash === "#manage-address"} />
      <DashBoardNavBar />
      {!isMobile && <SideBar />}
      <main className={cn("pt-20 pl-16", isMobile && "pl-0")}>{children}</main>
    </div>
  );
};

export default DashboardProvider;
