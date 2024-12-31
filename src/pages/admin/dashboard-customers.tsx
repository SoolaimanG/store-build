import { FC, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  SlidersHorizontal,
  Search,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
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
import { copyToClipboard, formatAmountToNaira, getInitials } from "@/lib/utils";

interface CustomerTableProps {
  selectedCustomers: string[];
  onSelectedCustomersChange: (customers: string[]) => void;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  amount: string;
  amountSpent: string;
  itemsBought: number;
  lastPurchase: string;
}

interface IFilter {
  id: string;
  label: string;
  value: string;
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Olivia Rhye",
    email: "olivia@untitledui.com",
    amount: "USD $10.00",
    amountSpent: "USD $1,250.00",
    itemsBought: 25,
    lastPurchase: "2023-11-15",
  },
  {
    id: "2",
    name: "Phoenix Baker",
    email: "phoenix@untitledui.com",
    amount: "USD $15.00",
    amountSpent: "USD $975.50",
    itemsBought: 18,
    lastPurchase: "2023-11-20",
  },
  {
    id: "3",
    name: "Lana Steiner",
    email: "lana@untitledui.com",
    amount: "USD $20.00",
    amountSpent: "USD $1,750.25",
    itemsBought: 32,
    lastPurchase: "2023-11-18",
  },
];

const customer = {
  id: 216519823,
  name: "Yemi Desola",
  phone_number: "+234 123 456 7890",
  email: "yemi@example.com",
  created_at: "2020-07-15T14:31:15.000Z",
};

const cardDetails = {
  first_6digits: "232343",
  last_4digits: "4567",
  issuer: "FIRST CITY MONUMENT BANK PLC",
  country: "NIGERIA NG",
  type: "VERVE",
  token: "flw-t1nf-4676a40c7ddf5f12scr432aa12d471973-k3n",
  expiry: "02/23",
};

const subscription = {
  _id: "sub123",
  tx_ref: "TX-REF-123456",
  user: "user123",
  amountPaid: 5000,
  paymentType: "Credit Card",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  billingAddress: {
    name: "Yemi Desola",
    street: "456 Subscription Ave",
    city: "Abuja",
    state: "Federal Capital Territory",
    zipCode: "900001",
    country: "Nigeria",
  },
};

const orders = [
  {
    _id: "order123",
    storeId: "store123",
    orderStatus: "Processing",
    paymentDetails: {
      paymentStatus: "Paid",
      paymentMethod: "Credit Card",
      transactionId: "TXN-99999999",
      paymentDate: "2024-11-21T10:35:00Z",
    },
    products: [
      {
        id: "prod1",
        name: "Premium Headphones",
        quantity: 2,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "prod2",
        name: "Wireless Mouse",
        quantity: 1,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    customerDetails: {
      shippingAddress: {
        addressLine1: "123 Main Street",
        addressLine2: "Apartment 4B",
        city: "Lagos",
        state: "Lagos State",
        postalCode: "101233",
        country: "Nigeria",
      },
      email: "yemi@example.com",
      phoneNumber: "+234 123 456 7890",
      name: "Yemi Desola",
    },
    paymentMethod: "Credit Card",
    amountPaid: 15000,
    amountLeftToPay: 0,
    totalAmount: 15000,
    shippingDetails: {
      shippingMethod: "Standard",
      shippingCost: 2000,
      estimatedDeliveryDate: "2024-11-25T00:00:00Z",
      trackingNumber: "TRACK-56789",
      carrier: "DHL",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "order124",
    storeId: "store123",
    orderStatus: "Delivered",
    paymentDetails: {
      paymentStatus: "Paid",
      paymentMethod: "PayPal",
      transactionId: "TXN-88888888",
      paymentDate: "2024-10-15T14:20:00Z",
    },
    products: [
      {
        id: "prod3",
        name: "Smart Watch",
        quantity: 1,
        image: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "prod4",
        name: "Bluetooth Speaker",
        quantity: 2,
        image: "/placeholder.svg?height=40&width=40",
      },
    ],
    customerDetails: {
      shippingAddress: {
        addressLine1: "123 Main Street",
        addressLine2: "Apartment 4B",
        city: "Lagos",
        state: "Lagos State",
        postalCode: "101233",
        country: "Nigeria",
      },
      email: "yemi@example.com",
      phoneNumber: "+234 123 456 7890",
      name: "Yemi Desola",
    },
    paymentMethod: "PayPal",
    amountPaid: 22000,
    amountLeftToPay: 0,
    totalAmount: 22000,
    shippingDetails: {
      shippingMethod: "Express",
      shippingCost: 3000,
      estimatedDeliveryDate: "2024-10-20T00:00:00Z",
      trackingNumber: "TRACK-45678",
      carrier: "FedEx",
    },
    createdAt: "2024-10-15T14:20:00Z",
    updatedAt: "2024-10-20T09:15:00Z",
  },
];

const totalSpent = 37000;
const productsBought = 6;

const DashboardCustomers = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

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
            Export
          </Button>
          <Button size="sm" className="rounded-md">
            <Plus className="w-4 h-4 mr-2" />
            Add customer
          </Button>
        </div>
      </motion.div>
      <CustomerStats />
      <CustomerFilters />
      <CustomerTable
        selectedCustomers={selectedCustomers}
        onSelectedCustomersChange={setSelectedCustomers}
      />
    </motion.div>
  );
};

function CustomerStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid gap-4 md:grid-cols-3"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total customers</p>
              <p className="text-3xl font-bold">2,420</p>
            </div>
            <div className="flex items-center text-sm text-emerald-950 bg-emerald-300 px-2.5 rounded-full h-6">
              <ArrowUp className="w-4 h-4 mr-1" />
              20%
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Customers This Month
              </p>
              <p className="text-3xl font-bold">1,210</p>
            </div>
            <div className="flex items-center text-sm text-emerald-950 bg-emerald-300 px-2.5 rounded-full h-6">
              <ArrowUp className="w-4 h-4 mr-1" />
              15%
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active now</p>
              <p className="text-3xl font-bold">316</p>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} className="border-2 border-background w-8 h-8">
                  <AvatarImage src={`/placeholder.svg?text=${i}`} />
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CustomerFilters() {
  const [filters, setFilters] = useState<IFilter[]>([
    { id: "time", label: "All time", value: "all" },
    { id: "location", label: "US, AU, +4", value: "us-au-4" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const removeFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  const addFilter = (newFilter: IFilter) => {
    setFilters([...filters, newFilter]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="secondary"
            size="sm"
            className="h-8 rounded-none"
            onClick={() => removeFilter(filter.id)}
          >
            {filter.label}
            <X className="w-4 h-4 ml-2" />
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 rounded-none">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {!!filters.length ? "More" : "Apply"} filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Add filter</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.some((f) => f.id === "active")}
              onCheckedChange={(checked) => {
                if (checked) {
                  addFilter({
                    id: "active",
                    label: "Active customers",
                    value: "active",
                  });
                } else {
                  removeFilter("active");
                }
              }}
            >
              Active customers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.some((f) => f.id === "new")}
              onCheckedChange={(checked) => {
                if (checked) {
                  addFilter({
                    id: "new",
                    label: "New customers",
                    value: "new",
                  });
                } else {
                  removeFilter("new");
                }
              }}
            >
              New customers
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.some((f) => f.id === "vip")}
              onCheckedChange={(checked) => {
                if (checked) {
                  addFilter({
                    id: "vip",
                    label: "VIP customers",
                    value: "vip",
                  });
                } else {
                  removeFilter("vip");
                }
              }}
            >
              VIP customers
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-8 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </motion.div>
  );
}

function CustomerTable({
  selectedCustomers,
  onSelectedCustomersChange,
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
          {customers.map((customer) => (
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
              <TableCell>{customer.amount}</TableCell>
              <TableCell>{customer.amountSpent}</TableCell>
              <TableCell>{customer.itemsBought}</TableCell>
              <TableCell>
                {new Date(customer.lastPurchase).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <CustomerDetails>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </CustomerDetails>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between px-4 py-4 border-t"
      >
        <div className="text-sm text-muted-foreground">Page 1 of 2</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const CustomerDetails: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Sheet>
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
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12 ">
                        <AvatarImage
                          src={`https://api.dicebear.com/6.x/initials/svg?seed=${customer.name}`}
                        />
                        <AvatarFallback className="bg-slate-800">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl">
                          {customer.name}
                        </CardTitle>
                        <CardDescription>
                          Customer since{" "}
                          {format(
                            new Date(customer.created_at),
                            "MMMM d, yyyy"
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.phone_number}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(customer.email, "Email")}
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(customer.phone_number, "Phone")
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" /> Copy Phone
                      </Button>
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
                      <div className="text-2xl font-bold">
                        {formatAmountToNaira(totalSpent)}
                      </div>
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
                      <div className="text-2xl font-bold">{productsBought}</div>
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
                        <CustomerTransactionDetails {...subscription} />
                      </motion.div>
                    </TabsContent>
                    <TabsContent value="payment">
                      <motion.div
                        key="payment"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CustomerPaymentDetails />
                      </motion.div>
                    </TabsContent>
                    <TabsContent value="orders">
                      <motion.div
                        key="orders"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CustomerOrderDetails />
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

const CustomerTransactionDetails: FC<any> = (subscription) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions Details</CardTitle>
        <CardDescription>
          Transaction details and status of the customer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Type</span>
          <Badge variant="secondary">Purchase</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Amount Paid</span>
            <span className="font-semibold">
              ${subscription.amountPaid.toFixed(2)}
            </span>
          </div>
          <Progress value={66} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Next billing cycle in 10 days</span>
            <span>$15.00 / month</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Payment Type</span>
          <span>{subscription.paymentType}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span>Order Id</span>
          <span className="font-mono">{subscription.tx_ref}</span>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Billing Address</h4>
          <div className="text-sm">
            <p>{subscription.billingAddress.name}</p>
            <p>{subscription.billingAddress.street}</p>
            <p>
              {subscription.billingAddress.city},{" "}
              {subscription.billingAddress.state}{" "}
              {subscription.billingAddress.zipCode}
            </p>
            <p>{subscription.billingAddress.country}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4 mr-2" /> Download Invoice
        </Button>
      </CardFooter>
    </Card>
  );
};

const CustomerPaymentDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Primary card details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 bg-secondary p-4 rounded-lg">
          <CreditCard className="h-6 w-6" />
          <div>
            <p className="font-medium">
              {cardDetails.type} •••• {cardDetails.last_4digits}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires {cardDetails.expiry}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Issuer</p>
            <p className="text-muted-foreground">{cardDetails.issuer}</p>
          </div>
          <div>
            <p className="font-medium">Country</p>
            <p className="text-muted-foreground">{cardDetails.country}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <CreditCard className="h-4 w-4 mr-2" /> Update Payment Method
        </Button>
      </CardFooter>
    </Card>
  );
};

const CustomerOrderDetails = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Customer Orders And Details</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {orders.map((order, index) => (
            <div key={order._id} className="mb-6 last:mb-0">
              <h4 className="text-sm font-semibold mb-2">Order #{order._id}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date:</span>
                  <span>
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline">{order.orderStatus}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
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
                            product.image ||
                            `/placeholder.svg?height=40&width=40`
                          }
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {product.id}
                        </p>
                      </div>
                      <div className="text-sm">Qty: {product.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Button size="sm" variant="secondary" className="mt-3 w-full">
                View Order
              </Button>
              {index < orders.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DashboardCustomers;
