import { Text } from "@/components/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatAmountToNaira } from "@/lib/utils";
import { IProduct } from "@/types";
import { FC, useState } from "react";
import { Img } from "react-image";
import { useStoreBuildState } from ".";
import { ShoppingBag } from "lucide-react";
import { QuickProductView } from "./store-quick-view";
import { Link } from "react-router-dom";
import { menu } from "@/constants";

const ProductCard: FC<
  IProduct & { className?: string; isGridDisplay?: boolean }
> = ({
  media,
  productName,
  price,
  discount,
  description,
  className,
  isGridDisplay,
  ...product
}) => {
  const { currentStore } = useStoreBuildState();
  const { customizations, storeCode = "" } = currentStore || {};
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("w-[20rem] flex flex-col space-y-2", className)}>
      <Card className="w-full p-0 h-[21rem] relative cursor-pointer overflow-hidden group rounded-xl">
        <Img
          src={media[0]?.url}
          alt={media[0]?.altText || productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Link
          to={menu(storeCode)[2].path + `${product._id}`}
          className="bg-black bg-opacity-40 absolute inset-0"
        />
        <div className="absolute flex flex-col top-1 right-1 -mt-4 -mr-4 p-6 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            style={{ backgroundColor: customizations?.theme.primary }}
            size="sm"
            className="rounded-sm gap-2 group/2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ShoppingBag
              size={18}
              className="transition-transform duration-300 group-hover/2:rotate-12"
            />
            <span className="overflow-hidden -mr-2 group-hover/2:-mr-0 transition-all duration-300 max-w-0 group-hover/2:max-w-xs">
              Buy Now
            </span>
          </Button>
        </div>
      </Card>
      <div className="flex flex-col space-y-2">
        <header className="flex items-center justify-between">
          <h3 className="font-semibold">{productName}</h3>
          <div>
            <span className="font-bold text-xl">
              {formatAmountToNaira(discount || price.default)}
            </span>
          </div>
        </header>
        <div className="flex items-center space-x-1">
          {product.availableColors.map((color) => (
            <div
              key={color.name}
              style={{ backgroundColor: color.colorCode }}
              className="w-[1.5rem] h-[1.5rem] dark:border-white border-slate-800 rounded-full border-2"
            />
          ))}
        </div>
        <Text className="line-clamp-1 font-light">{description}</Text>
        <div>
          <QuickProductView
            product={{
              media,
              productName,
              price,
              discount,
              description,
              ...product,
            }}
          >
            <Button
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                backgroundColor: isHovered
                  ? customizations?.theme.primary
                  : isGridDisplay
                  ? customizations?.theme.primary
                  : "",
                borderColor: customizations?.theme.primary,
              }}
              variant={isGridDisplay ? "default" : "outline"}
              className={cn(
                "rounded-full transition-colors ease-linear",
                isGridDisplay && "rounded-lg w-full"
              )}
            >
              Add To Cart
            </Button>
          </QuickProductView>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
