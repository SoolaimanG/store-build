import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatAmountToNaira, getInitials } from "@/lib/utils";
import { IProduct } from "@/types";

const OrderProductView: FC<{
  product: IProduct & { quantity?: number };
  products: IProduct[];
}> = ({ product }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-lg border">
          <Avatar className="h-full w-full object-cover rounded-md">
            <AvatarImage
              className=""
              src={product.media[0]?.url}
              alt={product.media[0]?.altText || product.productName}
            />
            <AvatarFallback className="rounded-md w-full">
              {getInitials(product.productName)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h4 className="font-medium">{product.productName}</h4>
          <p className="text-sm text-gray-500">SKU: {product.stockQuantity}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="font-medium">Quantity</p>
          <p className="text-gray-500">x{product.quantity || 1}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Price</p>
          <p className="text-gray-500">
            {formatAmountToNaira(product.price.default)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderProductView;
