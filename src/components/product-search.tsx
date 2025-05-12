import { ReactNode, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebounce } from "@uidotdev/usehooks";
import { useStoreBuildState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { Img } from "react-image";
import { useToastError } from "@/hooks/use-toast-error";
import { renderIcon } from "./icon-renderer";
import { Link } from "react-router-dom";
import { menu } from "@/constants";

export function ProductSearchDialog({
  children,
  open: isOpen = false,
}: {
  children: ReactNode;
  open?: boolean;
}) {
  const [open, setOpen] = useState(isOpen);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const { currentStore } = useStoreBuildState();
  const { customizations, _id = "", storeCode = "" } = currentStore || {};

  const { isLoading, data, error } = useQuery({
    queryKey: ["products", currentStore?._id, debouncedSearch],
    queryFn: () =>
      storeBuilder.getProducts(currentStore?._id!, {
        q: debouncedSearch,
        size: 5,
      }),
    enabled: Boolean(debouncedSearch),
  });

  const { data: _data } = useQuery({
    queryKey: ["categories", _id],
    queryFn: () => storeBuilder.getCategories(_id),
  });

  const { data: categories = [] } = _data || {};
  const { data: productsData } = data || {};

  useToastError(error);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle style={{ color: customizations?.theme?.primary }}>
            Search Products
          </DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search for products..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {!debouncedSearch ? (
              <CommandGroup heading="Popular Categories">
                <div className="grid md:grid-cols-2 gap-4 p-4">
                  {categories.map((category) => (
                    <CommandItem
                      key={category.name}
                      value={category.name}
                      className="cursor-pointer"
                    >
                      <Link
                        to={
                          menu(storeCode, { category: category.slot })[1].path
                        }
                        className="flex items-center gap-4 w-full  rounded-lg p-3"
                      >
                        <div className="text-2xl">
                          {renderIcon(category.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">
                            {category.productCount || 0} Item Available
                          </div>
                        </div>
                      </Link>
                    </CommandItem>
                  ))}
                </div>
              </CommandGroup>
            ) : (
              <CommandGroup>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  productsData?.products?.map((product) => (
                    <CommandItem
                      key={product._id}
                      value={product.productName}
                      className="py-3 cursor-pointer"
                    >
                      <Link
                        to={menu(storeCode)[2].path + product._id}
                        className="flex items-center w-full gap-4"
                      >
                        <Img
                          src={product.media[0]?.url}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {product.productName}
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              {"★".repeat(5)}
                            </div>
                            <span className="text-sm text-gray-500">(121)</span>
                          </div>
                        </div>
                        <div className="font-semibold">
                          {formatAmountToNaira(product.price.default)}
                        </div>
                      </Link>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export default ProductSearchDialog;
