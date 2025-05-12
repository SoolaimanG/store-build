import { FC, ReactNode, useEffect, useState } from "react";
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
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Users,
  CalendarIcon,
  FileJson,
  FileSpreadsheet,
  Loader2,
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
  cn,
  copyToClipboard,
  errorMessageAndStatus,
  formatAmountToNaira,
  getInitials,
  getOrderProductCount,
  storeBuilder,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { Customer, IOrder, PATHS } from "@/types";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerFilters } from "@/components/customer-filters";
import { EmptyProductState } from "@/components/empty";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreBuildState } from "@/store";
import { PaymentStatusBadge } from "@/components/payment-status-badge";

interface CustomerTableProps {
  selectedCustomers: string[];
  onSelectedCustomersChange: (customers: string[]) => void;
  customers: Customer[];
  isLoading: boolean;
}

const PAGE_SIZE = 10;

const formSchema = z.object({
  format: z.enum(["json", "excel"]),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

const ExportDataWindow: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useStoreBuildState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: "json",
      dateRange: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("dateRange.from", new Date(user.createdAt!));
    }
  }, [user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const res = await storeBuilder.exportCustomersData(values.format, {
        from: values.dateRange.from.toISOString(),
        to: values.dateRange.to.toISOString(),
      });

      const blob = new Blob([res.data], {
        type:
          values.format === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `customers.${
        values.format === "excel" ? "xlsx" : "json"
      }`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Close the modal or take further actions
      setIsOpen(false);
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="dateRange"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date Range</FormLabel>
            <div className="flex flex-col sm:flex-row gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="secondary"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value.from && "text-muted-foreground"
                      )}
                    >
                      {field.value.from ? (
                        format(field?.value.from, "PPP")
                      ) : (
                        <span>Start date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value.from}
                    onSelect={(date) =>
                      field.onChange({ ...field.value, from: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="secondary"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value.to && "text-muted-foreground"
                      )}
                    >
                      {field.value.to ? (
                        format(field.value.to, "PPP")
                      ) : (
                        <span>End date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value.to}
                    onSelect={(date) =>
                      field.onChange({ ...field.value, to: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Export Format</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <RadioGroupItem
                      value="json"
                      className="peer sr-only"
                      id="json"
                    />
                  </FormControl>
                  <Label
                    htmlFor="json"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-[7.5rem]"
                  >
                    <FileJson className="mb-3 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">
                        JSON Export
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Raw data format
                      </p>
                    </div>
                  </Label>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem
                      value="excel"
                      className="peer sr-only"
                      id="excel"
                    />
                  </FormControl>
                  <Label
                    htmlFor="excel"
                    className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer h-[7.5rem]"
                  >
                    <FileSpreadsheet className="mb-3 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">
                        Excel Export
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Spreadsheet format
                      </p>
                    </div>
                  </Label>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </>
        )}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Export Data</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>{content}</form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>{content}</form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

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
        <h1 className="text-4xl tracking-tight">Customers</h1>
        <div className="flex items-center gap-3">
          <ExportDataWindow>
            <Button variant="outline" size="sm" className="rounded-md">
              <Download className="w-4 h-4 mr-2" />
              Export Customers
            </Button>
          </ExportDataWindow>
        </div>
      </motion.div>

      <CustomerStats />

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

function CustomerStats() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["customer-stat"],
    queryFn: () => storeBuilder.getCustomersStats(),
  });

  const { data: _data } = data || {};

  const { customerStats = [] } = _data || {};

  useToastError(error);

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
  if (!customers.length)
    return (
      <EmptyProductState
        icon={Users}
        header="No Customer found"
        message="No customer match your query or something went wrong."
      />
    );

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
                        <EmptyProductState
                          message="No payment method found"
                          header="No Payment Method"
                          icon={CreditCard}
                        />
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
              <span className="font-mono truncate">{order._id}</span>
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
        <Link to={PATHS.STORE_ORDERS} className="w-full">
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" /> View Invoices
          </Button>
        </Link>
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
                <h4 className="text-sm font-semibold mb-2 truncate">
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
                    <PaymentStatusBadge status={order.orderStatus} />
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
                          <p className="text-xs text-muted-foreground truncate">
                            ID: {product._id}
                          </p>
                        </div>
                        <div className="text-sm">
                          Qty:{" "}
                          {getOrderProductCount(order.products, product._id!)}
                        </div>
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
                  <Link
                    to={
                      PATHS.STORE_ORDERS +
                      order._id +
                      `?phoneNumber=${order.customerDetails.phoneNumber}`
                    }
                  >
                    {" "}
                    View Order
                  </Link>
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
