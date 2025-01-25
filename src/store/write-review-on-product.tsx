"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { cn, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import type { IProduct, IRating } from "@/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Star } from "lucide-react";
import { type FC, type ReactNode, useState } from "react";
import { Img } from "react-image";
import { useStoreBuildState } from ".";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const WriteReviewOnProduct: FC<{
  product: Partial<IProduct>;
  children: ReactNode;
}> = ({ children, product }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { currentStore: store } = useStoreBuildState();
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const isMobile = useMediaQuery("(max-width:797px)");
  const [isPending, startTransition] = useState(false);

  const ratings = ["Bad", "So-so", "Ok", "Good", "Great"];

  const WriteReviewOnProduct = async () => {
    try {
      startTransition(true);
      const payload: IRating = {
        note: review,
        productId: product._id!,
        storeId: store?._id!,
        userEmail: email,
        rating: selectedRating || 0 + 1,
      };

      const res = await storeBuilder.writeReviewOnProduct(payload);
      queryClient.invalidateQueries({
        queryKey: ["productReview", product._id],
      });
      toast({
        title: "REVIEW POSTED",
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
    } finally {
      startTransition(false);
    }
  };

  const content = (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4 rounded-lg dark:bg-slate-900 dark:text-white text-slate-900 bg-gray-100 p-4 shadow-sm">
        <Img
          src={
            product?.media?.[0]?.url ||
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_24-1-2025_123159_dribbble.com-FAt6fq1Oso31FvxSXZRQeJGXU5xm8E.jpeg"
          }
          alt={product.productName}
          className="h-16 w-16 rounded-md object-cover"
        />
        <h2 className="text-lg font-semibold">{product.productName}</h2>
      </div>

      <div className="rounded-lg dark:bg-slate-900 bg-gray-100 p-6 shadow-sm">
        <div className="flex justify-between px-4">
          {ratings.map((label, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2"
              onMouseEnter={() => setIsHovered(idx)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Button
                size="icon"
                variant="ghost"
                onMouseLeave={() => setIsHovered(null)}
                onMouseEnter={() => setIsHovered(idx)}
                style={{
                  background:
                    selectedRating === idx || isHovered === idx
                      ? store?.customizations?.theme.primary
                      : "",
                }}
                onClick={() => setSelectedRating(idx)}
                className={cn(
                  "h-12 w-12 rounded-full transition-all hover:scale-110"
                )}
              >
                <Star
                  size={24}
                  className={cn(
                    selectedRating === idx && "fill-current",
                    isHovered === idx &&
                      selectedRating === null &&
                      "fill-current"
                  )}
                />
              </Button>
              <span
                style={{
                  color:
                    selectedRating === idx || isHovered === idx
                      ? store?.customizations?.theme.primary
                      : "",
                }}
                className={cn("text-sm text-gray-600")}
              >
                {label} ({idx + 1}/5)
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="What's your email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Review</label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like or dislike? What did you use this product for?"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="px-0 pt-4">
          {content}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                disabled={!(selectedRating && email && review) || isPending}
                onClick={WriteReviewOnProduct}
                style={{ background: store?.customizations?.theme.primary }}
                variant="shine"
              >
                Post Review
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl px-0 pt-4">
        {content}
        <DialogFooter className="px-7">
          <DialogClose asChild>
            <Button
              disabled={!(selectedRating && email && review) || isPending}
              onClick={WriteReviewOnProduct}
              style={{ background: store?.customizations?.theme.primary }}
              variant="shine"
            >
              Post Review
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WriteReviewOnProduct;
