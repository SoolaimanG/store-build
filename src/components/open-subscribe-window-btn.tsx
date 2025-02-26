import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { useAuthentication } from "@/hooks/use-authentication";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/types";
import queryString from "query-string";

const OpenSubscribeWindowBtn: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => {
  const { isAuthenticated } = useAuthentication();
  const n = useNavigate();

  const onClick = () => {
    const currentPath = location.href + "#subscribe";

    const q = queryString.stringify({
      redirectTo: currentPath,
    });

    if (!isAuthenticated) {
      n(`${PATHS.SIGNIN}?${q}`);
      return;
    }

    n(`${location.search}#subscribe`);
  };

  return (
    <Button asChild onClick={onClick} className={cn(className, "bg-inherit")}>
      {children}
    </Button>
  );
};

export default OpenSubscribeWindowBtn;
