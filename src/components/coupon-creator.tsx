import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import { ICoupon, IProduct } from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { DatePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  errorMessageAndStatus,
  formatAmountToNaira,
  generateRandomString,
  storeBuilder,
} from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ProductSelector } from "./product-selector";
import { Badge } from "./ui/badge";
import { Img } from "react-image";
import { Text } from "./text";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const couponSchema = z.object({
  couponCode: z.string().min(3).max(20),
  expirationDate: z.string(),
  selectedProducts: z.array(z.string()),
  selectedCategories: z.array(z.string()),
  appliedTo: z.enum(["shoppingCart", "products"]),
  type: z.enum(["percentageCoupon", "nairaCoupon"]),
  discountValue: z.number().positive(),
  maxUsage: z.number().int().positive(),
});

interface CouponCreatorProps {
  children: ReactNode;
  coupon?: ICoupon;
  onSubmit?: () => void;
}

export function CouponCreator({
  children,
  coupon,
  onSubmit,
}: CouponCreatorProps) {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width:767px)");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);

  const form = useForm<ICoupon>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponCode: coupon?.couponCode || "",
      expirationDate: coupon?.expirationDate || new Date().toISOString(),
      selectedProducts: coupon?.selectedProducts || [],
      selectedCategories: coupon?.selectedCategories || [],
      appliedTo: coupon?.appliedTo || "shoppingCart",
      type: coupon?.type || "percentageCoupon",
      discountValue: coupon?.discountValue || 1,
      maxUsage: coupon?.maxUsage || 10,
    },
  });

  const handleSubmit = async (data: ICoupon) => {
    try {
      const c: ICoupon = {
        ...data,
        _id: coupon?._id,
        selectedProducts: selectedProducts.map((product) => product._id!),
      };
      const res = await storeBuilder.createCoupon(c);
      queryClient.invalidateQueries({ queryKey: ["coupons"] });

      onSubmit && onSubmit();

      toast({
        title: "SUCCESS",
        description: res.message,
      });
    } catch (error) {
      const { message: description, status: title } =
        errorMessageAndStatus(error);
      toast({
        title,
        description,
        variant: "destructive",
      });
    } finally {
      setIsOpen(false);
    }
  };

  const { data } = useQuery({
    queryKey: ["selected-products"],
    queryFn: () => storeBuilder.getProductsWithIds(coupon?.selectedProducts!),
    enabled: Boolean(!!coupon?.selectedProducts),
  });

  const { data: products = [] } = data || {};

  useEffect(() => {
    if (!!products.length) {
      setSelectedProducts(products);
    }
  }, [data]);

  const Content = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="couponCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <Input placeholder="SUMMER2023" {...field} />
                </FormControl>
                <Button
                  size="sm"
                  onClick={() => {
                    form.setValue(
                      "couponCode",
                      generateRandomString(10).toUpperCase()
                    );
                  }}
                  type="button"
                >
                  Generate
                </Button>
              </div>
              <FormDescription>
                Enter a unique code for this coupon or generate one.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                <DatePicker
                  date={new Date(field.value)}
                  setDate={(e) =>
                    form.setValue("expirationDate", e.toISOString())
                  }
                />
              </FormControl>
              <FormDescription>
                Select when this coupon will expire.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appliedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applied To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select where to apply" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="shoppingCart">Shopping Cart</SelectItem>
                  <SelectItem value="products">Specific Products</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose where this coupon can be applied.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("appliedTo") === "products" && (
          <>
            <FormField
              control={form.control}
              name="selectedProducts"
              render={() => (
                <FormItem>
                  <FormControl>
                    <ProductSelector
                      onSelect={(products) => {
                        setSelectedProducts(products);
                      }}
                      products={!!products.length ? products : selectedProducts}
                    >
                      <Button>Select Products</Button>
                    </ProductSelector>
                  </FormControl>
                  <FormDescription>
                    Select the products this coupon applies to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((product) => (
                <Badge
                  variant="secondary"
                  className="rounded-sm py-1 gap-3 bg-slate-900 relative"
                  key={product._id}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="top-0 right-0 absolute -mt-2 -mr-2 w-6 h-6 rounded-full"
                    onClick={() => {
                      setSelectedProducts((prev) =>
                        prev.filter((p) => p._id !== product._id)
                      );
                    }}
                  >
                    <X size={17} />
                  </Button>
                  <Img
                    className="w-[2.5rem] h-[2.5rem]"
                    src={product.media[0]?.url}
                  />
                  <div>
                    <h3>{product.productName}</h3>
                    <Text>
                      {formatAmountToNaira(
                        product.discount || product.price.default || 0
                      )}
                    </Text>
                  </div>
                </Badge>
              ))}
            </div>

            {/* <FormField
              control={form.control}
              name="selectedCategories"
              render={() => (
                <FormItem>
                  <FormLabel>Select Categories</FormLabel>
                  <div className="space-y-2">
                    {[].map((category) => (
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="selectedCategories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          category.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== category.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Select the categories this coupon applies to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </>
        )}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percentageCoupon">Percentage</SelectItem>
                  <SelectItem value="nairaCoupon">
                    Fixed Amount (Naira)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type of discount for this coupon.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseFloat(e.target.value))
                  }
                />
              </FormControl>
              <FormDescription>
                {form.watch("type") === "percentageCoupon"
                  ? "Enter the percentage discount (e.g., 10 for 10% off)"
                  : "Enter the fixed amount discount in Naira"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxUsage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Usage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number.parseInt(e.target.value))
                  }
                />
              </FormControl>
              <FormDescription>
                Set the maximum number of times this coupon can be used.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting || form.formState.isLoading}
          type="submit"
          className="w-full"
        >
          {coupon ? "Edit Coupon" : "Create Coupon"}
        </Button>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Coupon</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="px-4 py-2 h-[570px]">{Content}</ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px]">{Content}</ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
