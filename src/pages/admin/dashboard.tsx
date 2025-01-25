import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles } from "lucide-react";
import {
  addQueryParameter,
  cn,
  formatAmountToNaira,
  generateRandomString,
  getInitials,
  storeBuilder,
} from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
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
import RecentOrdersLoading from "@/components/loaders/recent-orders-loading";

const timeRanges = [
  { value: "all", label: "All-time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export default function Dashboard() {
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
      className="p-3 max-w-[1400px] mx-auto space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1 md:flex md:items-center md:gap-3">
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
            onValueChange={handleTimeRangeChange}
          >
            <TabsList>
              {timeRanges.map((range) => (
                <TabsTrigger key={range.value} value={range.value}>
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
          className="flex items-center gap-4"
        >
          <Button asChild size="sm">
            <Link
              className="text-sm"
              to={PATHS.STORE_PRODUCTS + `${generateRandomString(24)}#new`}
            >
              {" "}
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, staggerChildren: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
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
        className="grid grid-cols-3 gap-3"
      >
        <RecentOrder className="md:col-span-2 col-span-3" />
        {user?.plan.type === "free" ? (
          <Chart />
        ) : (
          <AISuggestion className="md:col-span-1 col-span-3" />
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
        <div className="grid grid-cols-3 gap-3">
          <RecentSales className="md:col-span-2 col-span-3" />
          <PricingCard
            {...{ ...tiers[1], featured: false }}
            tierIdx={1}
            btnText="Upgrade to premium"
            className="md:col-span-1 col-span-3 rounded-md sm:rounded-t-md lg:rounded-bl-md lg:rounded-tr-md sm:p-5"
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
    queryFn: () => storeBuilder.getOrders("Paid", 0, 5, true),
  });

  const { data: recentSales } = data || {};

  useToastError(error);

  return (
    <Card className={cn("w-full text-white py-2", className)}>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Below are your most recent sales.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <RecentOrdersLoading />
        ) : !!recentSales?.orders.length ? (
          recentSales?.orders?.map((order, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={order.customerDetails.name}
                  />
                  <AvatarFallback>
                    {getInitials(order.customerDetails.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{order.customerDetails.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerDetails.email}
                  </p>
                </div>
              </div>
              <p className="font-medium text-yellow-700">
                {order.amountPaid || "Waiting for payment.."}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="flex h-[20rem] flex-col items-center justify-center p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No recent sales</h3>
            <p className="text-sm text-muted-foreground">
              When you sell an item, they will appear here.
            </p>
          </div>
        )}
        <CardFooter className="p-0 w-full">
          <Button asChild variant="ringHover" size="lg" className="w-full mt-3">
            <Link to={PATHS.STORE_ORDERS}> See All Orders</Link>
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}

export function Chart({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "col-span-full md:col-span-1 p-3 h-full flex flex-col",
        className
      )}
    >
      <CardHeader>
        <CardTitle>Yearly Sales</CardTitle>
        <CardDescription>
          January - June {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="desktop"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
              className="cursor-pointer"
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                fontSize={14}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing sales for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

function RecentOrder({ className }: { className?: string }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => storeBuilder.getOrders(undefined, 0, 5, true),
  });

  const { data: recentOrders } = data || {};

  useToastError(error);

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-medium">Recent orders</h3>
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton loading
          <RecentOrdersLoading />
        ) : recentOrders && recentOrders.orders.length > 0 ? (
          recentOrders.orders.map((order, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatAmountToNaira(order.totalAmount)}
                  </span>
                  {Boolean(order.amountLeftToPay) && (
                    <span className="text-sm text-muted-foreground">
                      {order.amountLeftToPay}
                    </span>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium capitalize",
                    order.paymentDetails.paymentStatus === "paid" &&
                      "text-green-600 border-green-600/20 bg-green-50",
                    order.paymentDetails.paymentStatus === "pending" &&
                      "text-yellow-600 border-yellow-600/20 bg-yellow-50",
                    order.paymentDetails.paymentStatus === "failed" &&
                      "text-red-600 border-red-600/20 bg-red-50"
                  )}
                >
                  {order.paymentDetails.paymentStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="font-medium">
                    {order.customerDetails.name}
                  </span>
                  <span className="text-[12px] text-muted-foreground line-clamp-1">
                    {order.note}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/60"
                  asChild
                >
                  <Link to={PATHS.STORE_ORDERS + order._id}>View order</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          // Empty state
          <div className="flex h-[23rem] flex-col items-center justify-center p-8 text-center border rounded-lg">
            <svg
              className="w-12 h-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2">No recent orders</h3>
            <p className="text-sm text-muted-foreground">
              When you receive new orders, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AISuggestion({ className }: { className?: string }) {
  const aiSuggestions = [
    {
      title: "Increase Product Variety",
      description:
        "Your top-selling category 'Electronics' has limited options. Consider expanding your product range to capture more sales.",
      action: "View Product Catalog",
    },
    {
      title: "Optimize Pricing Strategy",
      description:
        "Your 'Clothing' category has a high volume but lower profit margin. Analyze pricing to improve overall revenue.",
      action: "Review Pricing",
    },
    {
      title: "Improve Order Processing",
      description:
        "There's a backlog in order processing. Streamline your workflow to reduce pending orders and improve customer satisfaction.",
      action: "View Order Queue",
    },
  ];

  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const nextSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % aiSuggestions.length);
  };

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
              {aiSuggestions[currentSuggestion].title}
            </h3>
            <p className="text-sm text-gray-300 mb-4 flex-grow">
              {aiSuggestions[currentSuggestion].description}
            </p>
            <div className="flex justify-between items-center w-full mt-10 md:mt-auto">
              <Button
                variant="outline"
                // className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                {aiSuggestions[currentSuggestion].action}
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
