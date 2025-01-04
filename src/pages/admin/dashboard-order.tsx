"use client";

import * as React from "react";
import {
  ArrowDownUp,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  ChevronUp,
  Logs,
  MoreVertical,
  PlusIcon,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  addEllipseToText,
  addQueryParameter,
  cn,
  formatAmountToNaira,
  generateRandomString,
  getInitials,
  getOrderProductCount,
  storeBuilder,
} from "@/lib/utils";
import { PaginationFooter } from "@/components/pagination-footer";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IOrderStatus, PATHS } from "@/types";
import { useToastError } from "@/hooks/use-toast-error";
import { EmptyProductState } from "@/components/empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OrdersLoading from "@/components/loaders/orders-loading";

const statusColors: Record<IOrderStatus, any> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
  Processing: "",
  Shipped: "",
};

export default function DashboardOrders() {
  const location = useLocation();
  const n = useNavigate();
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
  const filterScrollRef = React.useRef<HTMLDivElement>(null);
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

  const toggleRow = (orderId: string) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const onFilterChange = (newFilter: IOrderStatus | "All") => {
    n("?" + addQueryParameter("filter", newFilter));
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["orders", searchQuery, startDate, endDate, filter, asc, page],
    queryFn: () =>
      storeBuilder.getOrders(
        searchQuery,
        10 * page,
        undefined,
        asc,
        filter,
        startDate?.toISOString(),
        endDate?.toISOString()
      ),
  });

  const { data: order } = data || {};

  console.log(data);

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
    <div className="w-full container mx-auto p-4 space-y-8">
      <motion.header
        className="flex w-full items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Orders</h1>
        <Button asChild size="sm" variant="ringHover" className="gap-2">
          <Link
            to={PATHS.STORE_ORDERS + generateRandomString(18) + "/create/#new"}
          >
            <PlusIcon size={18} />
            Create Order
          </Link>
        </Button>
      </motion.header>

      <motion.div
        className="flex flex-col space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div
          ref={filterScrollRef}
          onWheel={handleWheel}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {filters.map((item) => (
            <Button
              key={item.label}
              size="sm"
              variant={filter === item.label ? "default" : "outline"}
              className="gap-2 shrink-0 rounded-none"
              onClick={() => onFilterChange(item.label)}
            >
              {item.label}
              <Badge variant="secondary" className="hover:bg-purple-900">
                {item.value}
              </Badge>
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full">
            <div className="w-full flex items-center gap-3">
              <Calendar size={21} className="text-gray-500" />
              <Input
                type="date"
                value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  setStartDate(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                className="w-full"
              />
            </div>
            <div className="w-full flex items-center gap-3">
              <span className="hidden md:inline">To</span>
              <Calendar size={21} className="text-gray-500" />
              <Input
                type="date"
                value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  setEndDate(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                className="w-full"
              />
            </div>
          </div>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search customer or order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
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
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead
                      onClick={() =>
                        n("?" + addQueryParameter("asc", String(!Boolean(asc))))
                      }
                      className="flex items-center gap-1"
                    >
                      Order
                      {asc ? (
                        <ArrowDownUp size={16} />
                      ) : (
                        <ArrowUpDown size={16} />
                      )}
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleRow(order._id || "")}
                            aria-label={
                              expandedRow === order._id
                                ? "Collapse order details"
                                : "Expand order details"
                            }
                          >
                            {expandedRow === order._id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {order._id}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {addEllipseToText(
                                order.customerDetails.name || "",
                                11
                              )}
                            </span>
                            <span
                              title={order?.customerDetails?.email}
                              className="text-sm text-gray-500"
                            >
                              {addEllipseToText(
                                order.customerDetails.email,
                                12
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt || "").toLocaleDateString()}
                        </TableCell>
                        <TableCell>{order.products.length}</TableCell>
                        <TableCell>
                          {formatAmountToNaira(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              statusColors[order.orderStatus],
                              "rounded-md"
                            )}
                          >
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={PATHS.STORE_ORDERS + order._id}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {" "}
                                <Link
                                  to={
                                    PATHS.STORE_ORDERS +
                                    order._id +
                                    "/create/#edit"
                                  }
                                >
                                  Edit Order
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>Delete Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                      <AnimatePresence>
                        {expandedRow === order._id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TableCell colSpan={8}>
                              <motion.div
                                className="space-y-4 p-4"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.05 }}
                              >
                                {order.products.map((product, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: index * 0.05,
                                    }}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="h-16 w-16 overflow-hidden rounded-lg border">
                                        <Avatar className="h-full w-full object-cover rounded-md">
                                          <AvatarImage
                                            className=""
                                            src={product.media[0]?.url}
                                            alt={
                                              product.media[0]?.altText ||
                                              product.productName
                                            }
                                          />
                                          <AvatarFallback className="rounded-md w-full">
                                            {getInitials(product.productName)}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">
                                          {product.productName}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                          SKU: {product.stockQuantity}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                      <div className="text-right">
                                        <p className="font-medium">Quantity</p>
                                        <p className="text-gray-500">
                                          x
                                          {getOrderProductCount(
                                            order.products || [],
                                            product._id || ""
                                          )}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">Price</p>
                                        <p className="text-gray-500">
                                          {formatAmountToNaira(
                                            product.price.default
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </TableCell>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <EmptyProductState icon={Logs} header="No orders found">
            <Button variant="ringHover" asChild className="gap-2">
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
