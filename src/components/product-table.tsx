import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { IProduct, PATHS } from "@/types";
import { useState } from "react";
import { ViewProductDialog } from "./view-product";
import { ConfirmationModal } from "./confirmation-modal";
import { UpdateStockDialog } from "./update-product";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useStoreBuildState } from "@/store";

interface ProductTableProps {
  products: IProduct[];
  onSort: (sort: "low-to-high" | "high-to-low") => void;
  currentSort?: "low-to-high" | "high-to-low";
}

export function ProductTable({
  products,
  onSort,
  currentSort,
}: ProductTableProps) {
  const queryClient = useQueryClient();
  const { user } = useStoreBuildState();
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isUpdateStockDialogOpen, setIsUpdateStockDialogOpen] = useState(false);
  const [isPending, startTransition] = useState(false);

  const getSortIcon = () => {
    if (!currentSort) return null;
    return currentSort === "low-to-high" ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    );
  };

  const invalidateProduct = () => {
    queryClient.invalidateQueries({
      queryKey: ["products", user?.storeId, location.search],
    });
  };

  const handleProductStatusChange = async (e: boolean, product: IProduct) => {
    try {
      startTransition(true);
      const res = await storeBuilder.createOrEditProduct({
        ...product,
        isActive: e,
      });

      invalidateProduct();

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      startTransition(true);
      const res = await storeBuilder.deleteProduct(selectedProduct?._id || "");

      setIsConfirmationModalOpen(false);
      invalidateProduct();

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);

      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Media</TableHead>
            <TableHead className="min-w-[200px]">Product</TableHead>
            <TableHead
              className="cursor-pointer flex items-center"
              onClick={() =>
                onSort(
                  currentSort === "low-to-high" ? "high-to-low" : "low-to-high"
                )
              }
            >
              Price {getSortIcon()}
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="hidden md:table-cell">Variants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                <Avatar className="h-14 w-14 rounded-md object-cover">
                  <AvatarImage
                    src={product.media[0]?.url}
                    alt={product.media[0]?.altText || product.productName}
                  />
                  <AvatarFallback>
                    {getInitials(product.productName)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{product.productName}</span>
                  <span className="text-sm text-muted-foreground">
                    {product._id}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.gender.map((g) => (
                      <Badge
                        key={g}
                        variant="secondary"
                        className="text-xs bg-slate-800 rounded-sm"
                      >
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatAmountToNaira(product.price.default)}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-sm text-green-600">
                      {product.discount}% off
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className="bg-slate-900 rounded-md"
                  variant={product.isDigital ? "default" : "secondary"}
                >
                  {product.isDigital ? "Digital" : "Physical"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="md:text-sm text-[13px]">
                    {product.stockQuantity + "/" + product.maxStock}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        {product.availableSizes.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {product.availableSizes.length} sizes
                          </Badge>
                        )}
                        {product.availableColors.length > 0 && (
                          <div className="flex -space-x-1">
                            {product?.availableColors?.map((color) => (
                              <div
                                key={color.name}
                                className="h-4 w-4 rounded-full border-2 border-slate-800"
                                style={{
                                  backgroundColor: color.colorCode,
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-2">
                        {product.availableSizes.length > 0 && (
                          <div>Sizes: {product.availableSizes.join(", ")}</div>
                        )}
                        {product.availableColors.length > 0 && (
                          <div>
                            Colors:{" "}
                            {product.availableColors
                              .map((c) => c.name)
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <Switch
                  checked={product.isActive}
                  disabled={isPending}
                  onCheckedChange={(e) => handleProductStatusChange(e, product)}
                />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Open menu</span>
                      <SlidersHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <Link to={PATHS.STORE_PRODUCTS + product._id + "#edit"}>
                      <DropdownMenuItem>Edit product</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsUpdateStockDialogOpen(true);
                      }}
                    >
                      Update stock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={isPending}
                      className="text-red-600"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsConfirmationModalOpen(true);
                      }}
                    >
                      Delete product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ViewProductDialog
        product={selectedProduct}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
      <ConfirmationModal
        product={selectedProduct}
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeleteProduct}
      />
      <UpdateStockDialog
        product={selectedProduct}
        isOpen={isUpdateStockDialogOpen}
        onClose={() => setIsUpdateStockDialogOpen(false)}
      />
    </div>
  );
}
