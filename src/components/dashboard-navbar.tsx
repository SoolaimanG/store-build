import {
  ChevronDown,
  Copy,
  Headset,
  Menu,
  PlusCircleIcon,
  Store,
  ZapIcon,
} from "lucide-react";
import { Logo } from "./logo";
import { Section } from "./section";
import { Button } from "./ui/button";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useStoreBuildState } from "@/store";
import {
  cn,
  copyToClipboard,
  formatAmountToNaira,
  generateRandomString,
  isPathMatching,
  storeBuilder,
} from "@/lib/utils";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { PATHS } from "@/types";

const DashBoardNavBar = () => {
  const isDesktop = useMediaQuery("(min-width: 767px)");
  const { user } = useStoreBuildState();
  const { balance = 0 } = user || {};

  const balanceUI = (
    <Button variant="ghost" size="sm" className="flex-col items-start">
      <Link to={PATHS.STORE_BALANCE} className="tracking-wider">
        {formatAmountToNaira(balance)}
      </Link>
    </Button>
  );

  return (
    <Section className="flex items-center justify-between fixed bg-slate-900 py-3 top-0 left-0 right-0 z-50 transition-shadow duration-300 ease-in-out md:max-w-screen">
      <div className="flex items-center gap-2">
        {!isDesktop && (
          <MobileNavBar>
            <Button
              size="icon"
              variant="ringHover"
              className="rounded-full bg-slate-800"
            >
              <Menu className="w-5 h-5 md:w-7 md:h-7" />
            </Button>
          </MobileNavBar>
        )}
        <Logo path={location.href} className="md:text-xl text-base" />
      </div>
      <div className="flex items-center md:gap-3 gap-0">
        {balanceUI}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 border-1 sm:px-3 h-8 md:h-9 border rounded-full"
            >
              <ZapIcon size={16} className="md:flex hidden" /> Actions{" "}
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to={PATHS.STORE_FRONT}>
                  <Store size={17} />
                  Store Front
                  <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  copyToClipboard(
                    location.href + "store/" + user?.storeCode,
                    "Store Link"
                  )
                }
              >
                <Copy size={17} />
                Copy Store Link
                <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem asChild>
                <Link
                  to={
                    PATHS.STORE_PRODUCTS + generateRandomString(16) + "#create"
                  }
                >
                  <PlusCircleIcon size={17} />
                  Add Product
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Headset size={17} />
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => storeBuilder.signOut()}>
              Log out
              <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
