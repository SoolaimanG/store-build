import { FC, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { IAvailableColors, IGender } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

type IProductFilter = {
  className?: string;
  buttonColor?: string;
  colors: IAvailableColors[];
  sizes: string[];
  priceRange?: { min: number; max: number };
  storeId: string;
};

const genders: { value: IGender; label: string }[] = [
  {
    value: "F",
    label: "Female",
  },
  {
    value: "M",
    label: "Male",
  },
  {
    value: "U",
    label: "Unisex",
  },
];

const ProductFilter: FC<IProductFilter> = ({
  className,
  buttonColor,
  colors,
  sizes,
  priceRange: pr,
  storeId,
}) => {
  const n = useNavigate();
  const location = useLocation();

  const {
    colors: _colors = [],
    category,
    priceRange: _priceRange = 0,
    gender,
    page = 1,
    sizes: _sizes,
  } = queryString.parse(location.search, {
    parseBooleans: true,
    parseNumbers: true,
  }) as {
    colors: string[];
    category: string;
    priceRange: number;
    gender?: IGender;
    page?: number;
    sizes?: string[];
  };
  const [__sizes, setSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState(_colors);
  const [priceRange, setPriceRange] = useState([_priceRange]);
  const [selectedGender, setSelectedGender] = useState(gender);
  const [c, setC] = useState(category);

  const handleColorSelect = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const { data } = useQuery({
    queryKey: ["categories", storeId],
    queryFn: () => storeBuilder.getCategories(storeId),
  });

  const { data: categories = [] } = data || {};

  const saveFilter = () => {
    const q = queryString.stringify({
      priceRange,
      category: c,
      gender: selectedGender,
      sizes: __sizes,
      colors: !!selectedColors.length ? selectedColors : [],
    });

    n(`?${q}`);
  };

  const resetFilter = () => {
    const q = queryString.stringify({
      page,
    });
    n(location.pathname + `?${q}`);
  };

  return (
    <ScrollArea className={cn("flex flex-col h-full", className)}>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Products Filter</span>
        <button onClick={resetFilter} className="text-gray-500 text-xm">
          Reset
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {/* Category Section */}
        <Accordion type="single" collapsible defaultValue="category">
          <AccordionItem value="category" className="border-b">
            <AccordionTrigger className="font-medium">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => {
                  return (
                    <Button
                      key={category._id}
                      variant={c === category.slot ? "secondary" : "ghost"}
                      onClick={() => {
                        if (c === category.slot) {
                          setC("");
                        } else {
                          setC(category.slot);
                        }
                      }}
                      className={`flex items-center rounded-full gap-2 ${
                        c === category.slot ? "font-medium" : ""
                      }`}
                    >
                      <span>{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Size Section */}
        {!!sizes.length && (
          <Accordion type="single" collapsible defaultValue="size">
            <AccordionItem value="size" className="border-b">
              <AccordionTrigger className="font-medium">Sizes</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-1">
                  {sizes.map((size) => {
                    return (
                      <Button
                        key={size}
                        variant={__sizes.includes(size) ? "secondary" : "ghost"}
                        onClick={() => {
                          if (__sizes.includes(size)) {
                            setSizes((prev) => prev.filter((g) => g !== size));
                          } else {
                            setSizes([...__sizes, size]);
                          }
                        }}
                        className={`flex items-center rounded-full gap-2 ${
                          __sizes.includes(size) ? "font-medium" : ""
                        }`}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Color Section */}
        <Accordion type="single" collapsible defaultValue="color">
          <AccordionItem value="color" className="border-b">
            <AccordionTrigger className="font-medium">Color</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-1">
                {colors?.map((color) => {
                  return (
                    <Button
                      key={color.colorCode}
                      variant={
                        selectedColors.includes(color.name)
                          ? "secondary"
                          : "ghost"
                      }
                      onClick={() => handleColorSelect(color.name)}
                      className={`flex items-center rounded-full gap-2 ${
                        selectedColors.includes(color.name) ? "font-medium" : ""
                      }`}
                    >
                      <div
                        style={{ background: color.colorCode }}
                        className={`w-6 h-6 rounded-full  border-2`}
                      />
                      <span>{color.name}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Price Range Section */}
        <Accordion type="single" collapsible defaultValue="price">
          <AccordionItem value="price" className="border-b">
            <AccordionTrigger className="font-medium">
              Price Range
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-2">
                <Slider
                  defaultValue={[0]}
                  min={pr?.min || 0}
                  max={pr?.max || 10000}
                  step={5}
                  className="my-4"
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="rounded-sm">
                    Min: {formatAmountToNaira(priceRange[0] || 0)}
                  </Badge>
                  <Badge variant="secondary" className="rounded-sm">
                    Max: {formatAmountToNaira(pr?.max || 10000)}
                  </Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Customer Review Section */}
        <Accordion type="single" collapsible defaultValue="gender">
          <AccordionItem value="gender" className="border-b">
            <AccordionTrigger className="font-medium">Genders</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                {genders.map((gender) => (
                  <Button
                    variant={
                      selectedGender === gender.value ? "secondary" : "ghost"
                    }
                    key={gender.value}
                    onClick={() => {
                      if (selectedGender === gender.value) {
                        setSelectedGender(undefined);
                      } else {
                        setSelectedGender(gender.value);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {gender.label}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Button
        variant="ringHover"
        onClick={saveFilter}
        style={{ background: buttonColor }}
        className="w-full bg-black text-white py-3 rounded-lg mt-4"
      >
        Save Filter
      </Button>
    </ScrollArea>
  );
};

export default ProductFilter;
