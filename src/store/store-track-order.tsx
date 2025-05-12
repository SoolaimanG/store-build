"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useStoreBuildState } from ".";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PATHS } from "@/types";

export default function StoreTrackOrder() {
  const { currentStore: store } = useStoreBuildState();
  const [orderId, setOrderId] = useState("");
  const n = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) {
      toast({
        title: "Order ID is required",
        description: "Please enter your order ID",
        variant: "destructive",
      });
      return;
    }
    n(PATHS.ORDERS + orderId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Enter the Order ID for your order....
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              htmlFor="tracking-code"
              className="text-sm font-medium text-gray-300 uppercase"
            >
              Order ID
            </label>
            <Input
              id="tracking-code"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="1234567890"
              className="h-12 text-lg focus-visible:ring-0 focus-visible:ring-inset focus-visible:ring-offset-0"
              required
            />
          </div>

          <div className="text-sm text-gray-200">
            By continuing, I represent that I have read, understand, and fully
            agree to the {store?.storeName}{" "}
            <Link
              style={{ color: store?.customizations?.theme?.primary }}
              to="/terms"
            >
              terms of service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              style={{ color: store?.customizations?.theme?.primary }}
            >
              privacy policy
            </Link>
            .
          </div>

          <Button
            type="submit"
            style={{ background: store?.customizations?.theme?.primary }}
            className="w-full h-12 text-base font-medium text-white gap-2"
          >
            CONTINUE
          </Button>
        </form>
      </div>
    </div>
  );
}
