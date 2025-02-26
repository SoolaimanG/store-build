import * as React from "react";
import { motion } from "framer-motion";
import {
  FilterIcon,
  Package2,
  Package2Icon,
  PackageSearch,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";

import { useMediaQuery } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { generateRandomString, storeBuilder } from "@/lib/utils";
import { useStoreBuildState } from "@/store";
import { PATHS } from "@/types";
import { useToastError } from "@/hooks/use-toast-error";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductPageLoader from "@/components/loaders/product-page-loader";
import queryString from "query-string";
import { ProductStats } from "@/components/product-stats";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/product-table";
import { EmptyProductState } from "@/components/empty";
import { PaginationFooter } from "@/components/pagination-footer";
import ProductFilter from "@/store/store-product-filter";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 },
};

export default function ProductsPage() {
  const { user } = useStoreBuildState();
  const [showFilters, setShowFilters] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = queryString.parse(location.search);

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

  const { isLoading, data, error } = useQuery({
    queryKey: [
      "products",
      user?.storeId!,
      colors,
      category,
      rating,
      _priceRange,
    ],
    queryFn: () =>
      storeBuilder.getProducts(user?._id!, {
        category,
        colors: Array.isArray(colors) ? colors : [colors],
        rating,
        sizes,
        sort: "default",
        maxPrice: _priceRange,
        size: 20 * Number(page),
      }),
  });

  useToastError(error);

  const products = data?.data?.products || [];

  const { data: productData } = data || {};

  if (isLoading) return <ProductPageLoader />;

  const updateQueryParams = (newParams: Record<string, any>) => {
    const currentParams = queryString.parse(location.search);
    const updatedParams = { ...currentParams, ...newParams };
    Object.keys(updatedParams).forEach(
      (key) => updatedParams[key] === undefined && delete updatedParams[key]
    );
    const newSearch = queryString.stringify(updatedParams);
    navigate(`${location.pathname}?${newSearch}`);
  };

  const Filters = () => (
    <motion.div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        {!isDesktop && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(false)}
            className="rounded-full"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ProductFilter
        priceRange={productData?.filters.priceRange}
        sizes={productData?.filters.allSizes || []}
        colors={productData?.filters.allColors!}
        className="md:h-[450px] h-[500px]"
        buttonColor={""}
        storeId={user?.storeId!}
      />
    </motion.div>
  );

  const FilterDialog = () => {
    if (isDesktop) {
      return (
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle className=" sr-only">Product Filters</DialogTitle>
            <Filters />
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={showFilters} onOpenChange={setShowFilters}>
        <DrawerContent className="py-3">
          <DrawerTitle className="sr-only">Product Filters</DrawerTitle>
          <div className="p-4">
            <Filters />
          </div>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <motion.div
      className="flex container mx-auto flex-col gap-4 p-4 md:gap-8 md:p-8"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        variants={fadeInUp}
      >
        <div>
          <h1 className="tracking-tight text-4xl">Products</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage your product inventory and track stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(true)}
          >
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Link to={PATHS.STORE_PRODUCTS + generateRandomString(8) + "#new"}>
            <Button variant="ringHover" size="sm">
              <Package2Icon className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <ProductStats
          totalProducts={data?.data.totalProducts || 0}
          activeProducts={products?.filter((p) => p.isActive).length || 0}
          digitalProducts={data?.data.digitalProducts || 0}
          lowStockProducts={data?.data.lowStockProducts || 0}
          outOfStockProducts={data?.data.outOfStockProducts || 0}
        />
      </motion.div>

      <FilterDialog />

      <motion.div variants={fadeInUp}>
        <Card className="p-1 md:p-2">
          <CardContent className="pt-6 p-2">
            <div className="flex flex-col gap-4">
              <motion.div
                className="flex w-full items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={(queryParams.q as string) || ""}
                  onChange={(e) => {
                    updateQueryParams({ q: e.target.value || undefined });
                  }}
                  className="w-full"
                />
              </motion.div>

              <motion.div
                className="overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {!!products.length ? (
                  <ProductTable
                    products={products}
                    onSort={(sort) => updateQueryParams({ sort })}
                    currentSort={queryParams.sort as "low-to-high"}
                  />
                ) : (
                  <EmptyProductState icon={PackageSearch}>
                    <Link
                      to={
                        PATHS.STORE_PRODUCTS + generateRandomString(8) + "#new"
                      }
                    >
                      <Button variant="ringHover">
                        <Package2 className="mr-2 h-4 w-4" />
                        Add Your First Product
                      </Button>
                    </Link>
                  </EmptyProductState>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <PaginationFooter
        maxPagination={Math.floor(data?.data.totalProducts || 10 / 10)}
      />
    </motion.div>
  );
}
