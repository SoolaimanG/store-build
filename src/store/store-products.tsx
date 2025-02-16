import { Section } from "@/components/section";
import { useStoreBuildState } from ".";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { Button } from "@/components/ui/button";
import {
  ArrowUpAZ,
  Calendar,
  CircleDollarSign,
  FilterIcon,
  Percent,
  SortAscIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProductFilter from "./store-product-filter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ISortBy } from "@/types";
import GridDisplay from "./grid-display";
import { PaginationFooter } from "@/components/pagination-footer";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

const StoreProducts = () => {
  const location = useLocation();

  const {
    colors = [],
    category,
    priceRange: _priceRange,
    rating,
    page = 1,
    sizes = [],
  } = queryString.parse(location.search, {
    parseBooleans: true,
    parseNumbers: true,
  }) as {
    colors: string[];
    category: string;
    priceRange: number;
    rating: number;
    page?: number;
    sizes?: string[];
  };

  const { currentStore } = useStoreBuildState();
  const { _id = "", customizations } = currentStore || {};

  const { isLoading, isRefetching, data, error, refetch } = useQuery({
    queryKey: ["products", _id, colors, category, rating, _priceRange],
    queryFn: () =>
      storeBuilder.getProducts(_id, {
        category,
        colors,
        rating,
        sizes,
        sort: "default",
        maxPrice: _priceRange,
        size: 20 * Number(page),
      }),
  });

  const sortIcons: Record<ISortBy, any> = {
    date: <Calendar size={18} />,
    name: <ArrowUpAZ size={18} />,
    discount: <Percent size={18} />,
    price: <CircleDollarSign size={18} />,
  };

  const { data: productData } = data || {};

  useToastError(error);

  return (
    <div className="pt-20 w-screen">
      <Section className="flex flex-col space-y-5">
        <header className="flex items-center justify-between">
          <h2 className="md:text-3xl text-2xl">
            Our Products ({productData?.totalProducts})
          </h2>
          <div className="flex items-center space-x-2">
            {customizations?.productsPages.canFilter && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    disabled={isLoading}
                    variant="secondary"
                    className="rounded-full gap-2"
                    size="sm"
                  >
                    <FilterIcon size={18} />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <ProductFilter
                    storeId={_id}
                    priceRange={productData?.filters.priceRange}
                    sizes={productData?.filters.allSizes || []}
                    colors={productData?.filters.allColors!}
                    className="h-[630px] md:h-[500px]"
                    buttonColor={customizations.theme.primary}
                  />
                </SheetContent>
              </Sheet>
            )}
            {!!customizations?.productsPages.sort.length && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="rounded-full gap-2"
                    size="sm"
                  >
                    <SortAscIcon size={18} />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-3">
                  <DropdownMenuLabel>Sorting</DropdownMenuLabel>
                  {customizations.productsPages.sort.map((s, idx) => (
                    <DropdownMenuItem key={idx} className="capitalize">
                      {sortIcons[s]}
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <div className="mt-10">
          <GridDisplay
            isLoading={[isLoading, isRefetching]}
            products={productData?.products || []}
            onRefresh={() => refetch()}
          />
        </div>
        <PaginationFooter
          maxPagination={Math.ceil((productData?.totalProducts || 20) / 20)}
        />
      </Section>
    </div>
  );
};

export default StoreProducts;
