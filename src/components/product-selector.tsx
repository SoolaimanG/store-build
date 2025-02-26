import { useState, useEffect, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  cn,
  formatAmountToNaira,
  generateRandomString,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { PackageSearch, PlusIcon, Search } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useQuery } from "@tanstack/react-query";
import { useStoreBuildState } from "@/store";
import { IProduct, PATHS } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { EmptyProductState } from "./empty";
import { Link } from "react-router-dom";

interface ProductSelectorProps {
  onSelect: (selectedProducts: IProduct[]) => void;
  products?: IProduct[];
  children: ReactNode;
}

export function ProductSelector({
  onSelect,
  children,
  products: initialProducts = [],
}: ProductSelectorProps) {
  const { user } = useStoreBuildState();
  const [selectedProducts, setSelectedProducts] =
    useState<IProduct[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => storeBuilder.getProducts(user?.storeId || ""),
  });

  const { data: products } = data || {};

  const filteredProducts = products?.products?.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product: IProduct) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedProducts);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const content = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className={cn(!isDesktop && "flex-grow h-[450px]")}>
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-4 p-4",
            !filteredProducts?.length && "flex items-center justify-center"
          )}
        >
          {!filteredProducts?.length ? (
            <EmptyProductState icon={PackageSearch}>
              <Button variant="ringHover" className="rounded-none" asChild>
                <Link
                  to={PATHS.STORE_PRODUCTS + generateRandomString(13) + "#new"}
                  className=""
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Create Product
                </Link>
              </Button>
            </EmptyProductState>
          ) : (
            filteredProducts?.map((product) => (
              <Button
                key={product._id}
                variant="outline"
                className={cn(
                  "h-auto flex flex-col items-start p-4 space-y-2 transition-all",
                  selectedProducts.some((p) => p._id === product._id) &&
                    "border-primary bg-primary/30"
                )}
                onClick={() => handleProductClick(product)}
              >
                <div className="relative w-full mb-2">
                  <Avatar className="rounded-md aspect-square w-full h-[17rem]">
                    <AvatarImage
                      src={product.media[0].url}
                      alt={product.productName}
                      className="w-full h-full rounded-md object-cover"
                    />
                    <AvatarFallback className="rounded-md">
                      {getInitials(product.productName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="font-semibold">{product.productName}</span>
                <span className="text-sm text-muted-foreground">
                  {formatAmountToNaira(product.price.default)}
                </span>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
      {!isDesktop && (
        <div className="p-4 border-t">
          <Button
            variant="ringHover"
            onClick={handleConfirm}
            className="w-full"
          >
            Confirm Selection ({selectedProducts.length})
          </Button>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Select Products</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[420px]">{content}</ScrollArea>
          <DialogFooter>
            <div className="p-4 border-t w-full">
              <Button
                variant="ringHover"
                onClick={handleConfirm}
                className="w-full"
              >
                Confirm Selection ({selectedProducts.length})
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Products</DrawerTitle>
        </DrawerHeader>
        {content}
      </DrawerContent>
    </Drawer>
  );
}
