import { Section } from "@/components/section";
import { useStoreBuildState } from ".";
import { FC } from "react";
import { IDisplay, ISection } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import GridDisplay from "./grid-display";
import { EmptyProductState } from "@/components/empty";
import { Package } from "lucide-react";

export const EachSection: FC<ISection & { storeId: string }> = ({
  products,
  storeId,
  header,
  display,
}) => {
  const { currentStore: store } = useStoreBuildState();
  const { isLoading, data, error } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () =>
      storeBuilder.getProducts(storeId, { productsToShow: products, size: 20 }),
    enabled: Boolean(storeId),
  });

  const { data: productRes } = data || {};
  const { products: _products = [] } = productRes || {};

  useToastError(error);

  if (!_products?.length && !isLoading)
    return (
      <EmptyProductState
        icon={Package}
        header="No Product Found"
        message="Seems like this store does not have any active product available, Please contact the store owner"
      >
        <Button style={{ background: store?.customizations?.theme?.primary }}>
          Contact Store Owner
        </Button>
      </EmptyProductState>
    );

  const seeMoreBtn = (display: IDisplay, isVisible: boolean) => (
    <Button
      asChild
      size="sm"
      variant={display === "flex" ? "ghost" : "secondary"}
      className={isVisible ? "flex" : "hidden"}
    >
      <Link to="/">See More</Link>
    </Button>
  );

  const carouselDisplay = (
    <Carousel>
      <CarouselContent>
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3 basis-3/5"
              >
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </CarouselItem>
            ))
          : _products?.map((product) => (
              <CarouselItem
                key={product._id}
                className="md:basis-1/2 lg:basis-1/3 basis-5/5"
              >
                <ProductCard {...product} />
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );

  return (
    <div className="flex flex-col space-y-3 w-full">
      <header className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{header}</h2>

        {seeMoreBtn(display, display === "flex")}
      </header>
      <div className="w-full">
        {display === "flex" ? (
          carouselDisplay
        ) : (
          <GridDisplay isLoading={[isLoading]} products={_products} />
        )}
      </div>
      <div className="w-full flex items-center justify-center">
        {seeMoreBtn(display, display === "grid")}
      </div>
    </div>
  );
};

const StoreSections = () => {
  const { currentStore } = useStoreBuildState();
  const { sections, _id = "" } = currentStore || {};
  return (
    <div>
      <Section className="flex flex-col space-y-6">
        {sections?.map((section) => (
          <EachSection key={section._id} {...section} storeId={_id} />
        ))}
      </Section>
    </div>
  );
};

export default StoreSections;
