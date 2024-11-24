import { cn } from "@/lib/utils";
import { FC } from "react";
import { Link } from "react-router-dom";

export const Logo: FC<{ path?: string; className?: string }> = ({
  path = location.origin,
  className,
}) => {
  return (
    <Link to={path} className={cn("text-2xl font-bold", className)}>
      StoreBuild
    </Link>
  );
};
