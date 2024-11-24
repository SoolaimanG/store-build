import { cn } from "@/lib/utils";
import { FC } from "react";

export const Text: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, className, ...props }) => {
  return (
    <div className={cn("text-sm text-foreground/80", className)} {...props}>
      {children}
    </div>
  );
};
