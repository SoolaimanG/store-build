import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useStoreBuildState } from "@/store";
import { useToastError } from "@/hooks/use-toast-error";

// Define the schema for our form
const formSchema = z.object({
  q: z.string().optional(),
  sort: z
    .enum(["default", "stock-level", "low-to-high", "high-to-low"])
    .optional(),
  category: z.string().min(1).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  size: z.number().optional(),
});

// Infer the type from our schema
type ProductFiltersFormValues = z.infer<typeof formSchema>;

// Define the props for our component
interface ProductFiltersFormProps {
  onSubmit: (values: ProductFiltersFormValues) => void;
  initialValues: Partial<ProductFiltersFormValues>;
  priceRange: { min: number; max: number };
}

export function ProductFiltersForm({
  onSubmit,
  initialValues,
  priceRange,
}: ProductFiltersFormProps) {
  const { user } = useStoreBuildState();

  const { data, error } = useQuery({
    queryKey: ["categories", user?.storeId],
    queryFn: () => storeBuilder.getCategories(user?.storeId || ""),
  });

  useToastError(error);

  const { data: categories } = data || {};

  const form = useForm<ProductFiltersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      minPrice: initialValues.minPrice || priceRange.min,
      maxPrice: initialValues.maxPrice || priceRange.max,
    },
  });

  const [priceRangeValue, setPriceRangeValue] = React.useState<number[]>([
    form.getValues("minPrice") || priceRange.min,
    form.getValues("maxPrice") || priceRange.max,
  ]);

  React.useEffect(() => {
    form.setValue("minPrice", priceRangeValue[0]);
    form.setValue("maxPrice", priceRangeValue[1]);
  }, [priceRangeValue, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="sort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sorting" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="stock-level">Stock Level</SelectItem>
                  <SelectItem value="low-to-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="high-to-low">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category.slot}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Price Range</FormLabel>
          <FormControl>
            <Slider
              min={priceRange.min}
              max={priceRange.max}
              step={1}
              value={priceRangeValue}
              onValueChange={(e) => setPriceRangeValue(e)}
              className="mt-2"
            />
          </FormControl>
          <div className="flex justify-between mt-2">
            <span>{formatAmountToNaira(priceRangeValue[0])}</span>
            <span>{formatAmountToNaira(priceRangeValue[1])}</span>
          </div>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : undefined
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="ringHover" className="w-full" type="submit">
          Apply Filters
        </Button>
      </form>
    </Form>
  );
}
