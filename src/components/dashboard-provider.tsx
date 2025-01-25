import { FC, ReactNode, useEffect } from "react";
import DashBoardNavBar from "./dashboard-navbar";
import SideBar from "./sidebar";
import { useAuthentication } from "@/hooks/use-authentication";
import { useTheme } from "./theme-provider";

const DashboardProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useAuthentication();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, []);

  return (
    <div>
      <DashBoardNavBar />
      <SideBar />
      <main className="pt-20 pl-16">{children}</main>
    </div>
  );
};

export default DashboardProvider;
