import { Circle, Eye } from "lucide-react";
import { ArrowLeft, Edit, Pencil, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { PATHS } from "@/types";
import { getInitials } from "@/lib/utils";

const timelineData = [
  {
    status: "Delivery successful",
    date: "28 Nov 2024 1:55 am",
    completed: true,
  },
  {
    status: "Transporting to [2]",
    date: "27 Nov 2024 12:55 am",
    completed: false,
  },
  {
    status: "Transporting to [1]",
    date: "25 Nov 2024 11:55 pm",
    completed: false,
  },
  {
    status: "The shipping unit has picked up the goods",
    date: "24 Nov 2024 10:55 pm",
    completed: false,
  },
  {
    status: "Order has been created",
    date: "23 Nov 2024 9:55 pm",
    completed: false,
  },
];

const DashboardOrderDetails = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between flew-wrap">
          <div className="flex items-center gap-2">
            <Link to={PATHS.STORE_ORDERS}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Order #6011</h1>
                {/* <Badge variant="secondary">Refunded</Badge> */}
              </div>
              <p className="text-sm text-muted-foreground">
                28 Nov 2024 1:55 am
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                  Refunded <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                <DropdownMenuItem>Mark as Cancelled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="default" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Details</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-lg border overflow-hidden">
                  <img
                    src="/placeholder.svg"
                    alt="Urban Explorer Sneakers"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">Urban Explorer Sneakers</h3>
                      <p className="text-sm text-muted-foreground">16H9UR0</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">x1</div>
                      <div className="font-semibold">$83.74</div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">$83.74</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-red-500">-$10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium text-red-500">-$10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">$10</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">$73.74</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">History</h2>
            </CardHeader>
            <CardContent>
              <OrderTimeline />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Customer info</h2>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {getInitials("Soolaiman Abubakar")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Lucian Obrien</h3>
                  <p className="text-sm text-muted-foreground">
                    ashlynn.ohara62@gmail.com
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                IP address: 192.158.1.38
              </div>
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                Send an email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Delivery</h2>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Ship by</div>
                  <div className="text-sm text-muted-foreground">DHL</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Speedy</div>
                  <div className="text-sm text-muted-foreground">Standard</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Tracking No.</div>
                <div className="text-sm text-muted-foreground">
                  <a href="#" className="hover:underline">
                    SPX037739199373
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Shipping</h2>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <div className="text-sm font-medium">Address</div>
                <div className="text-sm text-muted-foreground">
                  19034 Verna Unions Apt. 164
                  <br />
                  Honolulu, RI / 87535
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Phone number</div>
                <div className="text-sm text-muted-foreground">
                  365-374-4961
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOrderDetails;

export function OrderTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 h-[calc(100%-24px)] w-px bg-border" />
      <div className="space-y-8">
        {timelineData.map((item, index) => (
          <div key={index} className="md:flex md:space-x-10">
            <div className="flex gap-4">
              <div
                className={`h-6 w-6 rounded-full border-2 z-20 ${
                  item.completed
                    ? "border-primary bg-primary text-white"
                    : "border-muted bg-background"
                } flex items-center justify-center`}
              >
                <Circle
                  className={`h-2 w-2 ${item.completed ? "fill-current" : ""}`}
                />
              </div>
              <div className="flex-1">
                <p className="font-medium leading-none">{item.status}</p>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            </div>
            <div className="flex-1">
              {index === 0 && (
                <>
                  <div className="space-y-1 ml-10 md:ml-0 mt-3 md:mt-0">
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Order time</span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">
                        Payment time
                      </span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">
                        Delivery time for the carrier
                      </span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">
                        Completion time
                      </span>
                      <span>28 Nov 2024 1:55 am</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
