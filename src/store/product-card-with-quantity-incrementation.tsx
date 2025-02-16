import { type FC, useState } from "react";
import { Img } from "react-image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreBuildState } from ".";
import type { IProduct } from "@/types";
import { formatAmountToNaira, getProductPrice } from "@/lib/utils";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { menu } from "@/constants";

interface ProductQuantityProps {
  product: IProduct & { quantity: number };
  onQuantityChange: (
    id: string,
    quantity: number,
    options?: { color?: string; size?: string }
  ) => void;
  size?: string;
  color?: string;
  quantity: number;
  isLoading?: boolean;
  onDeleteProduct?: () => void;
  disableQuantityIncrement?: boolean;
}

const ProductCardWithQuantityIncrementation: FC<ProductQuantityProps> = ({
  product,
  onQuantityChange,
  size,
  color,
  quantity,
  isLoading = false,
  onDeleteProduct,
  disableQuantityIncrement = false,
}) => {
  const [isHovered, setIsHovered] = useState(0);
  const { currentStore: store } = useStoreBuildState();

  return (
    <div className="flex items-center gap-4 py-4 relative">
      {isLoading ? (
        <Skeleton className="h-20 w-20 rounded-md" />
      ) : (
        <Link
          to={menu(store?.storeCode!)[2].path + product._id!}
          className="relative h-20 w-20 overflow-hidden rounded-md border"
        >
          <Img
            src={
              product.media[0]?.url || "/placeholder.svg?height=200&width=200"
            }
            alt={product.productName || "Product"}
            className="object-cover h-full"
          />
        </Link>
      )}
      {onDeleteProduct && (
        <Button
          size="sm"
          variant="ghost"
          className=" absolute top-3 right-1 w-8 h-8 p-2"
          onClick={onDeleteProduct}
          type="button"
        >
          <Trash size={17} />
        </Button>
      )}
      <div className="flex flex-1 flex-col gap-1">
        {isLoading ? (
          <>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <>
            <h3 className="font-medium">{product.productName}</h3>
            {(size || color) && (
              <p className="text-sm text-muted-foreground">
                {size} / {color}
              </p>
            )}
          </>
        )}
        <div className="flex items-center justify-between">
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <span className="font-medium">
              {formatAmountToNaira(getProductPrice(product as IProduct, size!))}
            </span>
          )}
          <div className="flex items-center p-1 bg-slate-900 rounded-sm">
            <Button
              className="w-7 h-7 flex items-center justify-center"
              variant="ghost"
              onMouseLeave={() => setIsHovered(0)}
              onMouseEnter={() => setIsHovered(1)}
              style={{
                borderColor: store?.customizations?.theme.primary,
                background:
                  isHovered === 1 ? store?.customizations?.theme.primary : "",
              }}
              size="sm"
              type="button"
              onClick={() =>
                onQuantityChange(
                  product._id!,
                  Math.max(1, product.quantity - 1),
                  { color, size }
                )
              }
              disabled={isLoading || disableQuantityIncrement}
            >
              -
            </Button>
            {isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <span className="w-12 text-center">{Math.max(1, quantity)}</span>
            )}
            <Button
              type="button"
              className="w-7 h-7 flex items-center justify-center"
              variant="ghost"
              onMouseLeave={() => setIsHovered(0)}
              onMouseEnter={() => setIsHovered(2)}
              style={{
                borderColor: store?.customizations?.theme.primary,
                background:
                  isHovered === 2 ? store?.customizations?.theme.primary : "",
              }}
              size="sm"
              onClick={() =>
                onQuantityChange(
                  product._id!,
                  Math.min(product.maxStock, product.quantity + 1),
                  { color, size }
                )
              }
              disabled={isLoading || disableQuantityIncrement}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardWithQuantityIncrementation;
