import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterIcon,
  Package2,
  Package2Icon,
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
import { ProductFiltersForm } from "@/components/product-filter-form";
import { ProductStats } from "@/components/product-stats";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/product-table";
import { EmptyProductState } from "@/components/empty";
import { PaginationFooter } from "@/components/pagination-footer";

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
  const priceRange = { min: 0, max: 1000 };
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = queryString.parse(location.search);

  const { data, error, isLoading } = useQuery({
    queryKey: ["products", user?.storeId, location.search],
    queryFn: () =>
      storeBuilder.getProducts(user?.storeId || "", {
        q: queryParams.q as string | undefined,
        sort: queryParams.sort as "default",
        category: queryParams.category as string,
        minPrice: queryParams.minPrice
          ? parseFloat(queryParams.minPrice as string)
          : undefined,
        maxPrice: queryParams.maxPrice
          ? parseFloat(queryParams.maxPrice as string)
          : undefined,
        size: queryParams.size
          ? parseInt(queryParams.size as string, 10)
          : undefined,
      }),
    enabled: Boolean(user?.storeId),
  });

  useToastError(error);

  const products = data?.data?.products || [];

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

  const max =
    data?.data?.products?.reduce((max, product) => {
      return product.price.default > max ? product.price.default : max;
    }, Number.NEGATIVE_INFINITY) || 20000;

  const Filters = () => (
    <motion.div
      className="flex flex-col gap-4"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {!isDesktop && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ProductFiltersForm
        onSubmit={(values) => {
          updateQueryParams(values);
          setShowFilters(false);
        }}
        initialValues={{
          q: (queryParams.q as string) || "",
          sort: queryParams.sort as
            | "default"
            | "stock-level"
            | "low-to-high"
            | "high-to-low"
            | undefined,
          category: (queryParams.category as string) || "all",
          minPrice: queryParams.minPrice
            ? parseFloat(queryParams.minPrice as string)
            : undefined,
          maxPrice: queryParams.maxPrice
            ? parseFloat(queryParams.maxPrice as string)
            : undefined,
          size: queryParams.size
            ? parseInt(queryParams.size as string, 10)
            : undefined,
        }}
        priceRange={{ ...priceRange, max }}
      />
    </motion.div>
  );

  const FilterDialog = () => {
    if (isDesktop) {
      return (
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogTitle className=" sr-only">Product Filters</DialogTitle>
            <AnimatePresence>{showFilters && <Filters />}</AnimatePresence>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={showFilters} onOpenChange={setShowFilters}>
        <DrawerContent className="py-3">
          <DrawerTitle className="sr-only">Product Filters</DrawerTitle>
          <div className="p-4">
            <AnimatePresence>{showFilters && <Filters />}</AnimatePresence>
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
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Products
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage your product inventory and track stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to={PATHS.STORE_PRODUCTS + generateRandomString(8) + "#new"}>
              <Button size="sm">
                <Package2Icon className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </motion.div>
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
        <Card>
          <CardContent className="pt-6">
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
                  <EmptyProductState>
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
