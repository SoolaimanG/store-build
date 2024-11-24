import { FC, ReactNode } from "react";
import DashBoardNavBar from "./dashboard-navbar";
import SideBar from "./sidebar";
import { useAuthentication } from "@/hooks/use-authentication";

const DashboardProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useAuthentication();

  return (
    <div>
      <DashBoardNavBar />
      <SideBar />
      <main className="pt-20 pl-16">{children}</main>
    </div>
  );
};

export default DashboardProvider;
