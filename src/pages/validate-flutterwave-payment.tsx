import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { PATHS } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { Check, Loader2, X } from "lucide-react";
import queryString from "query-string";
import { Link, useLocation } from "react-router-dom";

const ValidateFlutterWavePayment = () => {
  useDocumentTitle("Validate FlutterWave Payment");

  const location = useLocation();

  const query = queryString.parse(location.search) as {
    tx_ref: string;
    status: string;
  };

  const { isLoading, data, error, isSuccess } = useQuery({
    queryKey: ["validate-flutterwave-payment"],
    queryFn: () => storeBuilder.validatePayment(query.status, query.tx_ref),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Card className="p-3 md:max-w-xl w-[85%] md:w-full">
          <CardContent className="flex flex-col items-center justify-center gap-10">
            <Loader2 size={80} className="animate-spin" />
            <div className="w-full flex items-center justify-center flex-col gap-3">
              <CardTitle>Validating Payment...</CardTitle>
              <CardDescription className="text-center text-lg font-light">
                Please wait while we validate your payment
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const notifyIcon = (status: "success" | "failed") => (
    <div
      className={cn(
        "rounded-full p-5",
        status !== "success" ? "bg-destructive/30" : "bg-primary/10 "
      )}
    >
      <div
        className={cn(
          "p-5 rounded-full",
          status === "success" ? "bg-primary/20" : "bg-destructive/40"
        )}
      >
        <div
          className={cn(
            "p-1 rounded-full",
            status === "success" ? "bg-primary/50" : "bg-destructive/60"
          )}
        >
          {status === "success" ? <Check size={80} /> : <X size={80} />}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="p-3 md:max-w-xl w-[85%] md:w-full">
        <CardContent className="flex flex-col items-center justify-center gap-10">
          {isLoading ? (
            <Loader2 size={80} className="animate-spin" />
          ) : (
            notifyIcon(isSuccess ? "success" : "failed")
          )}
          <div className="w-full flex items-center justify-center flex-col gap-3">
            <CardTitle>{isSuccess ? "Yay!" : "Oh No!"}</CardTitle>
            <CardDescription className="text-center text-lg font-light">
              {isSuccess ? data.message : errorMessageAndStatus(error).message}
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter className="flex-col-reverse gap-2">
          {error && (
            <Button className="w-full" size={"lg"} variant="secondary">
              Retry Payment
            </Button>
          )}
          <Button className="w-full" size={"lg"} variant="ringHover" asChild>
            <Link to={PATHS.HOME}> Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ValidateFlutterWavePayment;
