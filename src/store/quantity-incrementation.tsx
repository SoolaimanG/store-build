import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { useStoreBuildState } from ".";
import { IProduct } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const QuantityIncrementation: FC<{
  isLoading?: boolean;
  onQuantityChange: (
    id: string,
    quantity: number,
    options?: { color?: string; size?: string; type?: "inc" | "dec" }
  ) => void;
  quantity: number;
  disableQuantityIncrement?: boolean;
  useStoreColor?: boolean;
  product: IProduct & { quantity: number };
  color?: string;
  size?: string;
}> = ({
  isLoading,
  onQuantityChange,
  useStoreColor = true,
  product,
  color,
  size,
  quantity,
  disableQuantityIncrement = false,
}) => {
  const [isHovered, setIsHovered] = useState(0);
  const { currentStore: store } = useStoreBuildState();

  return (
    <div className="flex items-center p-1 bg-slate-900 rounded-sm">
      <Button
        className="w-7 h-7 flex items-center justify-center"
        variant="ghost"
        onMouseLeave={() => setIsHovered(0)}
        onMouseEnter={() => setIsHovered(1)}
        style={{
          borderColor: useStoreColor
            ? store?.customizations?.theme.primary
            : "",
          background:
            isHovered === 1 ? store?.customizations?.theme.primary : "",
        }}
        size="sm"
        onClick={() =>
          onQuantityChange(product._id!, Math.max(1, product.quantity - 1), {
            color,
            size,
            type: "dec",
          })
        }
        type="button"
        disabled={isLoading || disableQuantityIncrement}
      >
        -
      </Button>
      {isLoading ? (
        <Skeleton className="h-6 w-12" />
      ) : (
        <span className="w-12 text-center">
          {Math.max(1, product.quantity)}
        </span>
      )}
      <Button
        className="w-7 h-7 flex items-center justify-center"
        variant="ghost"
        onMouseLeave={() => setIsHovered(0)}
        onMouseEnter={() => setIsHovered(2)}
        type="button"
        style={{
          borderColor: store?.customizations?.theme.primary,
          background:
            isHovered === 2 ? store?.customizations?.theme.primary : "",
        }}
        size="sm"
        onClick={() =>
          onQuantityChange(
            product._id!,
            Math.min(product.maxStock, quantity + 1),
            { color, size, type: "inc" }
          )
        }
        disabled={isLoading || disableQuantityIncrement}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityIncrementation;
