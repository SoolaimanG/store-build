import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  LogInIcon as Logs,
  PackageSearch,
  Plus,
  PlusCircle,
  PlusIcon,
  Search,
  Timer,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  addQueryParameter,
  cn,
  formatAmountToNaira,
  generateRandomString,
  storeBuilder,
} from "@/lib/utils";
import { PaginationFooter } from "@/components/pagination-footer";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { type IOrderStatus, PATHS } from "@/types";
import { useToastError } from "@/hooks/use-toast-error";
import { EmptyProductState } from "@/components/empty";
import OrdersLoading from "@/components/loaders/orders-loading";
import { OrderStats } from "@/components/order-stats";
import { Text } from "@/components/text";
import { useMediaQuery } from "@uidotdev/usehooks";
import { DatePickerWithRange } from "@/components/ui/range-date-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useStoreBuildState } from "@/store";

const statusColors: Record<IOrderStatus, any> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
  Processing: "",
  Shipped: "",
};

const SORTS = [
  {
    value: "recent-orders",
    label: "Recent Orders",
    icon: Timer,
  },
  {
    value: "highest-orders",
    label: "Highest Order",
    icon: ArrowUp,
  },
  {
    value: "lowest-orders",
    label: "Lowest Orders",
    icon: ArrowDown,
  },
  {
    value: "more-products",
    label: "More Products",
    icon: PackageSearch,
  },
];

export default function DashboardOrders() {
  const { user } = useStoreBuildState();
  const isMobile = useMediaQuery("(max-width:767px)");
  const location = useLocation();
  const n = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: addDays(new Date(), 20),
  });
  const {
    filter = "All",
    page = 1,
    asc = true,
  } = queryString.parse(location.search, {
    parseNumbers: true,
    parseBooleans: true,
  }) as {
    filter: IOrderStatus | "All";
    page?: number;
    asc?: boolean;
  };

  React.useEffect(() => {
    if (!user?.createdAt) return;
    setDate({ ...date, from: new Date(user?.createdAt!) });
  }, [user?.createdAt]);

  const [sorts, setSorts] = React.useState<string[]>([]);

  const handleFilterSelect = (filter: string) => {
    setSorts((prev) =>
      !prev.includes(filter)
        ? [...prev, filter]
        : prev.filter((p) => p !== filter)
    );
  };

  const onFilterChange = (newFilter: IOrderStatus | "All") => {
    n("?" + addQueryParameter("filter", newFilter));
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["orders", searchQuery, date, filter, asc, page, sorts],
    queryFn: () =>
      storeBuilder.getOrders(
        searchQuery,
        0,
        10 * page,
        asc,
        filter,
        date?.from?.toISOString(),
        date?.to?.toISOString(),
        sorts.join(",")
      ),
    enabled: Boolean(user?.createdAt),
  });

  const { data: order } = data || {};

  const filters: {
    label: IOrderStatus | "All";
    value: number;
  }[] = [
    { label: "All", value: order?.orderStatusCount.All || 0 },
    { label: "Pending", value: order?.orderStatusCount.Pending || 0 },
    { label: "Completed", value: order?.orderStatusCount.Completed || 0 },
    { label: "Cancelled", value: order?.orderStatusCount.Cancelled || 0 },
    { label: "Refunded", value: order?.orderStatusCount.Refunded || 0 },
  ];

  useToastError(error);

  return (
    <div className="w-full container mx-auto p-4 space-y-8 overflow-hidden">
      {/* Order Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">Orders</h2>
        <Link
          to={PATHS.STORE_ORDERS + generateRandomString(18) + "/create/#new"}
        >
          <Button variant="ringHover" className="rounded-none gap-2">
            <Plus size={18} />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Order Body */}
      <div className="w-full space-y-6">
        {/* Order Stats */}
        <OrderStats />

        <div className="flex gap-1 border-b overflow-auto">
          <motion.div className="relative">
            <Button
              variant={filter === "All" ? "default" : "ghost"}
              className={cn(
                "relative h-9 rounded-none bg-slate-950 hover:bg-slate-950 hover:text-primary border-b-2 border-transparent px-2",
                filter === "All" && "font-bold text-primary"
              )}
              onClick={() => onFilterChange("All")}
            >
              All Orders
              <Badge
                variant={filter === "All" ? "default" : "secondary"}
                className={cn(
                  "ml-2 rounded-sm",
                  filter !== "All" && "bg-slate-800"
                )}
              >
                {order?.orderStatusCount.All || 0}
              </Badge>
            </Button>
            {filter === "All" && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}{" "}
          </motion.div>
          {filters.slice(1).map((item) => (
            <motion.div key={item.label} className="relative">
              <Button
                variant={filter === item.label ? "default" : "ghost"}
                className={cn(
                  "relative h-9 rounded-none border-b-2 bg-slate-950 hover:bg-slate-950 hover:text-primary border-transparent px-2",
                  filter === item.label && "font-bold text-primary"
                )}
                onClick={() => onFilterChange(item.label)}
              >
                {item.label}
                <Badge
                  variant={filter === item.label ? "default" : "secondary"}
                  className={cn(
                    "ml-2 rounded-sm",
                    filter !== item.label && "bg-slate-800"
                  )}
                >
                  {item.value}
                </Badge>
              </Button>
              {filter === item.label && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}{" "}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="flex flex-col space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Find order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-none"
              />
            </div>
            <DatePickerWithRange date={date} setDate={setDate}>
              <Button variant="ringHover" size="sm" className="rounded-none">
                <Calendar className="h-4 w-4" />
              </Button>
            </DatePickerWithRange>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-none space-x-2 bg-slate-900 border border-dashed border-gray-700 px-3"
                  >
                    <div className="gap-2 flex items-center">
                      <PlusCircle className="h-4 w-4" />
                      Sorts
                    </div>
                    {sorts.length >= 3 && (
                      <React.Fragment>
                        <div className="h-full border border- w-1 ml-2" />
                        <Text>{sorts.length}</Text>
                      </React.Fragment>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="space-y-1">
                  {SORTS.map((filter, idx) => (
                    <DropdownMenuItem
                      className={cn(
                        sorts.includes(filter.value) && "bg-accent"
                      )}
                      onClick={() => handleFilterSelect(filter.value)}
                      key={idx}
                    >
                      <filter.icon />
                      {filter.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {sorts.length > 0 && (
                <Button
                  onClick={() => setSorts([])}
                  size="sm"
                  variant="ghost"
                  className="gap-2 rounded-none"
                >
                  Reset
                  <X size={17} />
                </Button>
              )}
            </div>
          </div>
          <div className="space-x-2">
            {sorts.length < 3 &&
              sorts.map((f, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="secondary"
                  className="gap-2 rounded-none capitalize"
                >
                  {f}
                </Button>
              ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {isLoading ? (
          <OrdersLoading />
        ) : order?.orders && order.orders.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead>Customer</TableHead>
                    {!isMobile && <TableHead>Priority</TableHead>}
                    <TableHead>Total</TableHead>
                    {!isMobile && <TableHead>Payment status</TableHead>}
                    <TableHead>Items</TableHead>
                    {!isMobile && <TableHead>Delivery number</TableHead>}
                    <TableHead>Order status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orders.map((order) => (
                    <TableRow
                      onClick={() =>
                        n(PATHS.STORE_ORDERS + order._id, {
                          viewTransition: true,
                          flushSync: false,
                        })
                      }
                      key={order._id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        #{order._id}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt || "").toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`${PATHS.STORE_CUSTOMERS}?q=${order.customerDetails.name}`}
                          className="text-blue-500 hover:underline"
                        >
                          {order.customerDetails.name}
                        </Link>
                      </TableCell>
                      {!isMobile && <TableCell>{"Normal"}</TableCell>}
                      <TableCell>
                        {formatAmountToNaira(order.totalAmount)}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Badge
                            variant={
                              order.paymentDetails.paymentStatus === "paid"
                                ? "default"
                                : "secondary"
                            }
                            className="rounded-sm"
                          >
                            {order.paymentDetails.paymentStatus}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>{order.products.length} items</TableCell>
                      {!isMobile && (
                        <TableCell>
                          {order.shippingDetails.trackingNumber || "-"}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            statusColors[order.orderStatus],
                            "rounded-sm"
                          )}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <EmptyProductState icon={Logs} header="No Orders Found">
            <Button
              size="lg"
              variant="ringHover"
              asChild
              className="gap-2 rounded-none"
            >
              <Link
                to={
                  PATHS.STORE_ORDERS + generateRandomString(18) + "/create/#new"
                }
              >
                <PlusIcon size={18} />
                Create Order
              </Link>
            </Button>
          </EmptyProductState>
        )}
      </motion.div>

      {order?.orders && order.orders.length > 0 && !isLoading && (
        <PaginationFooter />
      )}
    </div>
  );
}
