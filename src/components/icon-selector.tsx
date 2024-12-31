import React, { useState, useEffect, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@uidotdev/usehooks";
import { renderIcon } from "./icon-renderer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { iconList } from "@/constants";

interface IconSelectorProps {
  onSelect: (iconName: string) => void;
}

const IconSelector: React.FC<IconSelectorProps & { children: ReactNode }> = ({
  onSelect,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<string[]>(iconList);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const filtered = iconList.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredIcons(filtered);
  }, [search]);

  const handleSelect = (iconName: string) => {
    onSelect(iconName);
    setOpen(false);
  };

  const content = (
    <>
      <Input
        type="search"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[300px]">
        <div className="flex flex-wrap gap-6">
          {filteredIcons.map((iconName, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    className="h-14 w-14"
                    onClick={() => handleSelect(iconName)}
                  >
                    {renderIcon(iconName)}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{iconName}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select an E-commerce Icon</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select an E-commerce Icon</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{content}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default IconSelector;
