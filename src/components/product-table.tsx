"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useStoreBuildState } from "@/store";
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
  EyeIcon,
  EditIcon,
  PackageIcon,
  TrashIcon,
} from "lucide-react";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { type IProduct, PATHS } from "@/types";
import { ViewProductDialog } from "./view-product";
import { ConfirmationModal } from "./confirmation-modal";
import { UpdateStockDialog } from "./update-product";
import queryString from "query-string";

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
  const [isPending, setIsPending] = useState(false);

  const {
    colors = [],
    category,
    priceRange: _priceRange,
    rating,
  } = queryString.parse(location.search, {
    parseBooleans: true,
    parseNumbers: true,
  }) as {
    colors: string[];
    category: string;
    priceRange: number;
    rating: number;
  };

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
      queryKey: [
        "products",
        user?.storeId!,
        colors,
        category,
        rating,
        _priceRange,
      ],
    });
  };

  const handleProductStatusChange = async (e: boolean, product: IProduct) => {
    try {
      setIsPending(true);
      const res = await storeBuilder.createOrEditProduct({
        ...product,
        isActive: e,
      });

      invalidateProduct();

      toast({
        title: "Success",
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
      setIsPending(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      setIsPending(true);
      const res = await storeBuilder.deleteProduct(selectedProduct?._id!);

      setIsConfirmationModalOpen(false);
      invalidateProduct();

      toast({
        title: "Success",
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
      setIsPending(false);
    }
  };

  return (
    <div className="shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-900">
              <TableHead className="w-[100px]">Media</TableHead>
              <TableHead className="min-w-[200px]">Product</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() =>
                  onSort(
                    currentSort === "low-to-high"
                      ? "high-to-low"
                      : "low-to-high"
                  )
                }
              >
                <div className="flex items-center">Price {getSortIcon()}</div>
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
              <TableRow key={product._id} className="hover:bg-gray-900">
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
                          className="text-xs bg-slate-800 text-white rounded-sm"
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
                    className={`rounded-md ${
                      product.isDigital
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {product.isDigital ? "Digital" : "Physical"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="md:text-sm text-[13px]">
                      {product.stockQuantity + "/" + product.maxStock}
                    </span>
                    {product.stockQuantity < 10 && (
                      <Badge variant="destructive" className="text-xs">
                        Low Stock
                      </Badge>
                    )}
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
                                  className="h-4 w-4 rounded-full border-2 border-white"
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
                            <div>
                              Sizes: {product.availableSizes.join(", ")}
                            </div>
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
                    onCheckedChange={(e) =>
                      handleProductStatusChange(e, product)
                    }
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
                        <DropdownMenuItem>
                          <EditIcon className="mr-2 h-4 w-4" />
                          Edit product
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsUpdateStockDialogOpen(true);
                        }}
                      >
                        <PackageIcon className="mr-2 h-4 w-4" />
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
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ViewProductDialog
        product={selectedProduct}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />
      <ConfirmationModal
        key={isConfirmationModalOpen + ""}
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
