"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useStoreBuildState } from ".";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { menu } from "@/constants";

export default function StoreTrackOrder() {
  const { currentStore: store } = useStoreBuildState();
  const [trackingCode, setTrackingCode] = useState("");
  const [isPending, startTransition] = useState(false);
  const n = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      startTransition(true);
      // Handle form submission
      const res = await storeBuilder.getOrder(trackingCode, store?._id);
      !res.data.order &&
        toast({ title: res.status.toUpperCase(), description: res.message });
      n(menu(store?.storeCode!)[3].path + res.data.order._id!);
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Enter the tracking number for your package
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              htmlFor="tracking-code"
              className="text-sm font-medium text-gray-300 uppercase"
            >
              Tracking Code
            </label>
            <Input
              id="tracking-code"
              type="text"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              placeholder="1234567890"
              className="h-12 text-lg focus-visible:ring-0 focus-visible:ring-inset focus-visible:ring-offset-0"
              required
            />
          </div>

          <div className="text-sm text-gray-200">
            By continuing, I represent that I have read, understand, and fully
            agree to the Sendbox{" "}
            <Link
              style={{ color: store?.customizations?.theme.primary }}
              to="/terms"
            >
              terms of service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              style={{ color: store?.customizations?.theme.primary }}
            >
              privacy policy
            </Link>
            .
          </div>

          <Button
            type="submit"
            disabled={isPending}
            style={{ background: store?.customizations?.theme.primary }}
            className="w-full h-12 text-base font-medium text-white gap-2"
          >
            {isPending && <Loader2 size={18} className=" animate-spin" />}
            CONTINUE
          </Button>
        </form>
      </div>
    </div>
  );
}
