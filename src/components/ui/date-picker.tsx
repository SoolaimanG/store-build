import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  select,
  onSelect,
  label = "Pick a date",
  btnSize = "default",
  className,
  variants = "default",
}: {
  onSelect: React.Dispatch<React.SetStateAction<Date | undefined>>;
  select: Date | undefined;
  label?: string;
  btnSize?: "default" | "sm" | "lg" | "icon" | null | undefined;
  className?: string;
  variants?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "expandIcon"
    | "ringHover"
    | "shine"
    | "gooeyRight"
    | "gooeyLeft"
    | "linkHover1"
    | "linkHover2"
    | null
    | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={btnSize}
          variant={variants}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !select && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {select ? format(select, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={select} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
