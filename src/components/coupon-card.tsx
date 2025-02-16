import { type FC } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircleIcon,
  PackageIcon,
  PencilIcon,
  ShoppingCartIcon,
  TagIcon,
  TrashIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import type { ICoupon } from "@/types";
import { Badge } from "./ui/badge";
import { CouponCreator } from "./coupon-creator";
import { Button } from "./ui/button";

const CouponCard: FC<ICoupon> = (coupon) => {
  const queryClient = useQueryClient();

  const getUsageCount = (customerUsage?: Record<string, number>) => {
    if (!customerUsage) return 0;
    return Object.values(customerUsage).reduce((sum, count) => sum + count, 0);
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      const res = await storeBuilder.deleteCoupon(couponId);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { status: title, message: description } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    }
  };

  const isActive = new Date(coupon.expirationDate) > new Date();

  return (
    <div>
      <Card key={coupon._id} className="overflow-hidden shadow-lg">
        {/* Header with Coupon Code and Type */}
        <div className="p-3 bg-slate-900">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                {coupon.couponCode || "Auto-Applied Discount"}
              </h3>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                {coupon.appliedTo === "shoppingCart"
                  ? "Cart Discount"
                  : "Product Discount"}
              </span>
            </div>
            <Badge className="text-[13px] font-light rounded-md">
              {coupon.type === "percentageCoupon"
                ? `${coupon.discountValue}% OFF`
                : `₦${coupon.discountValue} OFF`}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Expiration Date */}
            <div className="flex items-center text-sm">
              <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <span className="block text-gray-500">Expires</span>
                <span className="font-medium">
                  {new Date(coupon.expirationDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Applied To */}
            <div className="flex items-center text-sm">
              {coupon.appliedTo === "shoppingCart" ? (
                <ShoppingCartIcon className="w-5 h-5 mr-2 text-gray-400" />
              ) : (
                <PackageIcon className="w-5 h-5 mr-2 text-gray-400" />
              )}
              <div>
                <span className="block text-gray-500">Applied To</span>
                <span className="font-medium capitalize">
                  {coupon.appliedTo}
                </span>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="flex items-center text-sm">
              <UsersIcon className="w-5 h-5 mr-2 text-gray-400" />
              <div>
                <span className="block text-gray-500">Usage</span>
                <span className="font-medium">
                  {getUsageCount(coupon.customerUsage)} / {coupon.maxUsage}
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center text-sm">
              {isActive ? (
                <Badge className="bg-green-100 rounded-md text-green-700 flex items-center gap-1 hover:bg-green-200 px-3 py-1">
                  <CheckCircleIcon className="w-4 h-4" />
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <XCircleIcon className="w-4 h-4" />
                  Expired
                </Badge>
              )}
            </div>
          </div>

          {/* Products & Categories */}
          <div className="space-y-2 bg-slate-900 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <span>
                {coupon.selectedProducts.length > 0
                  ? `${coupon.selectedProducts.length} Products Selected`
                  : "All Products"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <span>
                {coupon.selectedCategories.length > 0
                  ? `${coupon.selectedCategories.length} Categories Selected`
                  : "All Categories"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-slate-900 px-6 py-4">
          <div className="flex justify-end items-center gap-3 w-full">
            <CouponCreator
              coupon={coupon}
              onSubmit={() => {
                queryClient.invalidateQueries({ queryKey: ["coupons"] });
              }}
            >
              <Button
                size="sm"
                className="gap-1 bg-gray-800 hover:bg-gray-700 text-white"
              >
                <PencilIcon size={16} /> Edit
              </Button>
            </CouponCreator>
            <ConfirmationModal onConfirm={() => deleteCoupon(coupon._id!)}>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1 text-gray-700 border-gray-300 dark:text-gray-300"
              >
                <TrashIcon className="h-4 w-4" /> Delete
              </Button>
            </ConfirmationModal>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CouponCard;
