import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, SlidersHorizontal, Search } from "lucide-react";
import { Download, Plus } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
  // Add more customers as needed
];

export function DashboardCustomers() {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  return (
    <div className="container mx-auto p-3 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Customers</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-none">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="rounded-none">
            <Plus className="w-4 h-4 mr-2" />
            Add customer
          </Button>
        </div>
      </div>
      <CustomerStats />
      <CustomerFilters />
      <CustomerTable
        selectedCustomers={selectedCustomers}
        onSelectedCustomersChange={setSelectedCustomers}
      />
    </div>
  );
}

export function CustomerFilters() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" className="h-8 rounded-none">
          All time
          <X className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="secondary" size="sm" className="h-8 rounded-none">
          US, AU, +4
          <X className="w-4 h-4 ml-2" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 rounded-none">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          More filters
        </Button>
      </div>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-8 w-full sm:w-[250px]"
        />
      </div>
    </div>
  );
}

export function CustomerStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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
    </div>
  );
}

export function CustomerTable({
  selectedCustomers,
  onSelectedCustomersChange,
}: CustomerTableProps) {
  return (
    <div className="rounded-md border">
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
            <TableHead>Amount Spent</TableHead>
            <TableHead>Items Bought</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead className="w-[50px]"></TableHead>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit customer</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete customer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="text-sm text-muted-foreground">Page 1 of 2</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
