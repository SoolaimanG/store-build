import { Section } from "@/components/section";
import { useStoreBuildState } from ".";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { Text } from "@/components/text";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Link } from "react-router-dom";
import { FC, ReactNode, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menu } from "@/constants";
import { ProductSearchDialog } from "@/components/product-search";
import { CART } from "./store-cart";

const MobileMenu: FC<{ children: ReactNode; isOpen?: boolean }> = ({
  children,
  isOpen = false,
}) => {
  const [open, setOpen] = useState(isOpen);
  const { currentStore } = useStoreBuildState();
  const { storeName, storeCode = "" } = currentStore || {};

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[50%]">
        <SheetHeader>
          <Logo name={storeName} />
        </SheetHeader>
        <div className="mt-10 flex flex-col space-y-5">
          {menu(storeCode).map((m, idx) => (
            <Link
              to={m.path}
              key={idx}
              className="text-2xl hover:text-gray-400 hover:font-semibold"
            >
              {m.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const HeroSectionNavBar: FC<{ isLoading?: boolean }> = () => {
  const isMobile = useMediaQuery("(max-width:767px)");
  const { currentStore } = useStoreBuildState();
  const { customizations, storeName, storeCode = "" } = currentStore || {};
  const [isHovered, setIsHovered] = useState(0);

  return (
    <nav className="w-full bg-white text-black  fixed z-30">
      {customizations?.hero?.product && (
        <Link
          to={"/"}
          className="w-full bg-black text-white py-1 flex items-center justify-center"
        >
          <Text className="text-center text-white">
            Only a few items left in stock! Don’t wait—shop now to secure yours!
          </Text>
        </Link>
      )}
      <Section className="w-full flex items-center justify-between md:max-w-[90%] py-3">
        <Logo name={storeName} />
        <div className="hidden md:flex space-x-5">
          {menu(storeCode).map((m, idx) => (
            <Link
              className="hover:text-gray-500 hover:font-semibold"
              to={m.path}
              key={idx}
            >
              {m.name}
            </Link>
          ))}
        </div>
        <div>
          <div className="flex items-center space-x-1">
            {isMobile && (
              <MobileMenu>
                <Button
                  onMouseEnter={() => setIsHovered(1)}
                  onMouseLeave={() => setIsHovered(0)}
                  style={{
                    background:
                      isHovered === 1 ? customizations?.theme.secondary : "",
                    color: isHovered === 1 ? "white" : "",
                  }}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Menu size={18} />
                </Button>
              </MobileMenu>
            )}
            {customizations?.productsPages.canSearch && (
              <ProductSearchDialog>
                <Button
                  onMouseEnter={() => setIsHovered(2)}
                  onMouseLeave={() => setIsHovered(0)}
                  style={{
                    background:
                      isHovered === 2 ? customizations?.theme.secondary : "",
                    color: isHovered === 2 ? "white" : "",
                  }}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Search size={18} />
                </Button>
              </ProductSearchDialog>
            )}
            <CART>
              <Button
                style={{ background: customizations?.theme.secondary }}
                variant="ghost"
                size="icon"
                className="rounded-full"
              >
                <ShoppingCart color={"#FFF"} size={18} />
              </Button>
            </CART>
          </div>
        </div>
      </Section>
    </nav>
  );
};

const HeroSection = () => {
  const { currentStore } = useStoreBuildState();

  return (
    <div
      style={{ background: currentStore?.customizations?.theme.secondary }}
      className="w-screen"
    >
      <Section className="pt-20 w-full">
        <div className="w-full flex flex-col space-y-4 items-center justify-center py-6">
          <header className="font-bold">ORANGE - PINEAPPLE - PAWPAW</header>
          <div className="flex flex-col space-y-5">
            <h2 className="text-center md:text-4xl text-3xl font-extralight">
              NATURAL BEAUTY SKINCARE
            </h2>
            <Text className="text-center text-white font-light">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
              exercitationem blanditiis eveniet quod illo quisquam iste eius
              eligendi, laborum repellat.
            </Text>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HeroSection;
