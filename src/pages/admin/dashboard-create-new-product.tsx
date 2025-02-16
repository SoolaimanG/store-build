import React, { useEffect, useState } from "react";
import { ImagePlus, X, Video, Plus, Upload } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { availableGenders, productSchema } from "@/constants";
import { DigitalProductUpload } from "@/components/upload-digital-product";
import { useDropzone } from "react-dropzone";
import TextEditor from "@/components/text-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChromePicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { ManageIntegration } from "@/components/manage-integration";
import {
  addQueryParameter,
  errorMessageAndStatus,
  generateRandomString,
  storeBuilder,
  uploadImage,
} from "@/lib/utils";
import queryString from "query-string";
import {
  IAvailableColors,
  IDeliveryIntegration,
  IGender,
  IProduct,
  PATHS,
} from "@/types";
import { useStoreBuildState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/text";
import { CreateCollection } from "@/components/create-collection";
import { useToastError } from "@/hooks/use-toast-error";
import { Badge } from "@/components/ui/badge";

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

const parseColorsFromURL = () => {
  const url = new URL(window.location.href);
  const colorsParam = url.searchParams.get("availableColors");

  if (colorsParam) {
    try {
      const colors = JSON.parse(decodeURIComponent(colorsParam));
      return Array.isArray(colors) ? colors : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const parseSizePricesFromURL = () => {
  const url = new URL(window.location.href);
  const sizePricesParam = url.searchParams.get("price.sizes");

  if (sizePricesParam) {
    try {
      const sizes = JSON.parse(decodeURIComponent(sizePricesParam));
      return Array.isArray(sizes) ? sizes : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const parseSizesFromURL = () => {
  const url = new URL(window.location.href);
  const sizeParam = url.searchParams.get("availableSizes");

  if (sizeParam) {
    try {
      const sizes = JSON.parse(decodeURIComponent(sizeParam));
      return Array.isArray(sizes) ? sizes : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const ProductManagement = () => {
  const { id: productId = "" } = useParams();
  const { user } = useStoreBuildState();
  const location = useLocation();
  const n = useNavigate();

  const isEditingMode = location.hash === "#edit";

  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", hex: "#E41515" });

  const { data, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => storeBuilder.getProduct(productId),
    enabled: isEditingMode,
  });

  const { data: product } = data || {};

  const qs = queryString.parse(location.search, {
    parseBooleans: true,
    parseNumbers: true,
  }) as unknown as IProduct;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: qs?.productName || "",
      description: qs?.description || "",
      category: qs?.category || "",
      tags: [],
      price: {
        //   @ts-ignore
        default: qs.price,
        //   @ts-ignore
        useDefaultForAll: qs?.useDefaultForAll || false,
        sizes: parseSizePricesFromURL(),
      },
      discount: qs?.discount || 0,
      colors: parseColorsFromURL() || [],
      availableSizes: parseSizesFromURL(),
      stockQuantity: qs?.stockQuantity || 0,
      maxStock: qs?.maxStock || 0,
      isDigital: qs?.isDigital || false,
      gender: qs?.gender || [],
      shippingDetails: {
        //   @ts-ignore

        isFreeShipping: qs?.isFreeShipping || false,
        //   @ts-ignore

        shippingCost: qs?.shippingCost || 0,
        //   @ts-ignore

        weight: qs?.weight || 0,
        dimensions: {
          //   @ts-ignore

          length: qs?.length || 0,
          //   @ts-ignore

          width: qs?.width || 0,
          //   @ts-ignore

          height: qs?.height || 0,
        },
      },
      isActive: qs?.isActive || true,
      shippingRegions: [],
      media: [],
    },
  });

  const handleMediaUpload = async (files: File[]) => {
    if (files) {
      setIsUploading(true);

      setTimeout(() => {
        const newImages = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setImages((prevImages) => [...prevImages, ...newImages]);
        form.setValue("media", [
          ...(form.getValues("media") || []),
          ...newImages.map((image, idx) => ({
            altText: generateRandomString(8),
            mediaType: files[idx].type.split("/")[0],
            url: image,
          })),
        ]);
        setFiles((prev) => [...prev, ...files]);
        setIsUploading(false);
      }, 1500);
    }
  };

  const {
    isLoading: isLoadingRegions,
    data: regionsData,
    error: regionsError,
  } = useQuery({
    queryKey: ["integration", "sendbox"],
    queryFn: () => storeBuilder.getIntegration("sendbox"),
  });

  const { data: integration } = regionsData || {};

  // @ts-ignore
  const r = integration?.integration?.settings as IDeliveryIntegration;
  const regions = Array.from(new Set(r?.shippingRegions || []));

  const onSubmit = async (isActive = true) => {
    const values = form.getValues();

    try {
      let imgs: string[] = [...images];

      for (const file of files) {
        const res = await uploadImage(file);
        imgs = [...imgs, res.data.display_url];
      }

      imgs = imgs.filter((image) => image.startsWith("http"));

      const availableColors: IAvailableColors[] =
        values?.colors?.map((color) => ({
          ...color,
          colorCode: color.hex,
        })) || [];

      const media =
        values?.media?.map((m, idx) => ({
          ...m,
          url: imgs[idx],
          mediaType: m.mediaType as "image",
        })) || [];

      const product: IProduct = {
        _id: isEditingMode ? productId : undefined,
        productName: values.name,
        description: values.description,
        availableColors,
        availableSizes: values.availableSizes || [],
        price: {
          default: values.price.default || 0,
          useDefaultPricingForDifferentSizes:
            values.price.useDefaultForAll || false,
          sizes: [],
        },
        discount: values.discount || 0,
        isDigital: values.isDigital || false,
        isActive: isActive || values.isActive || false,
        maxStock: values.maxStock || 0,
        stockQuantity: values.stockQuantity || 0,
        tags: values.tags || [],
        weight: values.shippingDetails?.weight || 0,
        shippingDetails: {
          isFreeShipping: values?.shippingDetails?.isFreeShipping || false,
          shipAllRegion: values?.shipAllRegion || false,
          shippingCost: values?.shippingDetails?.shippingCost || 0,
          shippingRegions:
            (values?.shipAllRegion ? regions : values.shippingRegions) || [],
        },
        storeId: user?.storeId || "",
        dimensions: {
          height: values.shippingDetails?.dimensions?.height || 0,
          length: values.shippingDetails?.dimensions?.length || 0,
          width: values.shippingDetails?.dimensions?.width || 0,
        },
        category: values.category || "",
        gender: (values.gender as IGender[]) || [],
        media,
      };

      const res = await storeBuilder.createOrEditProduct(product);

      const description =
        res.message || "Your product has been created successfully.";

      form.reset();
      window.location.replace(
        PATHS.STORE_PRODUCTS + generateRandomString(8) + "#new"
      );
      toast({
        title: "SUCCESS",
        description,
      });
    } catch (error) {
      const err = errorMessageAndStatus(error);
      console.error(error);
      toast({
        title: err.status,
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const removeMedia = (index: number) => {
    const currentMedia = form.getValues("media") || [];
    form.setValue(
      "media",
      currentMedia.filter((_, i) => i !== index)
    );

    setImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const saveToURL = (key: string, value: any) => {
    let processedValue = value;
    if (key === "colors" && Array.isArray(value)) {
      processedValue = value
        .map((color) => `${color.name}:${color.hex}`)
        .join(",");
    }
    const q = addQueryParameter(key, processedValue);
    n(`?${q} ${isEditingMode ? "#edit" : "#new"}`);
  };

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      handleMediaUpload(acceptedFiles);
    },
    [handleMediaUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    multiple: true,
  });

  const {
    isLoading: isLoadingCategories,
    data: categoriesData,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories", user?.storeId],
    queryFn: () => storeBuilder.getCategories(user?.storeId || ""),
    enabled: Boolean(user?.storeId),
  });

  const { data: categories } = categoriesData || {};

  useEffect(() => {
    if (product) {
      const colors = product.availableColors.map((color) => ({
        ...color,
        hex: color.colorCode,
      }));

      const media = product.media.flatMap((m) => ({
        altText: m.altText as string,
        mediaType: m.mediaType as string,
        url: m.url,
      }));

      form.reset({
        name: product.productName || "",
        description: product.description || "",
        colors: colors || [],
        isDigital: product.isDigital || false,
        gender: product.gender || [],
        stockQuantity: product.stockQuantity || 0,
        maxStock: product.maxStock || 0,
        shippingDetails: {
          isFreeShipping: product.shippingDetails?.isFreeShipping || false,
          shippingCost: product.shippingDetails?.shippingCost || 0,
          weight: product.weight || 0,
          dimensions: {
            height: product.dimensions?.height || 0,
            length: product.dimensions?.length || 0,
            width: product.dimensions?.width || 0,
          },
        },
        isActive: product.isActive ?? true,
        category: product.category || "",
        shipAllRegion: product.shippingDetails?.shipAllRegion || false,
        shippingRegions: product.shippingDetails?.shippingRegions || [],
        price: {
          useDefaultForAll:
            product.price?.useDefaultPricingForDifferentSizes || false,
          default: product.price?.default || 0,
          // @ts-ignore
          sizes: product.price?.sizes || {},
        },
        media: media || [],
        availableSizes: product.availableSizes || [],
        tags: product.tags || [],
        discount: product.discount || 0,
      });

      setImages(media.map((m) => m.url));
    }
  }, [product, form, categoriesData]);

  useToastError(regionsError || categoriesError || error);

  return (
    <Section className="max-w-7xl mx-auto p-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between gap-3 mb-8"
      >
        <h2 className="font-semibold text-2xl line-clamp-1">
          {isEditingMode ? `Edit Product ${productId}` : "Add New Product"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            disabled={form.formState.isSubmitting || isUploading}
            onClick={() => onSubmit(false)}
            variant="outline"
            size="sm"
          >
            Save Draft
          </Button>
          <Button
            disabled={form.formState.isSubmitting || isUploading}
            size="sm"
            onClick={() => onSubmit()}
          >
            {isEditingMode ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </motion.header>

      <Form {...form}>
        <form onSubmit={() => onSubmit()} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">General Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            saveToURL("productName", e.target.value);
                          }}
                          className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={() => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TextEditor
                          text={form.watch("description")}
                          onChange={(e) => {
                            form.setValue("description", e);
                            saveToURL("description", e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Media Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors duration-200 ease-in-out cursor-pointer ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                >
                  <Input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <ImagePlus className="h-10 w-10 text-muted-foreground" />
                      <Video className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {isDragActive
                          ? "Drop files here"
                          : "Drag & drop files here"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to select files
                      </p>
                    </div>
                    <Button type="button" variant="outline" className="mt-2">
                      Select Files
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {/* @ts-ignore */}
                  {form.watch("media") && form.watch("media").length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="overflow-x-auto pb-4"
                    >
                      <div className="flex space-x-4 min-w-max">
                        {/* @ts-ignore */}
                        {form.watch("media").map((item, index) => (
                          <motion.div
                            key={`${item.url}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden group"
                          >
                            {item.mediaType === "image" ? (
                              <img
                                src={item.url}
                                alt={item.altText}
                                className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-110"
                              />
                            ) : (
                              <video
                                src={item.url}
                                className="object-cover w-full h-full rounded-lg"
                              />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <Button
                                size="icon"
                                variant="destructive"
                                type="button"
                                className="h-8 w-8 rounded-full"
                                onClick={() => removeMedia(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Colors</FormLabel>
                      <FormDescription>
                        Add and manage available colors for this product.
                      </FormDescription>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {field?.value?.map((color, index) => (
                            <div
                              key={`${color.name}-${index}`}
                              className="flex items-center space-x-2 bg-muted p-2 rounded-md"
                            >
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span>{color.name}</span>
                              <Button
                                disabled={form.watch("isDigital")}
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedColors =
                                    field.value?.filter(
                                      (_, i) => i !== index
                                    ) || [];
                                  field.onChange(updatedColors);
                                  saveToURL(
                                    "availableColors",
                                    encodeURIComponent(
                                      JSON.stringify(updatedColors)
                                    )
                                  );
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1 space-y-1">
                            <Label htmlFor="colorName">Color Name</Label>
                            <Input
                              disabled={form.watch("isDigital")}
                              id="colorName"
                              value={newColor.name}
                              className="h-[36px] transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                              onChange={(e) =>
                                setNewColor({
                                  ...newColor,
                                  name: e.target.value,
                                })
                              }
                              placeholder="e.g., Red, Blue, Green"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label htmlFor="colorPicker">Color</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  disabled={form.watch("isDigital")}
                                  id="colorPicker"
                                  variant="outline"
                                  className="w-[80px] h-[36px] p-0 border-slate-600"
                                >
                                  <div
                                    className="w-full h-full rounded-md"
                                    style={{ backgroundColor: newColor.hex }}
                                  />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <ChromePicker
                                  color={newColor.hex}
                                  onChange={(color) =>
                                    setNewColor({ ...newColor, hex: color.hex })
                                  }
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <Button
                            disabled={form.watch("isDigital")}
                            size="sm"
                            type="button"
                            onClick={() => {
                              if (newColor.name && newColor.hex) {
                                const updatedColors = [
                                  ...(field.value || []),
                                  newColor,
                                ];
                                field.onChange(updatedColors);
                                saveToURL(
                                  "availableColors",
                                  encodeURIComponent(
                                    JSON.stringify(updatedColors)
                                  )
                                );
                                setNewColor({ name: "", hex: "#E41515" });
                              } else {
                                toast({
                                  title: "Missing Color Name",
                                  description:
                                    "Please add a color name in order to add your color",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Color
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">Stock</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                            saveToURL(
                              "stockQuantity",
                              parseInt(e.target.value)
                            );
                          }}
                          className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                            saveToURL("maxStock", parseInt(e.target.value));
                          }}
                          className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">Product Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isDigital"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e);
                            saveToURL("isDigital", e);
                          }}
                          className="transition-all duration-300 ease-in-out"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Digital Product</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <div className="flex gap-4 flex-wrap">
                          {["M", "F", "U"].map((gender) => (
                            <Label
                              key={gender}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox
                                checked={field?.value?.includes(gender)}
                                disabled={form.watch("isDigital")}
                                onCheckedChange={(checked) => {
                                  const updatedGender = checked
                                    ? [...(field?.value || []), gender]
                                    : field?.value?.filter((g) => g !== gender);
                                  saveToURL("gender", updatedGender);
                                  field.onChange(updatedGender);
                                }}
                                className="transition-all duration-300 ease-in-out"
                              />
                              {
                                availableGenders.find((g) => g.sex === gender)
                                  ?.label
                              }
                            </Label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {form.watch("isDigital") ? (
              <DigitalProductUpload
                uploadedFile={null}
                onFileUpload={(e) => console.log(e)}
              />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">Shipping Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shippingDetails.isFreeShipping"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            disabled={form.watch("isDigital")}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              saveToURL("isFreeShipping", checked);
                              if (checked) {
                                form.setValue(
                                  "shippingDetails.shippingCost",
                                  0
                                );
                                saveToURL("shippingCost", 0);
                              }
                            }}
                            className="transition-all duration-300 ease-in-out"
                          />
                        </FormControl>
                        <FormLabel className="text-sm">Free Shipping</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingDetails.shippingCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Shipping Cost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value));
                              saveToURL(
                                "shippingCost",
                                parseFloat(e.target.value)
                              );
                            }}
                            className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                            disabled={
                              form.watch("shippingDetails.isFreeShipping") ||
                              form.watch("isDigital")
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="shippingDetails.weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Weight (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              disabled={form.watch("isDigital")}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value));
                                saveToURL("weight", parseFloat(e.target.value));
                              }}
                              className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingDetails.dimensions.length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Length (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              disabled={form.watch("isDigital")}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value));
                                saveToURL("length", e.target.value);
                              }}
                              className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingDetails.dimensions.width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Width (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              disabled={form.watch("isDigital")}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value));
                                saveToURL("width", e.target.value);
                              }}
                              className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingDetails.dimensions.height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Height (cm)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              disabled={form.watch("isDigital")}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value));
                                saveToURL("height", e.target.value);
                              }}
                              className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl">Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(e) => {
                            field.onChange(e);
                            saveToURL("isActive", e);
                          }}
                          className="transition-all duration-300 ease-in-out"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Active</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoadingCategories}
                          onValueChange={(e) => {
                            field.onChange(e);
                            saveToURL("category", e);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {!categories?.length ? (
                              <div className="w-full h-[5rem] flex items-center justify-center">
                                <Text>No Categories</Text>
                              </div>
                            ) : (
                              categories?.map((category) => (
                                <SelectItem
                                  key={category.slot}
                                  value={category.slot}
                                  className="capitalize"
                                >
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CreateCollection>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                  >
                    Add Category
                  </Button>
                </CreateCollection>
              </CardContent>
            </Card>

            <Card className="h-full p-6 space-y-10">
              <CardHeader className="p-0">
                <CardTitle className="text-xl">Shipping Regions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-0">
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Allow shipping to all state
                    </FormLabel>
                    <FormDescription>
                      If enabled, this product will be able to ship to all
                      regions on your available regions.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={form.watch("isDigital")}
                      checked={form.watch("shipAllRegion") || false}
                      onCheckedChange={(e) => {
                        form.setValue("shipAllRegion", e);
                        saveToURL("shipAllRegion", e);
                      }}
                      className="transition-all duration-300 ease-in-out"
                    />
                  </FormControl>
                </FormItem>

                {!form.watch("shipAllRegion") && (
                  <FormField
                    control={form.control}
                    name="shippingRegions"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel>Shipping Regions</FormLabel>
                        <FormControl>
                          <Select
                            disabled={
                              isLoadingRegions || form.watch("isDigital")
                            }
                            onValueChange={(state) => {
                              const currentStates = field.value || [];
                              let newStates: string[];

                              if (currentStates.includes(state)) {
                                newStates = currentStates.filter(
                                  (s: string) => s !== state
                                );
                              } else {
                                newStates = [...currentStates, state];
                              }

                              field.onChange(newStates);
                              saveToURL("shippingRegions", newStates);
                            }}
                            value={
                              field?.value?.[field?.value?.length - 1] || ""
                            }
                          >
                            <SelectTrigger className="capitalize">
                              <SelectValue
                                className="capitalize"
                                placeholder="Select States"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {!regions?.length ? (
                                <div className="w-full h-[5rem] flex items-center justify-center">
                                  <Text>No States Available</Text>
                                </div>
                              ) : (
                                regions.map((region, index) => (
                                  <SelectItem
                                    key={`${region}-${index}`}
                                    value={region}
                                    className="capitalize"
                                  >
                                    {region}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        {/* @ts-ignore */}
                        {field?.value?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {field?.value?.map(
                              (state: string, index: number) => (
                                <Badge
                                  key={`${state}-${index}`}
                                  variant="secondary"
                                  className="capitalize px-3 py-1 bg-slate-900 rounded-sm"
                                >
                                  {state}
                                  <button
                                    onClick={() => {
                                      // @ts-ignore
                                      const newStates = field.value.filter(
                                        (s: string) => s !== state
                                      );
                                      field.onChange(newStates);
                                      saveToURL("shippingRegions", newStates);
                                    }}
                                    className="ml-2 hover:text-destructive focus:outline-none"
                                    type="button"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              )
                            )}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <ManageIntegration
                  integration={{
                    // @ts-ignore
                    connected: integration?.integration.isConnected,
                    description: "",
                    icon: "",
                    id: "sendbox",
                    name: "sendbox",
                  }}
                >
                  <Button disabled={form.watch("isDigital")} className="w-full">
                    Manage Shipping
                  </Button>
                </ManageIntegration>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sizes and Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="price.default"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value));
                            saveToURL("price", e.target.value);
                          }}
                          className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!form.watch("isDigital") && (
                  <FormField
                    control={form.control}
                    name="price.sizes"
                    render={({ field }) => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Available Sizes
                          </FormLabel>
                          <FormDescription>
                            Select the available sizes for this product.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {availableSizes.map((size) => (
                            <div key={size} className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={Boolean(
                                    field.value?.find(
                                      (v) => Object.keys(v)[0] === size
                                    )
                                  )}
                                  onCheckedChange={(checked) => {
                                    let newSizes = [...(field.value || [])];

                                    if (checked) {
                                      // Add new size with default price
                                      newSizes.push({
                                        [size]: form.getValues("price.default"),
                                      });
                                    } else {
                                      // Remove size
                                      newSizes = newSizes.filter(
                                        (sizeObj) =>
                                          !Object.keys(sizeObj).includes(size)
                                      );
                                    }

                                    field.onChange(newSizes);
                                    saveToURL(
                                      "price.sizes",
                                      encodeURIComponent(
                                        JSON.stringify(newSizes)
                                      )
                                    );
                                  }}
                                  className="transition-all duration-300 ease-in-out"
                                />
                                <FormLabel className="font-normal">
                                  {size}
                                </FormLabel>
                              </div>

                              {field.value?.some(
                                (sizeObj) => Object.keys(sizeObj)[0] === size
                              ) &&
                                !form.getValues("price.useDefaultForAll") && (
                                  <Input
                                    type="number"
                                    value={
                                      field.value.find(
                                        (sizeObj) =>
                                          Object.keys(sizeObj)[0] === size
                                      )?.[size] || ""
                                    }
                                    onChange={(e) => {
                                      const newPrice = parseFloat(
                                        e.target.value
                                      );
                                      const newSizes = field.value?.map(
                                        (sizeObj) => {
                                          if (
                                            Object.keys(sizeObj)[0] === size
                                          ) {
                                            return { [size]: newPrice };
                                          }
                                          return sizeObj;
                                        }
                                      );

                                      field.onChange(newSizes);
                                      saveToURL(
                                        "price.sizes",
                                        encodeURIComponent(
                                          JSON.stringify(newSizes)
                                        )
                                      );
                                    }}
                                    className="transition-all duration-300 ease-in-out hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary"
                                  />
                                )}
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </Section>
  );
};

export default ProductManagement;
