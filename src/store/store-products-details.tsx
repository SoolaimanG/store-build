import { FC, Fragment, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Star,
  Store,
  TruckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Img } from "react-image";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  cn,
  formatAmountToNaira,
  getProductPrice,
  storeBuilder,
} from "@/lib/utils";
import { useStoreBuildState } from ".";
import { Text } from "@/components/text";
import { ICartItem, IDisplayStyle, IProduct, IStore } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { menu } from "@/constants";
import { BuyNowPreview } from "./store-buy-now-preview";
import { useLocalStorage } from "@uidotdev/usehooks";
import { toast } from "@/hooks/use-toast";
import { EmptyProductState } from "@/components/empty";
import WriteReviewOnProduct from "./write-review-on-product";
import { ReviewCard } from "./review-card";
import queryString from "query-string";
import { useToastError } from "@/hooks/use-toast-error";

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-28 pb-24 md:pb-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Rating Skeleton */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-6">
            {/* Price Skeleton */}
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* Size Selection Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-12 rounded-md" />
                ))}
              </div>
            </div>

            {/* Color Selection Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full" />
                ))}
              </div>
            </div>

            {/* Quantity Selector Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-12" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>

            {/* Stock Info Skeleton */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex gap-4">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner Skeleton */}
      <div className="mt-8">
        <Skeleton className="w-full h-48 rounded-lg" />
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-8">
        <div className="flex gap-4 border-b">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <Skeleton className="mt-4 h-32 w-full" />
      </div>

      {/* Mobile Fixed Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden">
        <div className="flex gap-4 max-w-lg mx-auto">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}

const ShareProduct: FC<{ product: IProduct }> = ({
  product: { productName, _id = "" },
}) => {
  const { currentStore } = useStoreBuildState();

  const shareProduct = async () => {
    try {
      // First check if sharing is supported
      if (!navigator.canShare) {
        console.warn("Web Share API is not supported");
        return;
      }

      const shareData = {
        text: `${currentStore?.storeName} | Products | ${productName}`,
        title: `${currentStore?.storeName} | Products | ${productName}`,
        url: menu(currentStore?.storeCode!)[2].path + _id,
      };

      // Check if the data can be shared
      if (navigator.canShare(shareData)) {
        // Actually share the data
        await navigator.share(shareData);
      } else {
        console.warn("This content cannot be shared");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Button
      onClick={shareProduct}
      variant="ghost"
      size="icon"
      className="rounded-full"
    >
      <Share2 className="w-4 h-4" />
    </Button>
  );
};

const ProductDetailsTab: FC<{ product: IProduct }> = ({ product }) => {
  const { currentStore: store } = useStoreBuildState();

  const { isLoading, data, error } = useQuery({
    queryKey: ["productReview", product._id],
    queryFn: () => storeBuilder.getProductReview(store?._id!, product._id!, 20),
  });

  const { data: reviews = [] } = data || {};

  const location = useLocation();
  const { tab } = queryString.parse(location.search) as { tab?: string };

  useToastError(error);

  if (isLoading) return null;

  return (
    <Tabs defaultValue={tab || "descriptions"} className="w-full mt-8">
      <TabsList
        className={cn(
          "grid w-full h-12 grid-cols-3 mb-8",
          !store?.customizations?.productPage.showReviews && "grid-cols-2"
        )}
      >
        <TabsTrigger value="descriptions" className="text-sm md:text-base">
          Description
        </TabsTrigger>
        {!product.isDigital && (
          <TabsTrigger
            value="deliveryLocations"
            className="text-sm md:text-base"
          >
            Locations
          </TabsTrigger>
        )}
        {store?.customizations?.productPage.showReviews && (
          <TabsTrigger value="reviews" className="text-sm md:text-base">
            Reviews
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="descriptions">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div
              className="prose max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </CardContent>
        </Card>
      </TabsContent>
      {!product.isDigital && (
        <TabsContent value="deliveryLocations">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-muted-foreground" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>Available delivery locations:</span>
                </div>
                <div className=" gap-3 flex items-center flex-wrap">
                  {product.shippingDetails.shippingRegions?.map(
                    (location, index) => (
                      <Button
                        key={index}
                        size="sm"
                        className="text-muted-foreground text-xs capitalize gap-1"
                        variant="ghost"
                      >
                        <TruckIcon size={18} />
                        {location}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
      {store?.customizations?.productPage.showReviews && (
        <TabsContent value="reviews">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`md:w-5 md:h-5 h-3 w-3 ${
                          i < Math.floor(product.averageRating || 1)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground truncate">
                    ({product.totalReviews || 0} reviews)
                  </span>
                  <WriteReviewOnProduct product={product}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Edit3 size={17} />
                    </Button>
                  </WriteReviewOnProduct>
                </div>
              </div>
              <div className="space-y-4">
                {!!reviews.length ? (
                  reviews.map((review) => (
                    <ReviewCard key={review._id} {...review} />
                  ))
                ) : (
                  <EmptyProductState
                    header="No Reviews Yikes"
                    icon={MessageSquare}
                    message="No Review On This Product Yet! You can write your review by clicking the button below"
                  >
                    <WriteReviewOnProduct product={product}>
                      <Button
                        style={{
                          background: store?.customizations?.theme?.primary,
                        }}
                      >
                        Write Review
                      </Button>
                    </WriteReviewOnProduct>
                  </EmptyProductState>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};

const ProductPageOne: FC<{ product: IProduct; store: IStore }> = ({
  product,
  store,
}) => {
  const [selectedSize, setSelectedSize] = useState(
    product?.availableSizes?.[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.availableColors?.[0]?.name || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState({
    idx: 0,
    type: product?.media?.[0]?.mediaType,
  });

  const [isHovered, setIsHovered] = useState(0);

  const [cart, setCart] = useLocalStorage<Record<string, ICartItem[]>>(
    "storeCarts",
    {}
  );

  const currentCart = cart[store.storeCode] || [];

  const removeItemFromCart = () => {
    setCart({
      ...cart,
      [store.storeCode]: currentCart?.filter(
        (cart) =>
          cart.productId !== product._id ||
          cart.color !== selectedColor ||
          cart.size !== selectedSize
      ),
    });
  };

  const addItemToCart = () => {
    // Check if item of the same color and size exist
    const itemExisted = currentCart.find(
      (cart) =>
        cart.productId === product._id! &&
        cart.color === selectedColor &&
        cart.size === selectedSize
    );

    const payload: ICartItem = {
      productId: product._id!,
      color: selectedColor,
      quantity: quantity,
      size: selectedSize,
    };

    if (!itemExisted) {
      setCart({ ...cart, [store.storeCode]: [...currentCart, payload] });

      const t = toast({
        title: "ITEM ADDED",
        description: `${product.productName} has been added to your cart`,
        action: (
          <Button
            onClick={() => {
              removeItemFromCart();
              t.dismiss();
            }}
            size="sm"
            variant="secondary"
          >
            Undo
          </Button>
        ),
      });
    } else {
      // Increment the quantity by one
      const newPayload = currentCart.map((cart) =>
        cart.productId === itemExisted.productId &&
        cart.color === itemExisted.color &&
        cart.size === itemExisted.size
          ? { ...cart, quantity: cart.quantity + quantity }
          : cart
      );

      setCart({ ...cart, [store.storeCode]: newPayload });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-28 pb-24 md:pb-8">
      <div className="text-sm breadcrumbs mb-4">
        <span className="text-muted-foreground">Products</span>
        <span className="mx-2">/</span>
        <span>{product?.productName}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="">
          <div className="relative md:h-[30rem] h-[25rem]">
            <div className="absolute bg-gray-100 h-fit rounded-lg overflow-hidden">
              {currentImageIndex.type === "image" ? (
                <Img
                  src={product?.media[currentImageIndex.idx].url}
                  alt={
                    product?.media[currentImageIndex.idx].altText ||
                    product?.productName
                  }
                  className="w-full h-fit"
                />
              ) : (
                <video src={product?.media[currentImageIndex.idx].url} />
              )}
              {product?.media?.length > 1 && (
                <Fragment>
                  <Button
                    size="icon"
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                    style={{ background: store.customizations?.theme?.primary }}
                  >
                    <ChevronLeft size={19} />
                  </Button>
                  <Button
                    size="icon"
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                    style={{ background: store.customizations?.theme?.primary }}
                  >
                    <ChevronRight size={19} />
                  </Button>
                </Fragment>
              )}
              {currentImageIndex.type === "video" && (
                <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-full p-4">
                  <span className="sr-only">Play video</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 mt-3 gap-4">
            {product?.media.map((m, idx) => (
              <div
                role="button"
                key={idx}
                onClick={() => setCurrentImageIndex({ idx, type: m.mediaType })}
                style={{
                  borderColor:
                    currentImageIndex.idx === idx
                      ? store.customizations?.theme?.primary
                      : "",
                }}
                className={`relative mt-6 md:mt-12 aspect-square rounded-lg border-2 overflow-hidden`}
              >
                <Img
                  src={m.url}
                  alt={`Product thumbnail ${idx + 1}`}
                  className="object-cover h-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <Badge
                style={{ background: store?.customizations?.theme?.primary }}
                className="mb-2"
              >
                New Arrival
              </Badge>
              <h1 className="text-2xl font-bold">{product?.productName}</h1>
              {product?.gender && (
                <p className="text-sm text-muted-foreground">
                  Gender: {product?.gender}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Text className="sr-only">Share with friends</Text>
              <ShareProduct product={product} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[...Array(product?.averageRating || 0)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 fill-yellow-400"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-muted-foreground">
              ({product.averageRating?.toFixed(2)} rated • 26 Sold)
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {formatAmountToNaira(
                  product?.discount || product?.price.default || 0
                )}
              </span>
              {Boolean(product?.discount) && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatAmountToNaira(product?.price.default || 0)}
                </span>
              )}
              {Boolean(product?.discount) && (
                <span className="text-sm text-red-500">20% OFF</span>
              )}
            </div>

            {!!product?.availableSizes.length && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size: XL{" "}
                  <span className="text-primary underline ml-1">
                    Size chart
                  </span>
                </label>
                <div className="flex gap-2">
                  {product?.availableSizes?.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className="w-12 h-12"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Color: {selectedColor}
              </label>
              <div className="flex gap-2">
                {product?.availableColors?.map((color) => (
                  <button
                    key={color.name}
                    style={{ background: color.colorCode }}
                    className={cn(
                      selectedColor === color.name &&
                        "ring-2 ring-white ring-offset-2",
                      "w-8 h-8 rounded-full"
                    )}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Qty</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  onMouseEnter={() => setIsHovered(2)}
                  onMouseLeave={() => setIsHovered(0)}
                  style={{
                    borderColor: store?.customizations?.theme?.primary,
                    background:
                      isHovered === 2
                        ? store?.customizations?.theme?.primary
                        : "",
                  }}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  onMouseEnter={() => setIsHovered(3)}
                  onMouseLeave={() => setIsHovered(0)}
                  style={{
                    borderColor: store?.customizations?.theme?.primary,
                    background:
                      isHovered === 3
                        ? store?.customizations?.theme?.primary
                        : "",
                  }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock Amount</span>
                <span>94 8 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Arrival</span>
                <span>5 days after order</span>
              </div>
            </div>

            {product?.stockQuantity < 10 && (
              <p className="text-sm text-red-500 font-semibold">
                Warning: Low stock, only {product?.stockQuantity} left!
              </p>
            )}
            <div className="hidden md:flex gap-4">
              <Button
                onMouseEnter={() => setIsHovered(1)}
                onMouseLeave={() => setIsHovered(0)}
                style={{
                  borderColor: store?.customizations?.theme?.primary,
                  background:
                    isHovered === 1
                      ? store?.customizations?.theme?.primary
                      : "",
                }}
                onClick={addItemToCart}
                className="flex-1 h-12 text-lg"
                variant="outline"
              >
                Add to cart
              </Button>
              <BuyNowPreview
                products={[
                  {
                    ...product,
                    color: selectedColor,
                    size: selectedSize,
                    quantity,
                  },
                ]}
              >
                <Button
                  style={{ background: store?.customizations?.theme?.primary }}
                  className="flex-1 h-12 text-lg"
                >
                  Buy Now
                </Button>
              </BuyNowPreview>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      {/*<div className="mt-8">
        <Card className="relative overflow-hidden">
          <Img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stella-Premium-Clothing-Marketplace-by-Dipa-UI-UX-for-Dipa-Inhouse-on-Dribbble-01-21-2025_01_06_AM-l3TYQ4UGjH7lTi5aPCgT1wPNB4BGlI.png"
            alt="Sunglasses promotion"
            width={1200}
            height={300}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4">
            <h3 className="text-2xl font-bold text-white">Sunglasses</h3>
            <p className="text-white/80">All You Need To Know</p>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="destructive">30% OFF</Badge>
          </div>
        </Card>
      </div>*/}

      {/* Product Details Tabs */}
      <ProductDetailsTab product={product} />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-50">
        <div className="flex gap-4 max-w-lg mx-auto">
          <Button
            onMouseEnter={() => setIsHovered(1)}
            onMouseLeave={() => setIsHovered(0)}
            style={{
              borderColor: store?.customizations?.theme?.primary,
              background:
                isHovered === 1 ? store?.customizations?.theme?.primary : "",
            }}
            onClick={addItemToCart}
            className="flex-1"
            variant="outline"
          >
            Add to cart
          </Button>
          <BuyNowPreview
            products={[
              {
                ...product,
                color: selectedColor,
                size: selectedSize,
                quantity,
              },
            ]}
          >
            <Button
              style={{ background: store?.customizations?.theme?.primary }}
              className="flex-1"
            >
              Buy Now
            </Button>
          </BuyNowPreview>
        </div>
      </div>
    </div>
  );
};

const ProductPageTwo: FC<{ product: IProduct; store: IStore }> = ({
  product,
  store,
}) => {
  const [selectedSize, setSelectedSize] = useState(
    product?.availableSizes[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.availableColors[0].name || ""
  );
  // const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({
    idx: 0,
    type: product?.media[0]?.mediaType,
  });

  const [cart, setCart] = useLocalStorage<Record<string, ICartItem[]>>(
    "storeCarts",
    {}
  );

  const currentCart = cart[store.storeCode] || [];

  const removeItemFromCart = () => {
    setCart({
      ...cart,
      [store.storeCode]: currentCart.filter(
        (cart) =>
          cart.productId !== product._id ||
          cart.color !== selectedColor ||
          cart.size !== selectedSize
      ),
    });
  };

  const addItemToCart = () => {
    // Check if item of the same color and size exist
    const itemExisted = currentCart.find(
      (cart) =>
        cart.productId === product._id! &&
        cart.color === selectedColor &&
        cart.size === selectedSize
    );

    const payload: ICartItem = {
      productId: product._id!,
      color: selectedColor,
      quantity: 1,
      size: selectedSize,
    };

    if (!itemExisted) {
      setCart({ ...cart, [store.storeCode]: [...currentCart, payload] });
      const t = toast({
        title: "ITEM ADDED",
        description: `${product.productName} has been added to your cart`,
        action: (
          <Button
            onClick={() => {
              removeItemFromCart();
              t.dismiss();
            }}
            size="sm"
            variant="secondary"
          >
            Undo
          </Button>
        ),
      });
    } else {
      // Increment the quantity by one
      const newPayload = currentCart.map((cart) =>
        cart.productId === itemExisted.productId &&
        cart.color === itemExisted.color &&
        cart.size === itemExisted.size
          ? { ...cart, quantity: cart.quantity + 1 }
          : cart
      );

      setCart({ ...cart, [store.storeCode]: newPayload });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">Product Details</h1>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <Img
                src={
                  product.media[currentImageIndex.idx].url || "/placeholder.svg"
                }
                alt={
                  product.media[currentImageIndex.idx].altText ||
                  product.productName
                }
                className="object-cover w-full"
              />
            </div>

            {/* Desktop Thumbnails */}
            <div className="hidden md:grid grid-cols-4 gap-4">
              {product.media.map((m, idx) => (
                <div
                  key={idx}
                  style={{ borderColor: store?.customizations?.theme?.primary }}
                  onClick={() =>
                    setCurrentImageIndex({ idx, type: m.mediaType })
                  }
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    currentImageIndex.idx === idx
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Img
                    src={m.url || "/placeholder.svg"}
                    alt={`Product thumbnail ${idx + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Image Indicators */}
            <div className="flex justify-center space-x-2 md:hidden">
              {product.media.map((_, idx) => (
                <Button
                  key={idx}
                  onClick={() =>
                    setCurrentImageIndex({ idx, type: _.mediaType })
                  }
                  className={`w-2 h-2 rounded-full ${
                    currentImageIndex.idx === idx ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{product.productName}</h1>
                {product.gender && (
                  <p className="text-sm text-muted-foreground">
                    Gender: {product.gender}
                  </p>
                )}
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (product?.averageRating || 1)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.averageRating?.toFixed(1)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-muted-foreground"
                  >
                    {product.totalReviews || 0} Reviews
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {!!product.availableSizes.length && (
                <div>
                  <div className="flex justify-between items-baseline">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Select Size</label>
                      <Link to="#" className="text-sm text-primary ml-2">
                        Size Guide
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {product.availableSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className="w-12 h-12"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!!product.availableColors.length && (
                <div>
                  <label className="text-sm font-medium">
                    Colours Available
                  </label>
                  <div className="flex gap-2 mt-2">
                    {product.availableColors.map((color) => (
                      <Button
                        onClick={() => setSelectedColor(color.name)}
                        style={{ background: color.colorCode }}
                        key={color.name}
                        className={cn(
                          "w-8 h-8 rounded-full",
                          selectedColor === color.name && "ring-2 ring-white"
                        )}
                      >
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <div className="text-2xl font-bold">
                  {formatAmountToNaira(getProductPrice(product, selectedSize))}
                </div>
              </div>

              <div className="w-full flex items-center gap-3">
                <Button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    borderColor: store?.customizations?.theme?.primary,
                    background: isHovered
                      ? store?.customizations?.theme?.primary
                      : "",
                  }}
                  onClick={addItemToCart}
                  variant="outline"
                  className="w-[40%] h-12"
                >
                  Add to cart
                </Button>
                <BuyNowPreview
                  products={[
                    {
                      ...product,
                      color: selectedColor,
                      size: selectedSize,
                      quantity: 1,
                    },
                  ]}
                >
                  <Button
                    style={{ background: store.customizations?.theme?.primary }}
                    className="h-12 w-[60%]"
                  >
                    Buy Now
                  </Button>
                </BuyNowPreview>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                  >
                    🔒
                  </Badge>
                  <div className="text-sm">Secure Payment</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="h-8 w-8 rounded-full flex items-center justify-center"
                  >
                    🚚
                  </Badge>
                  <div className="text-sm">Free shipping</div>
                </div>
                {!!product.availableSizes.length && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                    >
                      📏
                    </Badge>
                    <div className="text-sm">Size & Fit</div>
                  </div>
                )}
                {product.shippingDetails.isFreeShipping && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                    >
                      ↩️
                    </Badge>
                    <div className="text-sm">Free Shipping & Returns</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ProductDetailsTab product={product} />
        </div>
      </div>
    </div>
  );
};

const ProductPageThree: FC<{ product: IProduct; store: IStore }> = ({
  product,
  store,
}) => {
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors[0].name
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState({
    idx: 0,
    type: product.media[0].mediaType,
  });
  const [isHovered, setIsHovered] = useState(false);

  const [cart, setCart] = useLocalStorage<Record<string, ICartItem[]>>(
    "storeCarts",
    {}
  );

  const currentCart = cart[store.storeCode] || [];

  const removeItemFromCart = () => {
    setCart({
      ...cart,
      [store.storeCode]: currentCart.filter(
        (cart) =>
          cart.productId !== product._id ||
          cart.color !== selectedColor ||
          cart.size !== selectedSize
      ),
    });
  };

  const addItemToCart = () => {
    // Check if item of the same color and size exist
    const itemExisted = currentCart.find(
      (cart) =>
        cart.productId === product._id! &&
        cart.color === selectedColor &&
        cart.size === selectedSize
    );

    const payload: ICartItem = {
      productId: product._id!,
      color: selectedColor,
      quantity: 0,
      size: selectedSize,
    };

    if (!itemExisted) {
      setCart({ ...cart, [store.storeCode]: [...currentCart, payload] });
      const t = toast({
        title: "ITEM ADDED",
        description: `${product.productName} has been added to your cart`,
        action: (
          <Button
            onClick={() => {
              removeItemFromCart();
              t.dismiss();
            }}
            size="sm"
            variant="secondary"
          >
            Undo
          </Button>
        ),
      });
    } else {
      // Increment the quantity by one
      const newPayload = currentCart.map((cart) =>
        cart.productId === itemExisted.productId &&
        cart.color === itemExisted.color &&
        cart.size === itemExisted.size
          ? { ...cart, quantity: cart.quantity + 1 }
          : cart
      );

      setCart({ ...cart, [store.storeCode]: newPayload });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-24 md:pb-8">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/product">Product</Link>
          <span>/</span>
          <span className="text-foreground">{product.productName}</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <Img
                src={product.media[currentImageIndex.idx].url}
                alt={
                  product.media[currentImageIndex.idx].altText ||
                  product.productName
                }
                className="object-cover w-full"
              />
              <div
                style={{ background: store.customizations?.theme?.secondary }}
                className="absolute top-4 left-4  backdrop-blur-sm rounded-full px-2 py-1 text-sm"
              >
                0{currentImageIndex.idx + 1}/0{product.media.length}
              </div>
              {product.media.length > 1 && (
                <Button
                  onClick={() =>
                    setCurrentImageIndex({
                      ...currentImageIndex,
                      idx: Math.min(1, currentImageIndex.idx - 1),
                    })
                  }
                  style={{ background: store.customizations?.theme?.secondary }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {product.media.length > 1 && (
                <Button
                  onClick={() =>
                    setCurrentImageIndex({
                      ...currentImageIndex,
                      idx: Math.max(
                        product.media.length,
                        currentImageIndex.idx + 1
                      ),
                    })
                  }
                  style={{ background: store.customizations?.theme?.secondary }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Store Info Card */}
            <Card className="mt-4 p-4">
              <div className="flex items-start gap-4">
                <Store className="h-6 w-6 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{store.storeName}</span>
                    <Badge variant="secondary" className="h-5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                      {product.averageRating?.toFixed(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {product.totalReviews}+ Positive Feedback
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Nigeria
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{product.productName}</h1>
              {product.gender && (
                <p className="text-sm text-muted-foreground">
                  Gender: {product.gender}
                </p>
              )}
              <div className="flex gap-2">
                <ShareProduct product={product} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">
                {product.averageRating?.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                {product.totalReviews} Reviews
              </span>
              <span className="text-muted-foreground">4523 Sold</span>
            </div>

            <div className="flex items-center gap-4">
              {Boolean(product.discount) && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  50%
                </Badge>
              )}
              {Boolean(product.discount) && (
                <span className="text-2xl line-through text-muted-foreground">
                  {formatAmountToNaira(product.price.default)}
                </span>
              )}
              <span className="text-3xl font-bold">
                {formatAmountToNaira(getProductPrice(product, selectedSize))}
              </span>
            </div>

            <div className="space-y-4">
              {!!product.availableSizes.length && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.availableSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className="h-12 w-12 rounded-md"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {!!product.availableColors.length && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.availableColors.map((color) => (
                      <Button
                        onClick={() => setSelectedColor(color.name)}
                        key={color.name}
                        style={{ background: color.colorCode }}
                        className={cn(
                          "w-8 h-8 rounded-full",
                          selectedColor === color.name &&
                            "ring-2 dark:ring-white ring-slate-700"
                        )}
                      >
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {product.stockQuantity < 10 && (
              <p className="text-sm text-red-500 font-semibold">
                Warning: Low stock, only {product.stockQuantity} left!
              </p>
            )}
            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-4">
              <Button
                className="flex-1 h-12"
                variant="outline"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  background: isHovered
                    ? store.customizations?.theme?.primary
                    : "",
                  borderColor: store.customizations?.theme?.primary,
                }}
                onClick={addItemToCart}
              >
                Add to Cart
              </Button>
              <BuyNowPreview
                products={[
                  {
                    ...product,
                    quantity: 1,
                    size: selectedSize,
                    color: selectedColor,
                  },
                ]}
              >
                <Button
                  style={{ background: store.customizations?.theme?.primary }}
                  className="flex-1 h-12"
                >
                  Buy Now
                </Button>
              </BuyNowPreview>
            </div>

            <ProductDetailsTab product={product} />
          </div>
        </div>
      </div>

      {/* Fixed Mobile Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden z-50">
        <div className="flex gap-4 max-w-lg mx-auto">
          <Button
            className="flex-1"
            size="lg"
            variant="outline"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              background: isHovered ? store.customizations?.theme?.primary : "",
              borderColor: store.customizations?.theme?.primary,
            }}
            onClick={addItemToCart}
          >
            Add to Cart
          </Button>
          <BuyNowPreview
            products={[
              {
                ...product,
                quantity: 1,
                size: selectedSize,
                color: selectedColor,
              },
            ]}
          >
            <Button
              style={{ background: store.customizations?.theme?.primary }}
              className="flex-1"
              size="lg"
            >
              Buy Now
            </Button>
          </BuyNowPreview>
        </div>
      </div>
    </div>
  );
};

export default function StoreProductsDetails() {
  const { productId } = useParams();

  const { currentStore: store } = useStoreBuildState();

  const { data, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => storeBuilder.getProduct(productId!),
  });

  if (isLoading) return <ProductSkeleton />;

  const { data: product } = data || {};

  const displayStyle: Record<IDisplayStyle, any> = {
    one: <ProductPageOne product={product!} store={store!} />,
    two: <ProductPageTwo product={product!} store={store!} />,
    three: <ProductPageThree product={product!} store={store!} />,
  };

  return displayStyle[store?.customizations?.productPage?.style || "one"];
}
