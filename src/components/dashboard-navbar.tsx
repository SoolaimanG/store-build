import { Menu, Sparkles } from "lucide-react";
import { Logo } from "./logo";
import { Section } from "./section";
import { Button } from "./ui/button";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useStoreBuildState } from "@/store";
import { cn, formatAmountToNaira, isPathMatching } from "@/lib/utils";
import { PATHS } from "@/types";
import { AIChat } from "./ai-chat";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import React, { FC, ReactNode } from "react";
import { sidebarItems } from "@/constants";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const DashBoardNavBar = () => {
  const isDesktop = useMediaQuery("(min-width: 767px)");
  const { user } = useStoreBuildState();
  const { balance = 0 } = user || {};

  const balanceUI = (
    <Button variant="ghost" size="sm" className="flex-col items-start">
      <h3 className="tracking-wider">{formatAmountToNaira(balance)}</h3>
    </Button>
  );

  return (
    <Section className="flex items-center justify-between fixed bg-slate-900 py-3 top-0 left-0 right-0 z-50 transition-shadow duration-300 ease-in-out md:max-w-screen">
      <Logo path={location.href} />
      <div className="flex items-center md:gap-3 gap-2">
        {balanceUI}
        <AIChat>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-primary hover:text-primary"
          >
            <Sparkles size={18} />
          </Button>
        </AIChat>
        {!isDesktop && (
          <MobileNavBar>
            <Button
              size="icon"
              variant="ringHover"
              className="rounded-full bg-slate-800"
            >
              <Menu />
            </Button>
          </MobileNavBar>
        )}
        {isPathMatching(PATHS.STORE_FRONT) && (
          <Button asChild size="sm" variant="outline" className="rounded-sm">
            <Link to={PATHS.STORE + user?.storeCode}>Preview</Link>
          </Button>
        )}
      </div>
    </Section>
  );
};

const MobileNavBar: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-81px)] px-6">
          <nav className="flex flex-col gap-4 py-6">
            {sidebarItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <Separator />}
                <SheetClose asChild>
                  <Link to={item.path} className="no-underline">
                    <Button
                      variant={isPathMatching(item.path) ? "default" : "ghost"}
                      size="lg"
                      className={cn(
                        "w-full justify-start gap-4 px-4",
                        isPathMatching(item.path) && "bg-accent hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                </SheetClose>
              </React.Fragment>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default DashBoardNavBar;
