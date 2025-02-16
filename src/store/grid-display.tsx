import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/types";
import { FC, useState } from "react";
import ProductCard from "./product-card";
import { EmptyProductState } from "@/components/empty";
import { Button } from "@/components/ui/button";
import { PackageIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreBuildState } from ".";

const GridDisplay: FC<{
  isLoading?: boolean[];
  products: IProduct[];
  onRefresh?: () => void;
}> = ({ isLoading = [true], products, onRefresh }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentStore: store } = useStoreBuildState();
  if (isLoading[0]) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 w-full">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <EmptyProductState
        icon={PackageIcon}
        header="No products found"
        message="Try adjusting your search or filters to find what you're looking for."
      >
        <Button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variant="outline"
          onClick={onRefresh}
          className="flex items-center gap-2"
          style={{
            borderColor: store?.customizations?.theme.primary,
            background: isHovered ? store?.customizations?.theme.primary : "",
          }}
        >
          <RefreshCw
            className={cn("h-4 w-4", isLoading[1] && "animate-spin")}
          />
          Refresh
        </Button>
      </EmptyProductState>
    );
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
