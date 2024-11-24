import * as React from "react";
import { Search, Plus, Grid2X2, LayoutList } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { addQueryParameter, formatAmountToNaira } from "@/lib/utils";
import { Img } from "react-image";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  maxStock: number;
  active: boolean;
}

const products: Product[] = [
  {
    id: "O8175M47",
    name: "Oversized Heritage Washed T-Shirt",
    image: "/placeholder.svg?height=100&width=100",
    price: 64.15,
    stock: 1000,
    maxStock: 1000,
    active: true,
  },
  {
    id: "O7642M5",
    name: "Sweatshirt With Hood",
    image: "/placeholder.svg?height=100&width=100",
    price: 74.34,
    stock: 583,
    maxStock: 600,
    active: true,
  },
  {
    id: "O6473M8",
    name: "Soft and Light Break",
    image: "/placeholder.svg?height=100&width=100",
    price: 54.21,
    stock: 703,
    maxStock: 1000,
    active: true,
  },
  {
    id: "O8175M45",
    name: "Bot Chelsea With for Protection",
    image: "/placeholder.svg?height=100&width=100",
    price: 30.43,
    stock: 922,
    maxStock: 1000,
    active: false,
  },
  {
    id: "O5261WS",
    name: "Shirt With Patterned Design",
    image: "/placeholder.svg?height=100&width=100",
    price: 84.24,
    stock: 738,
    maxStock: 800,
    active: false,
  },
  {
    id: "O8542WS",
    name: "Oxford Shirt",
    image: "/placeholder.svg?height=100&width=100",
    price: 64.15,
    stock: 196,
    maxStock: 300,
    active: false,
  },
  {
    id: "O9120M46",
    name: "Metallic Layer Shirt",
    image: "/placeholder.svg?height=100&width=100",
    price: 84.15,
    stock: 877,
    maxStock: 900,
    active: false,
  },
];

export default function DashboardProducts() {
  const location = useLocation();
  const n = useNavigate();
  const { view = "list" } = queryString.parse(location.search) as {
    view: "grid" | "list";
  };
  const [searchQuery, setSearchQuery] = React.useState("");

  const onViewChange = (view: "grid" | "list") => {
    n(`?${addQueryParameter("view", view)}`);
  };

  return (
    <div className="flex flex-col gap-8 p-3">
      <motion.div
        className="flex items-center gap-3 flex-wrap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center border-[1.9px] rounded-full border-slate-600">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewChange("list")}
            className="rounded-full"
          >
            <LayoutList className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewChange("grid")}
            className="rounded-full"
          >
            <Grid2X2 className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8 border-[1.9px] border-slate-600 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px] border-[1.9px] border-slate-600 rounded-full">
            <SelectValue placeholder="Show: All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show: All Products</SelectItem>
            <SelectItem value="active">Show: Active Products</SelectItem>
            <SelectItem value="inactive">Show: Inactive Products</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="default">
          <SelectTrigger className="w-[180px] border-[1.9px] border-slate-600 rounded-full">
            <SelectValue placeholder="Sort by: Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Sort by: Default</SelectItem>
            <SelectItem value="price-asc">
              Sort by: Price (Low to High)
            </SelectItem>
            <SelectItem value="price-desc">
              Sort by: Price (High to Low)
            </SelectItem>
            <SelectItem value="stock">Sort by: Stock Level</SelectItem>
          </SelectContent>
        </Select>
        <Button className="gap-2 rounded-full">
          <Plus className="h-4 w-4" /> Add new product
        </Button>
      </motion.div>
      <motion.div
        className="grid gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="border-[1.9px] border-slate-600 rounded-md">
              <SelectValue placeholder="Category: All Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All Collection</SelectItem>
              <SelectItem value="shirts">Category: Shirts</SelectItem>
              <SelectItem value="pants">Category: Pants</SelectItem>
              <SelectItem value="accessories">Category: Accessories</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="50-100">
            <SelectTrigger className="border-[1.9px] border-slate-600 rounded-md">
              <SelectValue placeholder="Price: $50 - $100" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-50">Price: $0 - $50</SelectItem>
              <SelectItem value="50-100">Price: $50 - $100</SelectItem>
              <SelectItem value="100-150">Price: $100 - $150</SelectItem>
              <SelectItem value="150+">Price: $150+</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="border-[1.9px] rounded-md" variant="outline">
                All Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>No Active</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select defaultValue="all">
            <SelectTrigger className="border-[1.9px] border-slate-600 rounded-md">
              <SelectValue placeholder="Store: All Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Store: All Collection</SelectItem>
              <SelectItem value="online">Store: Online</SelectItem>
              <SelectItem value="retail">Store: Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border bg-card">
          <AnimatePresence mode="wait">
            <div className="grid">
              {products.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={product.id}
                  className={`grid grid-cols-1 gap-4 cursor-pointer p-4 sm:grid-cols-2 md:grid-cols-[auto_1fr_100px_100px_80px] md:items-center ${
                    index !== products.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                    <div className="grid gap-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {product.id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end md:flex-row md:justify-between">
                    <div className="flex items-center gap-1">
                      <div className="font-medium md:hidden">Price:</div>
                      <div className="font-medium">
                        {formatAmountToNaira(product.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:hidden">
                      <div className="font-medium">Status:</div>
                      <Switch checked={product.active} />
                    </div>
                  </div>
                  <div className="hidden md:block" />
                  <div className="flex items-center gap-2">
                    <div className="font-medium md:hidden">Stock:</div>
                    <div className="text-sm">{product.stock}</div>
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-muted">
                        <StockProgress
                          maxStock={product.maxStock}
                          stock={product.stock}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Switch checked={product.active} />
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

const StockProgress: React.FC<{ maxStock: number; stock: number }> = (
  product
) => {
  return (
    <div
      className={`h-[6px] rounded-full ${
        product.stock / product.maxStock > 0.6
          ? "bg-green-500"
          : product.stock / product.maxStock > 0.3
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
      style={{
        width: `${(product.stock / product.maxStock) * 100}%`,
      }}
    />
  );
};
