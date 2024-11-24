"use client";

import { useMediaQuery } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
} from "./ui/drawer";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Logo } from "./logo";
import { ArrowRightLeft, Landmark } from "lucide-react";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { debounce } from "lodash";
import { useMemo, useState } from "react";
import { useStoreBuildState } from "@/store";

const formSchema = z.object({
  accountName: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  accountNumber: z.string().regex(/^\d{10}$/, {
    message: "Account number must be 10 digits.",
  }),
  bankName: z.string(),
});

const AddPaymentDetails = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const { openAddPaymentDetailsModal, setOpenAddPaymentDetailsModal } =
    useStoreBuildState();

  const {
    isLoading,
    data: banks,
    error,
  } = useQuery({
    queryKey: ["banks"],
    queryFn: () => storeBuilder.getBanks(),
    enabled: openAddPaymentDetailsModal,
  });

  const {
    isLoading: verifyingAccountNumber,
    data: accountData,
    error: accountError,
  } = useQuery({
    queryKey: ["verify-account-number", bankCode, accountNumber],
    queryFn: () => storeBuilder.verifyAccountNumber(bankCode, accountNumber),
    enabled: accountNumber.length === 10 && Boolean(bankCode),
  });

  useToastError(error || accountError);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
  });

  const bankOptions = useMemo(() => {
    return (
      banks?.data.map((bank) => ({
        value: bank.code,
        label: bank.name,
      })) || []
    );
  }, [banks?.data]);

  // Debounced setter for account number
  const debouncedSetAccountNumber = debounce((value: string) => {
    setAccountNumber(value);
  }, 300);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Send the data to your backend
  }

  const Header = () => (
    <header className="flex items-center w-full">
      <div className="w-full justify-center flex items-center gap-5">
        <Logo className="text-4xl" />
        <div>
          <ArrowRightLeft size={16} />
        </div>
        <Landmark size={35} />
      </div>
    </header>
  );

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="accountNumber"
          render={() => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Controller
                  name="accountNumber"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="1234567890"
                      disabled={verifyingAccountNumber}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedSetAccountNumber(e.target.value);
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormDescription>
                Your 10-digit bank account number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <Select
                disabled={isLoading || verifyingAccountNumber}
                onValueChange={(value) => {
                  field.onChange(value);
                  setBankCode(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bankOptions.map((bank) => (
                    <SelectItem key={bank.value} value={bank.value}>
                      {bank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select your bank from the list.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={verifyingAccountNumber}
                  value={accountData?.data?.account_name || ""}
                  readOnly
                  placeholder="John Doe"
                />
              </FormControl>
              <FormDescription>
                The name as it appears on your bank account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  const content = (
    <>
      <Header />
      <DrawerDescription>
        Add your payment details to enable secure and direct payouts to your
        account. Ensure the information is accurate to avoid delays in receiving
        your funds.
      </DrawerDescription>
      {formContent}
      <Button onClick={form.handleSubmit(onSubmit)} className="w-full">
        Save Payment Details
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        open={openAddPaymentDetailsModal}
        onOpenChange={setOpenAddPaymentDetailsModal}
      >
        <DrawerContent className="p-3">
          <DrawerHeader>{content}</DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog
      open={openAddPaymentDetailsModal}
      onOpenChange={setOpenAddPaymentDetailsModal}
    >
      <DialogContent className="md:max-w-2xl">
        <DialogHeader>{content}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDetails;
