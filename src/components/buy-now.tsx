import { FC, ReactNode } from "react";

const BUYNOW: FC<{ productId: string; children: ReactNode }> = ({
  productId,
  children,
  ...props
}) => {
  return <div>{children}</div>;
};

export default BUYNOW;
