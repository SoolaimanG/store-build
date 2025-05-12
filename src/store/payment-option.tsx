"use client";

import type React from "react";
import {
  AlertCircle,
  Banknote,
  ChevronRight,
  Copy,
  CreditCard,
  Landmark,
  Loader2,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/text";
import {
  copyToClipboard,
  errorMessageAndStatus,
  formatAmountToNaira,
  storeBuilder,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useToastError } from "@/hooks/use-toast-error";
import { Fragment, useState } from "react";
import { PaymentLinkDialog } from "@/components/payment-link-dialog";
import { Button } from "@/components/ui/button";
import type {
  FlutterwaveVirtualAccountResponse,
  IOrder,
  IPaymentFor,
  IStore,
} from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  disableOption?: boolean;
  onClick: <T = any>() => Promise<T>;
}
interface PaymentOptionsProps {
  orderId: string;
  disabledOptions?: string[];
  phoneNumber?: string;
  showName?: boolean;
  paymentFor?: IPaymentFor;
  storeCode?: string;
}

export default function PaymentOptions({
  orderId,
  phoneNumber,
  disabledOptions = [],
  showName = false,
  paymentFor = "order",
  storeCode,
}: PaymentOptionsProps) {
  const [isPending, startTransition] = useState<string>();
  const [data, setData] = useState<{
    openModal: boolean;
    view: number;
    flutterwaveResponse: FlutterwaveVirtualAccountResponse;
    [key: string]: any;
  }>({
    openModal: false,
    view: 0,
    flutterwaveResponse: {} as FlutterwaveVirtualAccountResponse,
  });

  const payWithBankTransfer = async <
    T = FlutterwaveVirtualAccountResponse,
  >(): Promise<T> => {
    const result = await storeBuilder.createCharge({
      id: orderId,
      paymentFor,
      paymentOption: "virtualAccount",
      storeCode,
    });
    setData({
      ...data,
      view: 1,
      flutterwaveResponse: result.data.virtualAccount!,
    });

    return result as T;
  };

  const payWithFlutterwave = async <
    T = FlutterwaveVirtualAccountResponse,
  >(): Promise<T> => {
    const res = await storeBuilder.createCharge({
      id: orderId,
      paymentFor,
      paymentOption: "card",
      storeCode,
    });

    setData({ ...data, ["link"]: res.data.paymentLink });
    window.open(res.data.paymentLink, "__blank");

    const result = {};
    return result as T;
  };

  const payWithMono = async <
    T = FlutterwaveVirtualAccountResponse,
  >(): Promise<T> => {
    const result = {};
    return result as T;
  };

  const sharePaymentLinkWithFriends = async <
    T = FlutterwaveVirtualAccountResponse,
  >(): Promise<T> => {
    setData({ ...data, openModal: !data.openModal });
    return {} as T;
  };

  const paymentOptions: PaymentOption[] = [
    {
      id: "flutterwave",
      name: "Pay with Flutterwave",
      description: "For all your payment. E.g Cards, Banks",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.294 8.86446L13.7723 13.3725L11.2185 8.86446H8.57769L12.5242 15.8649L12.9931 16.6843L13.4619 15.8649L17.4084 8.86446H16.294Z"
            fill="#FB4E20"
          />
          <path
            d="M6.03693 8.86446V15.1355H7.14925V8.86446H6.03693Z"
            fill="#FB4E20"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4ZM4.5 4.5V19.5H19.5V4.5H4.5Z"
            fill="#FB4E20"
          />
        </svg>
      ),
      disableOption: disabledOptions.includes("flutterwave"),
      color: "bg-blue-50 text-blue-600",
      onClick: payWithFlutterwave,
    },
    {
      id: "bank-transfer",
      name: "Pay with Bank Transfer",
      description: "Confirmed instantly",
      icon: <Landmark size={22} />,
      disableOption: disabledOptions.includes("bank-transfer"),
      color: "bg-red-50 text-red-600",
      onClick: payWithBankTransfer,
    },
    {
      id: "mono",
      name: "Pay with Store Build",
      description: "Use your store credit to make payment.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="4" fill="#F5F5F5" />
          <path d="M7 9L10 15H8L5 9H7Z" fill="#111111" />
          <path d="M11 9L14 15H12L9 9H11Z" fill="#111111" />
          <path d="M15 9L18 15H16L13 9H15Z" fill="#111111" />
        </svg>
      ),
      disableOption: disabledOptions.includes("mono"),
      color: "bg-gray-100 text-gray-900",
      onClick: payWithMono,
    },
    {
      id: "share",
      name: "Share with friend to pay",
      description: "",
      icon: <Users size={20} className="text-orange-500" />,
      disableOption: disabledOptions.includes("share"),
      color: "bg-orange-50 text-orange-600",
      onClick: sharePaymentLinkWithFriends,
    },
  ];

  const {
    isLoading,
    data: order,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () =>
      (
        await storeBuilder.getOrder<{ order: IOrder; store: IStore }>(
          orderId,
          phoneNumber
        )
      ).data,
    enabled: Boolean(orderId),
  });

  useToastError(error);

  const bankTransferPage = (
    <div className="flex items-center justify-center w-full flex-col gap-4">
      <header className="flex items-center flex-col">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mb-3">
          <Banknote className="h-7 w-7 text-white" />
        </div>

        <div className="w-full flex flex-col items-center mt-2">
          <h2 className="text-xl font-medium text-gray-400">Transfer</h2>
          <code className="text-2xl font-bold mt-1">
            {formatAmountToNaira(order?.order.amountLeftToPay!, 3)}
          </code>
        </div>
      </header>
      <Separator />
      <div className="w-full space-y-3 flex bg-slate-900 flex-col items-center rounded-md p-5">
        <Text className=" text-primary font-bold text-center w-full">
          {data?.flutterwaveResponse?.data?.bank_name}
        </Text>
        <div className="mt-4 flex gap-1 items-end">
          <code className="text-4xl font-light">
            {data?.flutterwaveResponse?.data?.account_number}
          </code>
          <Button
            size="icon"
            className="h-6 w-6 text-primary"
            variant="secondary"
            onClick={() =>
              copyToClipboard(
                data?.flutterwaveResponse?.data?.account_number,
                "Account Number"
              )
            }
          >
            <Copy size={14} />
          </Button>
        </div>
        <Text className="mt-3">Flutterwave - {order?.store.storeName}</Text>
        <div className="w-full h-[1px] flex bg-slate-700 mt-8" />

        <div className="flex items-center gap-2">
          <AlertCircle size={18} className="text-destructive" />
          <Text className="text-destructive font-semibold">
            Please transfer exactly{" "}
            {formatAmountToNaira(order?.order.amountLeftToPay!, 2)}
          </Text>
        </div>
      </div>

      <Separator />

      <div className="space-y-3 w-full">
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to cancel this transaction")) {
              setData({ ...data, view: 0 });
            }
          }}
          variant="secondary"
          className="w-full h-[3rem]"
        >
          Cancel Payment
        </Button>
        <Button
          onClick={() => setData({ ...data, view: 2 })}
          className="w-full h-[3rem]"
        >
          I've Made The Payment
        </Button>
      </div>
    </div>
  );

  //This is use to validate the user payment after order
  const validatePayment = () => {
    const {
      isLoading,
      data: validationData,
      error,
      isSuccess,
      refetch,
    } = useQuery({
      queryKey: ["validate-payment"],
      queryFn: () =>
        storeBuilder.validatePayment(
          "completed",
          order?.order.paymentDetails?.tx_ref!,
          undefined,
          order?.order.storeId
        ),
      enabled: data?.view === 2,
    });

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <Text>Validating your payment...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-white" />
          </div>
          <Text className="text-xl font-medium text-destructive mb-2">
            Payment Failed
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            {errorMessageAndStatus(error).message}
          </Text>
          <Button onClick={() => refetch()} variant="secondary">
            Try Again
          </Button>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-7 w-7 text-white" />
          </div>
          <Text className="text-xl font-medium text-emerald-500 mb-2">
            Payment Successful
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            {validationData?.message}
          </Text>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Done
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-xl font-medium text-gray-400">Pay</h2>
        <code className="text-2xl font-bold mt-1">
          {formatAmountToNaira(order?.order.amountLeftToPay!, 3)}
        </code>
      </div>
    );
  };

  const _paymentOptions = (
    <Fragment>
      <PaymentLinkDialog
        key={String(data.openModal)}
        open={data.openModal}
        paymentLink={`${orderId}?phoneNumber=${phoneNumber}&storeCode=${order?.store.storeCode}`}
        onClose={() => {
          setData((prev) => ({ ...prev, openModal: !prev.openModal }));
        }}
      />
      <div className="flex flex-col items-center p-6 pb-4 border-b">
        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
          <CreditCard className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-xl font-medium text-gray-400">Pay</h2>
        <code className="text-2xl font-bold mt-1">
          {formatAmountToNaira(order?.order.amountLeftToPay!, 3)}
        </code>
        {showName && (
          <Badge variant="secondary" className="bg-slate-800 px-3 mt-3">
            <Text>FOR {order?.order.customerDetails.name?.toUpperCase()}</Text>
          </Badge>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 rounded-md mt-4">
        {paymentOptions.map((option) => (
          <Button
            key={option.id}
            variant="ghost"
            className="w-full flex items-center justify-between px-4 py-8 hover:bg-slate-900 rounded-lg transition-colors"
            onClick={async () => {
              startTransition(option.id);
              await option
                .onClick()
                .then(() => {
                  if (option.id === "flutterwave") {
                    window.open(data["link"], "__blank");
                  }
                })
                .catch((error) => {
                  toast({
                    title: "Error",
                    description: errorMessageAndStatus(error).message,
                    variant: "destructive",
                  });
                })
                .finally(() => {
                  startTransition(undefined);
                });
            }}
            disabled={option.disableOption}
          >
            <div className="flex items-center">
              <div className="mr-3">{option.icon}</div>
              <div className="text-left">
                <p className="font-medium text-gray-50">{option.name}</p>
                {option.description && <Text>{option.description}</Text>}
              </div>
            </div>
            {isPending === option.id ? (
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        ))}
      </div>
    </Fragment>
  );

  const views: Record<number, any> = {
    0: _paymentOptions,
    1: bankTransferPage,
    2: validatePayment(),
  };

  // Render loading skeleton
  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto border rounded-xl mt-16 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col items-center p-6 pb-4 border-b">
            <Skeleton className="w-14 h-14 rounded-full mb-4" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </div>

          <div className="p-4 bg-slate-900/50 rounded-md mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 mb-2 rounded-lg bg-slate-800/50"
              >
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 mr-3 rounded-md" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto border rounded-xl shadow-sm h-[33rem] flex justify-center flex-col">
      <CardContent className="p-4">{views[data.view]}</CardContent>
    </Card>
  );
}
