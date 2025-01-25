import { FC, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Copy,
  DollarSign,
  FileText,
  CreditCard,
  ShoppingCart,
  Download,
  Plus,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  copyToClipboard,
  formatAmountToNaira,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { Customer, ICustomerStats, IOrder, PATHS } from "@/types";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerFilters } from "@/components/customer-filters";

interface CustomerTableProps {
  selectedCustomers: string[];
  onSelectedCustomersChange: (customers: string[]) => void;
  customers: Customer[];
  isLoading: boolean;
}

const PAGE_SIZE = 10;

const DashboardCustomers = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCustomer, setSortCustomer] = useState("");

  const { isLoading, data, error } = useQuery({
    queryKey: ["customers", currentPage, PAGE_SIZE, searchTerm, sortCustomer],
    queryFn: () =>
      storeBuilder.getCustomers(
        searchTerm,
        currentPage,
        PAGE_SIZE,
        sortCustomer
      ),
  });

  const { data: __data } = data || {};

  const { totalPages = 1 } = __data || {};

  useToastError(error);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-3 space-y-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-md">
            <Download className="w-4 h-4 mr-2" />
            Export Customers
          </Button>
        </div>
      </motion.div>

      <CustomerStats
        customerStats={__data?.customerStats || []}
        isLoading={isLoading}
      />

      <CustomerFilters onSearch={handleSearch} onSortSelect={setSortCustomer} />

      <CustomerTable
        customers={__data?.customers || []}
        selectedCustomers={selectedCustomers}
        onSelectedCustomersChange={setSelectedCustomers}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          {totalPages > 2 && (
            <div className="flex items-center gap-1">
              {[...Array(Math.min(3, totalPages))].map((_, idx) => {
                const pageNumber =
                  currentPage === 1
                    ? idx + 1
                    : currentPage === totalPages
                    ? totalPages - 2 + idx
                    : currentPage - 1 + idx;
                return (
                  <Button
                    key={idx}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                    className="w-8"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

function CustomerStats({
  customerStats,
  isLoading,
}: {
  customerStats: ICustomerStats[];
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid gap-4 md:grid-cols-3"
    >
      {isLoading
        ? Array(3)
            .fill(0)
            .map((_, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))
        : customerStats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="flex items-center text-sm text-emerald-950 bg-emerald-300 px-2.5 rounded-full h-6">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    {stat.percentage || stat.formattedValue}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
    </motion.div>
  );
}

function CustomerTable({
  selectedCustomers,
  onSelectedCustomersChange,
  customers,
  isLoading,
}: CustomerTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-md border"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedCustomers.length === customers.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectedCustomersChange(
                      customers.map((customer) => customer.id)
                    );
                  } else {
                    onSelectedCustomersChange([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Purchased</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array(5)
                .fill(0)
                .map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32 mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))
            : customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className={
                    selectedCustomers.includes(customer.id)
                      ? "bg-muted/50"
                      : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onSelectedCustomersChange([
                            ...selectedCustomers,
                            customer.id,
                          ]);
                        } else {
                          onSelectedCustomersChange(
                            selectedCustomers.filter((id) => id !== customer.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?text=${customer.name[0]}`}
                        />
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.amountSpent}</TableCell>
                  <TableCell>{customer.amountSpent}</TableCell>
                  <TableCell>{customer.itemsBought}</TableCell>
                  <TableCell>
                    {new Date(customer.lastPurchase).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <CustomerDetails email={customer.email}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </CustomerDetails>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}

const CustomerDetails: FC<{ children: ReactNode; email: string }> = ({
  children,
  email,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["customer", email],
    queryFn: () => storeBuilder.getCustomer(email),
    enabled: isOpen,
  });

  const { data: _data } = data || {};

  const {
    email: customerEmail = "",
    name = "",
    phoneNumber = "",
    amountSpent = 0,
    itemsBought = 0,
    orders = [],
    createdAt = new Date().toISOString(),
  } = _data || {};

  useToastError(error);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 bg-background"
      >
        <ScrollArea className="h-full">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SheetHeader className="p-6 pb-0">
                <SheetTitle className="text-2xl">Customer Profile</SheetTitle>
                <SheetDescription>
                  Comprehensive details about the customer, their subscriptions,
                  and recent orders.
                </SheetDescription>
              </SheetHeader>
              <div className="p-6 space-y-6">
                <Card className="space-y-2">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      {isLoading ? (
                        <Skeleton className="w-12 h-12 rounded-full" />
                      ) : (
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-slate-800">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        {isLoading ? (
                          <Skeleton className="h-6 w-32" />
                        ) : (
                          <CardTitle className="text-2xl">{name}</CardTitle>
                        )}
                        {isLoading ? (
                          <Skeleton className="h-4 w-48 mt-1" />
                        ) : (
                          <CardDescription>
                            Customer since {format(createdAt, "MMMM d, yyyy")}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-4">
                      {isLoading ? (
                        <Skeleton className="h-4 w-48" />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customerEmail}</span>
                        </div>
                      )}
                      {isLoading ? (
                        <Skeleton className="h-4 w-32" />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2">
                      {isLoading ? (
                        <Skeleton className="h-9 w-28" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(customerEmail, "Email")
                          }
                        >
                          <Copy className="h-4 w-4 mr-2" /> Copy Email
                        </Button>
                      )}
                      {isLoading ? (
                        <Skeleton className="h-9 w-28" />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(phoneNumber, "Phone Number")
                          }
                        >
                          <Copy className="h-4 w-4 mr-2" /> Copy Phone
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Spent
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <div className="text-2xl font-bold">
                          {formatAmountToNaira(amountSpent)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Products Bought
                      </CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="text-2xl font-bold">{itemsBought}</div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="transactions" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                  </TabsList>
                  <AnimatePresence mode="wait">
                    <TabsContent value="transactions">
                      <motion.div
                        key="transactions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CustomerTransactionDetails
                          orders={orders}
                          isLoading={isLoading}
                        />
                      </motion.div>
                    </TabsContent>
                    <TabsContent value="payment">
                      <motion.div
                        key="payment"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CustomerPaymentDetails isLoading={isLoading} />
                      </motion.div>
                    </TabsContent>
                    <TabsContent value="orders">
                      <motion.div
                        key="orders"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CustomerOrderDetails
                          orders={orders}
                          isLoading={isLoading}
                        />
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </Tabs>
              </div>
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const CustomerTransactionDetails: FC<{
  orders: IOrder[];
  isLoading: boolean;
}> = ({ orders, isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Details</CardTitle>
        <CardDescription>
          Transaction details and status of the customer
        </CardDescription>
      </CardHeader>
      {isLoading ? (
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      ) : (
        orders.map((order) => (
          <CardContent key={order._id} className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Type</span>
              <Badge variant="secondary">Purchase</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount Paid</span>
                <span className="font-semibold">
                  {formatAmountToNaira(order.amountPaid)}
                </span>
              </div>
              <Progress value={order.amountPaid} maxValue={order.totalAmount} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>The amount you have left to pay</span>
                <span>
                  {formatAmountToNaira(order.amountLeftToPay)} /{" "}
                  {formatAmountToNaira(order.totalAmount)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Payment Type</span>
              <span>{order.paymentDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Order Id</span>
              <span className="font-mono">{order._id}</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Billing Address</h4>
              <div className="text-sm">
                <p>{order.customerDetails.shippingAddress.addressLine1}</p>
                <p>{order.customerDetails.shippingAddress.addressLine2}</p>
                <p>
                  {order.customerDetails.shippingAddress.city},{" "}
                  {order.customerDetails.shippingAddress.state}{" "}
                  {order.customerDetails.shippingAddress.postalCode}
                </p>
                <p>{order.customerDetails.shippingAddress.country}</p>
              </div>
            </div>
          </CardContent>
        ))
      )}
      <CardFooter>
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4 mr-2" /> Download Invoice
        </Button>
      </CardFooter>
    </Card>
  );
};

const CustomerPaymentDetails: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Primary card details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
              <CreditCard className="h-6 w-6" />
              <div>
                <p className="font-medium">VISA •••• 4567</p>
                <p className="text-sm text-muted-foreground">Expires 12/24</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Issuer</p>
                <p className="text-muted-foreground">VISA</p>
              </div>
              <div>
                <p className="font-medium">Country</p>
                <p className="text-muted-foreground">United States</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <CreditCard className="h-4 w-4 mr-2" /> Update Payment Method
        </Button>
      </CardFooter>
    </Card>
  );
};

const CustomerOrderDetails: FC<{ orders: IOrder[]; isLoading: boolean }> = ({
  orders,
  isLoading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Customer Orders And Details</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-auto">
          {isLoading ? (
            <>
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            orders.map((order, index) => (
              <div key={order._id} className="mb-6 last:mb-0">
                <h4 className="text-sm font-semibold mb-2">
                  Order #{order._id}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date:</span>
                    <span>
                      {format(new Date(order?.createdAt || ""), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline">{order.orderStatus}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total:</span>
                    <span>{formatAmountToNaira(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className="text-sm font-semibold mb-2">Products:</h5>
                  <div className="space-y-2">
                    {order.products.map((product, productIndex) => (
                      <div
                        key={productIndex}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={
                              product.media[0]?.url ||
                              `/placeholder.svg?height=40&width=40`
                            }
                            alt={
                              product.media[0]?.altText || product.productName
                            }
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium">
                            {product.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {product._id}
                          </p>
                        </div>
                        <div className="text-sm">Qty: {product.maxStock}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="mt-3 w-full"
                >
                  <Link to={PATHS.STORE_ORDERS + order._id}> View Order</Link>
                </Button>
                {index < orders.length - 1 && <Separator className="my-4" />}
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardCustomers;
