import { cn } from "@/lib/utils";
import { FC, ReactNode } from "react";
import { Button } from "./ui/button";
import { useAuthentication } from "@/hooks/use-authentication";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/types";

const OpenSubscribeWindowBtn: FC<{
  className?: string;
  children: ReactNode;
}> = ({ className, children }) => {
  const { isAuthenticated } = useAuthentication();
  const n = useNavigate();

  const onClick = () => {
    const currentPath = location.href;

    console.log({ currentPath });

    if (!isAuthenticated) {
      n(`${PATHS.SIGNIN}?callbackUrl=${currentPath}`);
      return;
    }

    n(`#subscribe`);
  };

  return (
    <Button asChild onClick={onClick} className={cn(className, "bg-inherit")}>
      {children}
    </Button>
  );
};

export default OpenSubscribeWindowBtn;
