import { LucideProps } from "lucide-react";
import { FC, ReactNode } from "react";

export const EmptyProductState: FC<{
  message?: string;
  header?: string;
  children?: ReactNode;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}> = ({
  message = "   Get started by adding your first product to your store.",
  header = "No products found",
  children = <div className="sr-only" />,
  ...rest
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="bg-muted/30 p-4 rounded-full">
        {rest.icon && <rest.icon className="h-12 w-12 text-muted-foreground" />}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{header}</h3>
        <p className="text-muted-foreground">{message}</p>
      </div>
      {children}
    </div>
  );
};
