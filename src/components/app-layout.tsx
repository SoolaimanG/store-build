import { FC } from "react";
import { Toaster } from "./ui/toaster";

export const AppLayOut: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children }) => {
  return (
    <div>
      <Toaster />
      {children}
    </div>
  );
};
