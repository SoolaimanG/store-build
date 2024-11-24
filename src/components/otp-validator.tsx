import { useMediaQuery } from "@uidotdev/usehooks";
import { FC, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { useStoreBuildState } from "@/store";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const otpSchema = z.object({
  pin: z.string().length(6, { message: "OTP must be 6 digits" }),
});

const OtpValidator: FC = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { openOTPValidator, setOpenOTPValidator } = useStoreBuildState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof otpSchema>) => {
    setIsSubmitting(true);
    try {
      await storeBuilder.verifyOTP(
        values.pin,
        openOTPValidator.userEmail!,
        openOTPValidator.otpFor
      );
      toast({
        title: "Success",
        description: "You can proceed with your next action.",
      });
      setOpenOTPValidator({ ...openOTPValidator, open: false });
      openOTPValidator.onSuccess && openOTPValidator.onSuccess();
    } catch (error) {
      const _error = errorMessageAndStatus(error);
      toast({
        title: _error.status,
        description: _error.message,
        variant: "destructive",
      });
      openOTPValidator.onError && openOTPValidator.onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsSubmitting(true);
      await storeBuilder.sendOTP(
        openOTPValidator.otpFor || "login",
        openOTPValidator.userEmail || ""
      );
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
    } catch (error) {
      console.log(error);
      const _error = errorMessageAndStatus(error);
      toast({
        title: _error.status,
        description: _error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Validator = (
    <div className="w-full">
      <FormField
        control={form.control}
        name="pin"
        render={({ field }) => (
          <FormItem className="w-full flex flex-col gap-1 items-center justify-center">
            <FormControl>
              <InputOTP
                maxLength={6}
                {...field}
                onComplete={(value) => form.setValue("pin", value)}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, idx) => (
                    <InputOTPSlot
                      key={idx}
                      index={idx}
                      className="h-[4rem] w-[4rem] text-2xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  if (isMobile)
    return (
      <Drawer
        open={openOTPValidator.open}
        onOpenChange={(open) =>
          setOpenOTPValidator({ ...openOTPValidator, open })
        }
        shouldScaleBackground
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-4xl">📩</DrawerTitle>
            <DrawerTitle className="text-3xl">
              {openOTPValidator?.header || "Verify Your Email"}
            </DrawerTitle>
            <DrawerDescription className="text-gray-400">
              {openOTPValidator?.desc ||
                "We've just sent a verification code to your email. Please enter the code below to continue"}
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {Validator}
              <DrawerDescription className="text-center text-gray-300 mt-5">
                {
                  "Please check your email for the One-Time Password (OTP) to proceed with verification. If you don't see it in your inbox, kindly check your spam or junk folder."
                }
              </DrawerDescription>
              <div className="w-full flex items-center justify-center">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="hover:bg-slate-800 hover:text-white"
                >
                  Resend OTP
                </Button>
              </div>
              <DrawerFooter>
                <Button
                  type="submit"
                  variant="ringHover"
                  className="h-[3rem]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify"}
                </Button>
                <DrawerClose
                  type="button"
                  className="bg-slate-800 h-[3rem] rounded-md"
                >
                  Close
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    );

  return (
    <AlertDialog
      open={openOTPValidator.open}
      onOpenChange={(open) =>
        setOpenOTPValidator({ ...openOTPValidator, open })
      }
    >
      <AlertDialogContent className="max-w-[50%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-4xl">📩</AlertDialogTitle>
          <AlertDialogTitle className="text-3xl">
            {openOTPValidator?.header || "Verify Your Email"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {openOTPValidator?.desc ||
              "We've just sent a verification code to your email. Please enter the code below to continue"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {Validator}
            <AlertDialogDescription className="text-center text-gray-300 mt-5">
              {
                "Please check your email for the One-Time Password (OTP) to proceed with verification. If you don't see it in your inbox, kindly check your spam or junk folder."
              }
            </AlertDialogDescription>
            <Button variant="ghost" type="button" onClick={handleResendOTP}>
              Resend OTP
            </Button>
            <AlertDialogFooter>
              <Button
                type="submit"
                variant="ringHover"
                className="h-[3rem]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
              <AlertDialogCancel
                type="button"
                className="bg-slate-800 h-[3rem] rounded-md"
              >
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpValidator;
