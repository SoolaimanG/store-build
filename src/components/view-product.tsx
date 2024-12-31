import React from "react";
import { Button } from "@/components/ui/button";
import { IProduct, PATHS } from "@/types";
import { formatAmountToNaira, storeBuilder } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Edit3Icon, Package, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";

interface ViewProductDialogProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

interface StockStatus {
  label: string;
  color: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  badge?: {
    label: string;
    color: string;
  };
  icon: React.ElementType;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

export function ViewProductDialog({
  product,
  isOpen,
  onClose,
}: ViewProductDialogProps): React.ReactElement | null {
  const { data: _data, error } = useQuery({
    queryKey: ["product-analytics", product?._id],
    queryFn: () => storeBuilder.getProductAnalytics(product?._id || ""),
    enabled: Boolean(product?._id) && isOpen,
  });

  const { data } = _data || {};

  useToastError(error);

  if (!product) return null;

  const salesData = data?.saleData || [];

  const getStockStatus = (level: number): StockStatus => {
    if (level <= 10) return { label: "Low Stock", color: "text-red-500" };
    if (level <= 30) return { label: "Medium Stock", color: "text-yellow-500" };
    return { label: "In Stock", color: "text-green-500" };
  };

  const stockStatus = getStockStatus(product.stockQuantity);

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    badge,
    icon: Icon,
  }) => (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {badge && (
              <Badge
                variant="outline"
                className={`mt-2 rounded-md ${badge.color}`}
              >
                {badge.label}
              </Badge>
            )}
          </div>
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const OverviewTab: React.FC = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <MetricCard
          title="Current Stock"
          value={product.stockQuantity}
          badge={stockStatus}
          icon={Package}
        />
        <MetricCard
          title="Total Sales"
          value={data?.totalSales || 0}
          badge={{ label: "Last 6 Months", color: "text-blue-500" }}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Revenue"
          value={formatAmountToNaira(data?.totalRevenue || 0)}
          badge={{ label: "Last 6 Months", color: "text-green-500" }}
          icon={DollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  name="Sales"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AnalyticsTab: React.FC = () => (
    <div className="space-y-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Average Order Value
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {formatAmountToNaira(data?.averageOrderValue || 0)}
              </h3>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Return Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {(data?.returnRate || 0).toFixed(1)}%
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales vs Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                  <Bar dataKey="returns" fill="#ff7c7c" name="Returns" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:max-w-[80%] lg:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{product.productName}</SheetTitle>
          <SheetDescription>Product ID: {product._id}</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <div>
                <Link to={PATHS.STORE_PRODUCTS + product._id + "#edit"}>
                  <Button variant="ghost" size="icon">
                    <Edit3Icon size={19} />
                  </Button>
                </Link>
              </div>
            </div>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsTab />
            </TabsContent>
            <TabsContent value="details">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Price:</span>
                  <span className="col-span-3">
                    {formatAmountToNaira(product.price.default)}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Type:</span>
                  <span className="col-span-3">
                    {product.isDigital ? "Digital" : "Physical"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Stock:</span>
                  <span className="col-span-3">
                    {product.stockQuantity} / {product.maxStock}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-3">
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <SheetFooter>
          <Button onClick={onClose} className="mt-3">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
