import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/types";
import { FC } from "react";
import ProductCard from "./product-card";
import NoProductsFound from "./no-product-found";

const GridDisplay: FC<{
  isLoading?: boolean;
  products: IProduct[];
  onRefresh?: () => void;
}> = ({ isLoading, products, onRefresh }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <NoProductsFound onRefresh={onRefresh} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
      {products?.map((product) => (
        <ProductCard
          key={product._id}
          {...product}
          isGridDisplay
          className="w-full"
        />
      ))}
    </div>
  );
};

export default GridDisplay;
