import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2Icon, Cloud, ArrowDownIcon, Box } from "lucide-react";

interface ProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  digitalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export function ProductStats({
  totalProducts,
  activeProducts,
  digitalProducts,
  lowStockProducts,
  outOfStockProducts,
}: ProductStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package2Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            Active: {activeProducts}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Digital Products
          </CardTitle>
          <Cloud className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{digitalProducts}</div>
          <p className="text-xs text-muted-foreground">
            {((digitalProducts / totalProducts) * 100 || 0).toFixed(0)}% of
            total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockProducts}</div>
          <p className="text-xs text-muted-foreground">
            Below 20% of max stock
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{outOfStockProducts}</div>
          <p className="text-xs text-muted-foreground">Needs reordering</p>
        </CardContent>
      </Card>
    </div>
  );
}
