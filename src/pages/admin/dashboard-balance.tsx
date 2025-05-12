import Deposit from "@/components/deposit";
import { EmptyProductState } from "@/components/empty";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Withdraw from "@/components/withdraw";
import { useToastError } from "@/hooks/use-toast-error";
import { formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { useStoreBuildState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { format } from "date-fns";
import {
  ArrowDown,
  ChevronRight,
  HeadsetIcon,
  Newspaper,
  Plus,
} from "lucide-react";

const DashboardBalance = () => {
  useDocumentTitle("My Store | Balance");
  const { user } = useStoreBuildState();

  const { data } = useQuery({
    queryKey: ["get-store"],
    queryFn: async () => (await storeBuilder.getStore()).data,
    enabled: Boolean(user?.storeCode),
  });

  const {
    isLoading,
    data: _data,
    error: internalTransactionError,
  } = useQuery({
    queryKey: [],
    queryFn: async () => (await storeBuilder.getInternalTransactions()).data,
  });

  const { transactions = [] } = _data || {};
  const { balance = 0, pendingBalance = 0, lockedBalance = 0 } = data || {};

  useToastError(internalTransactionError);

  const TransactionsList = () => {
    return (
      <Card>
        <CardContent className="p-0">
          {/* Mobile view (card-based layout) */}
          <div className="md:hidden space-y-4 p-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{transaction.identifier}</span>
                  <PaymentStatusBadge status={transaction.paymentStatus} />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{format(transaction.createdAt!, "hh:mm a")}</span>
                  <span>{transaction.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">
                    {formatAmountToNaira(transaction.amount)}
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <HeadsetIcon size={16} />
                    <span className="sr-only">Support</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet/Desktop view (table layout) */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/55">
                <TableRow>
                  <TableHead className="w-[100px]">Identifier</TableHead>
                  <TableHead className="w-[150px]">Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Support</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow className="h-16" key={transaction._id}>
                    <TableCell className="font-medium">
                      {transaction.identifier}
                    </TableCell>
                    <TableCell>
                      {format(transaction.createdAt!, "hh:mm a")}
                    </TableCell>
                    <TableCell className="capitalize">
                      <PaymentStatusBadge status={transaction.paymentStatus} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.paymentMethod.toUpperCase()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmountToNaira(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="rounded-none"
                        size="icon"
                      >
                        <HeadsetIcon size={19} />
                        <span className="sr-only">Support</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="w-screen h-screen">
      <div className="flex container mx-auto flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h2 className="tracking-tight md:text-4xl text-2xl">Balance</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
          <Card className="rounded-2xl py-6">
            <CardContent className="py-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-4xl tracking-tight">
                  {formatAmountToNaira(
                    balance + lockedBalance + pendingBalance
                  )}
                </CardTitle>
                <CardDescription>Total Balance</CardDescription>
              </div>
              <Deposit>
                <Button className="rounded-full gap-4">
                  Deposit
                  <div className="rounded-full bg-white text-primary">
                    <Plus size={19} />
                  </div>
                </Button>
              </Deposit>
            </CardContent>
          </Card>
          <Card className="rounded-2xl py-6">
            <CardContent className="py-0 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-4xl tracking-tight">
                  {formatAmountToNaira(lockedBalance)}
                </CardTitle>
                <CardDescription>Locked Balance</CardDescription>
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full gap-4"
              >
                <ChevronRight size={20} />
              </Button>
            </CardContent>
          </Card>
        </div>
        <Card className="rounded-2xl py-6">
          <CardContent className="py-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="md:text-3xl text-2xl">
                {formatAmountToNaira(
                  balance - (pendingBalance + lockedBalance)
                )}
              </CardTitle>
              <CardDescription>Withdrawable Amount</CardDescription>
            </div>
            <Withdraw>
              <Button
                disabled={!Boolean(balance - (pendingBalance + lockedBalance))}
                className="rounded-full gap-4"
              >
                Withdraw
                <div className="rounded-full bg-white text-primary">
                  <ArrowDown size={19} />
                </div>
              </Button>
            </Withdraw>
          </CardContent>
        </Card>

        <div className="mt-5 space-y-3">
          <h2 className="text-2xl md:text-4xl">Transaction Histories</h2>
          <Separator />
          {!transactions.length ? (
            <EmptyProductState
              icon={Newspaper}
              header="No Transaction History"
              message="When you widthraw or deposit any amount on your account, it will appear here"
            />
          ) : (
            <TransactionsList />
          )}
        </div>
      </div>
    </main>
  );
};

export default DashboardBalance;
