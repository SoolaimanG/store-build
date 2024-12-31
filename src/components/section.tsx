import { cn } from "@/lib/utils";
import { FC } from "react";

export const Section: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
> = ({ children, className, ...props }) => {
  return (
    <section
      className={cn("w-full md:max-w-6xl mx-auto px-4 py-6", className)}
      {...props}
    >
      {children}
    </section>
  );
};
