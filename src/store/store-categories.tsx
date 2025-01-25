import { Section } from "@/components/section";
import { Text } from "@/components/text";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreBuildState } from ".";
import { Button } from "@/components/ui/button";
import { Img } from "react-image";
import { FC } from "react";
import { ICategory } from "@/types";
import { Link } from "react-router-dom";
import { menu } from "@/constants";

const StoreCategories: FC<{ categories: ICategory[]; isLoading: boolean }> = ({
  categories,
  isLoading,
}) => {
  const { currentStore } = useStoreBuildState();

  return (
    <div className="w-full">
      <Section className="flex flex-col space-y-5">
        <header className="w-full flex items-center justify-center flex-col gap-2">
          <h2 className="text-4xl">Our Collections</h2>
          <Text className="text-center">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsa eum
            cumque tempora accusantium magni ea minima officiis ducimus, harum
            maxime deleniti
          </Text>
        </header>
        <div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            {isLoading ? (
              <CarouselContent>
                {Array.from({ length: 3 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 basis-2/3"
                  >
                    <div className="p-1">
                      <Card className="w-full h-[25rem]">
                        <CardContent className="h-full p-0">
                          <Skeleton className="h-full w-full" />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            ) : (
              <CarouselContent>
                {categories?.map((category) => (
                  <CarouselItem
                    key={category._id}
                    className="md:basis-1/2 lg:basis-1/3 basis-2/3"
                  >
                    <Card className="w-full p-0 h-[25rem] relative cursor-pointer overflow-hidden group rounded-2xl">
                      <Img
                        src={category.img!}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="bg-black bg-opacity-40 absolute inset-0" />
                      <div className="absolute flex flex-col bottom-0 left-0 p-6 transition-opacity duration-300">
                        <h3 className="text-white text-2xl font-bold mb-4">
                          {category.name}
                        </h3>
                        <Button
                          asChild
                          style={{
                            backgroundColor:
                              currentStore?.customizations?.theme.primary,
                          }}
                          variant="outline"
                          className="text-white hover:bg-white hover:text-white transition-colors duration-300 border-0 rounded-full w-fit px-6"
                        >
                          <Link
                            to={
                              menu(currentStore?.storeCode!, {
                                category: category.slot,
                              })[1].path
                            }
                          >
                            See Details
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            )}
          </Carousel>
        </div>
      </Section>
    </div>
  );
};

export default StoreCategories;
