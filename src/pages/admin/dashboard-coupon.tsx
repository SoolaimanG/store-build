"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, TicketIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CouponCreator } from "@/components/coupon-creator";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyProductState } from "@/components/empty";
import CouponCard from "@/components/coupon-card";

export default function DashboardCoupon() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => storeBuilder.getCoupons(),
  });

  const { data: coupons = [] } = data || {};

  if (isLoading) {
    return (
      <div className="grid container mx-auto p-3 space-y-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="bg-purple-950 p-4">
              <Skeleton className="h-6 w-3/4 bg-purple-800" />
              <Skeleton className="h-4 w-1/2 mt-2 bg-purple-800" />
            </div>
            <CardContent className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
              <div className="border-t pt-4 mt-4 space-y-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <Skeleton className="h-6 w-1/4" />
            </CardContent>
            <CardFooter className="bg-slate-900 px-6 py-3">
              <div className="flex justify-end items-end gap-3 w-full">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div>Error loading coupons. Please try again later.</div>;
  }

  if (!coupons.length)
    return (
      <div className="container mx-auto p-3 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Active Coupons</h2>
          <CouponCreator>
            <Button
              variant={"ringHover"}
              size="sm"
              onClick={() => {}}
              className=""
            >
              <PlusIcon className="mr-2 h-4 w-4" /> New Coupon
            </Button>
          </CouponCreator>
        </div>
        <EmptyProductState
          icon={TicketIcon}
          header="No Coupon Found"
          message="No Coupons created so far, you can create a coupon by clicking the button below"
        >
          <CouponCreator>
            <Button variant="ringHover" size="lg" className="gap-1">
              <PlusIcon />
              Create Coupon
            </Button>
          </CouponCreator>
        </EmptyProductState>
      </div>
    );

  return (
    <div className="container mx-auto p-3 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Active Coupons</h2>
        <CouponCreator>
          <Button
            variant={"ringHover"}
            size="sm"
            onClick={() => {}}
            className=""
          >
            <PlusIcon className="mr-2 h-4 w-4" /> New Coupon
          </Button>
        </CouponCreator>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons?.map((coupon) => (
          <CouponCard key={coupon._id} {...coupon} />
        ))}
      </div>
    </div>
  );
}
