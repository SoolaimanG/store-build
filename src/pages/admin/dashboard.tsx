import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  DollarSign,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  User,
} from "lucide-react";
import {
  addQueryParameter,
  cn,
  formatAmountToNaira,
  generateRandomString,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC, useState } from "react";
import { tiers } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PricingCard from "@/components/pricing-card";
import queryString from "query-string";
import { useStoreBuildState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { IDashboardMetrics, PATHS } from "@/types";
import MetricLoading from "@/components/loaders/metric-loading";
import { format } from "date-fns";
import { EmptyProductState } from "@/components/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileCompletionCarousel } from "@/components/complete-profile-carousel";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { useDocumentTitle } from "@uidotdev/usehooks";
// import { CompleteProfileCard } from "@/components/complete-profile-carousel";

const timeRanges = [
  { value: "all", label: "All-time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const chartConfig = {
  desktop: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
};

export default function Dashboard() {
  useDocumentTitle("Store Build | Dashboard");
  const location = useLocation();
  const n = useNavigate();
  const { user } = useStoreBuildState();

  const { timeRange = "all" } = queryString.parse(location.search) as {
    timeRange: "all" | "30d" | "7d";
  };

  const handleTimeRangeChange = (timeRange: string) => {
    n(`?${addQueryParameter("timeRange", timeRange)}`);
  };

  const {
    isLoading: loadingMetrics,
    data: metricsResponse,
    error,
  } = useQuery({
    queryKey: [timeRange],
    queryFn: () => storeBuilder.getDashboardContent(timeRange),
  });

  const { data: metrics } = metricsResponse || {};

  useToastError(error);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 container mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-3 w-full sm:w-auto">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold tracking-tight"
          >
            {user?.storeName}
          </motion.h2>
          <Tabs
            defaultValue="all"
            value={timeRange}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto">
              {timeRanges.map((range) => (
                <TabsTrigger
                  key={range.value}
                  value={range.value}
                  className="flex-1 sm:flex-none"
                  onClick={() => handleTimeRangeChange(range.value)}
                >
                  {range.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full sm:w-auto"
        >
          <Button
            variant={"ringHover"}
            asChild
            size="sm"
            className="w-full sm:w-auto"
          >
            <Link
              className="text-sm"
              to={PATHS.STORE_PRODUCTS + `${generateRandomString(24)}#new`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        </motion.div>
      </div>

      <ProfileCompletionCarousel />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, staggerChildren: 0.1 }}
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <AnimatePresence mode="wait">
          {loadingMetrics ? (
            <MetricLoading />
          ) : (
            metrics?.map((metric, i) => <MetricsCard key={i} {...metric} />)
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        <RecentOrder className="md:col-span-2" />
        {user?.plan.type === "free" ? (
          <Chart />
        ) : (
          <AISuggestion className="md:col-span-1" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Recent Paid Orders</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <RecentSales className="md:col-span-2" />
          <PricingCard
            {...{ ...tiers[1], featured: false }}
            tierIdx={1}
            btnText={
              user?.plan?.type === "premium"
                ? "Add Premium"
                : "Upgrade to premium"
            }
            className="md:col-span-1 rounded-md sm:rounded-t-md lg:rounded-bl-md lg:rounded-tr-md sm:p-5"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

const MetricsCard: FC<IDashboardMetrics> = (metric) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              {metric.label}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{metric.value}</span>
              <Badge
                variant="outline"
                className={cn(
                  "font-medium",
                  metric.isPositive
                    ? "text-green-600 border-green-600/20 bg-green-50"
                    : "text-red-600 border-red-600/20 bg-red-50"
                )}
              >
                {metric.change}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function RecentSales({ className }: { className?: string }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["recent-sales"],
    queryFn: () =>
      storeBuilder.getOrders(
        "Paid",
        true,
        "Completed",
        undefined,
        undefined,
        undefined,
        1,
        5
      ),
  });

  const { data: recentSales } = data || {};

  useToastError(error);

  return (
    <Card className={cn("w-full p-0", className)}>
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Recent Sales
        </CardTitle>
        <CardDescription>
          An overview of your most recent transactions.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        {isLoading ? (
          <RecentSalesLoading />
        ) : !!recentSales?.orders.length ? (
          <ScrollArea className="h-[330px] px-2">
            <AnimatePresence>
              {recentSales.orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  className="flex flex-col cursor-pointer sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-900 transition-colors duration-200 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage alt={order.customerDetails.name} />
                      <AvatarFallback>
                        {getInitials(order.customerDetails.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {order.customerDetails.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerDetails.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left sm:text-right">
                      <p className="font-medium text-green-600">
                        {formatAmountToNaira(order.amountPaid || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          new Date(order.createdAt || ""),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        ) : (
          <div className="h-[290px]">
            <EmptyProductState
              icon={DollarSign}
              header="No Recent Sale"
              message="Your recent sales will appear here once you start making transactions"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-slate-900 rounded-b-lg bottom-0 relative">
        <Button asChild variant="outline" size="lg" className="w-full mt-5">
          <Link
            to={PATHS.STORE_ORDERS}
            className="flex items-center justify-center"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            View All Orders
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function RecentSalesLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg animate-pulse"
        >
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="space-y-2 text-left sm:text-right">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Chart({ className }: { className?: string }) {
  const { data, error } = useQuery({
    queryKey: ["sales-chart"],
    queryFn: () => storeBuilder.getSalesChartData(),
  });

  const { data: chartData = [] } = data || {};

  useToastError(error);

  return (
    <Card
      className={cn(
        "col-span-full md:col-span-1 p-3 h-full flex flex-col",
        className
      )}
    >
      <CardHeader className="px-0 pt-0">
        <CardTitle>Yearly Sales</CardTitle>
        <CardDescription>
          January - December {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="sale"
              fill="var(--color-sale)"
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Showing total sales for the last 12 months{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function RecentOrder({ className }: { className?: string }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      storeBuilder.getOrders(
        undefined,
        false,
        "All",
        undefined,
        undefined,
        undefined,
        1,
        5
      ),
  });

  const { data: recentOrders } = data || {};
  const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);

  useToastError(error);

  return (
    <Card className={cn("overflow-hidden border-none shadow-md", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-6">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <Package className="h-5 w-5 text-primary" />
          My Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <RecentOrdersLoading />
        ) : recentOrders && recentOrders.orders.length > 0 ? (
          <div className="divide-y mt-2">
            {recentOrders.orders.map((order, i) => (
              <div
                key={i}
                className={cn(
                  "relative transition-all duration-200 hover:bg-muted/50",
                  hoveredOrder === order._id && "bg-muted/50"
                )}
                onMouseEnter={() => setHoveredOrder(order?._id!)}
                onMouseLeave={() => setHoveredOrder(null)}
              >
                <Link
                  to={PATHS.STORE_ORDERS + order._id}
                  className="block p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <DollarSign className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {formatAmountToNaira(order.totalAmount)}
                          </span>
                          <PaymentStatusBadge
                            status={order.paymentDetails.paymentStatus}
                          />
                        </div>

                        {Boolean(order.amountLeftToPay) && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span className="text-destructive font-medium">
                              {formatAmountToNaira(order.amountLeftToPay)}
                            </span>
                            <span>remaining</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {order.customerDetails.name}
                        </span>
                      </div>

                      {order.note && (
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-[250px]">
                          {order.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    className={cn(
                      "absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-transform duration-200",
                      hoveredOrder === order._id && "translate-x-1 text-primary"
                    )}
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyProductState
            icon={Package}
            header="No Recent Order"
            message="Your recent orders will appear here"
          />
        )}
      </CardContent>
    </Card>
  );
}

function RecentOrdersLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border space-y-2 sm:space-y-0 animate-pulse"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
            </div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col text-left sm:text-right">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
            </div>
            <div className="h-8 w-full sm:w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AISuggestion({ className }: { className?: string }) {
  const {
    isLoading,
    data: aiSuggestions = [],
    error,
  } = useQuery({
    queryKey: ["ai-suggestions"],
    queryFn: async () => (await storeBuilder.getAiSuggestion()).data,
  });

  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length);
  };

  const prevSuggestion = () => {
    setCurrentSuggestion(
      (prev) => (prev - 1 + aiSuggestions.length) % aiSuggestions.length
    );
  };

  useToastError(error);

  if (isLoading) {
    return (
      <Card
        className={cn(
          "col-span-full md:col-span-1 p-3 h-full flex flex-col",
          className
        )}
      >
        <CardHeader className="pb-2 px-0 pt-0">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-purple-200 rounded mr-2 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-grow flex flex-col">
          <div className="space-y-4 flex-grow flex flex-col">
            <div className="rounded-lg p-4 flex flex-col h-full">
              <div className="h-6 w-3/4 bg-purple-100 rounded mb-2 animate-pulse" />
              <div className="space-y-2 mb-4 flex-grow">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center w-full mt-10 md:mt-auto">
                <div className="h-9 w-24 bg-purple-100 rounded animate-pulse" />
                <div className="h-8 w-28 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "col-span-full md:col-span-1 p-3 h-full flex flex-col",
        className
      )}
    >
      <CardHeader className="pb-2 px-0 pt-0">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col">
        <div className="space-y-4 flex-grow flex flex-col">
          <div className="rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              {aiSuggestions[currentSuggestion]?.title}
            </h3>
            <p className="text-sm text-gray-300 mb-4 flex-grow">
              {aiSuggestions[currentSuggestion]?.description}
            </p>
            <div className="flex justify-between items-center w-full mt-10 md:mt-auto">
              <Button
                size="sm"
                variant="ghost"
                onClick={prevSuggestion}
                className="text-purple-600"
              >
                Prev Suggestion
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextSuggestion}
                className="text-purple-600"
              >
                Next Suggestion
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
