import { useStoreBuildState } from "@/store";
import { IOTPFor } from "@/types";
import queryString from "query-string";
import { FC, ReactNode } from "react";

const VerifyEmailBtn: FC<{
  children: ReactNode;
  otpFor?: IOTPFor;
  email?: string;
}> = ({ children, otpFor = "login", email: userEmail }) => {
  const { setOpenOTPValidator } = useStoreBuildState();
  const handleClick = () => {
    const { email } = queryString.parse(location.search) as { email?: string };
    setOpenOTPValidator({ open: true, otpFor, userEmail: email || userEmail });
  };
  return <div onClick={handleClick}>{children}</div>;
};

export default VerifyEmailBtn;
