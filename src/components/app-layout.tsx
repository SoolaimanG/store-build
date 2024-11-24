import { FC } from "react";
import { Toaster } from "./ui/toaster";
import OtpValidator from "./otp-validator";
import SubscribeWindow from "./subscribe-window";
import AddPaymentDetails from "./add-payment-details";

export const AppLayOut: FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children }) => {
  return (
    <div>
      <Toaster />
      <OtpValidator />
      <SubscribeWindow />
      <AddPaymentDetails />
      {children}
    </div>
  );
};
