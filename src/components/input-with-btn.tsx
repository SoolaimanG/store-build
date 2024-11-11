import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FC } from "react";
import { cn } from "@/lib/utils";
import { lucideIcons } from "@/types";

export const InputWithBtn: FC<{
  className?: string;
  btnText?: string;
  Icon?: lucideIcons;
}> = ({ className, btnText = "Generate", Icon = Sparkles }) => {
  return (
    <div className={cn("relative p-1 w-[70%]", className)}>
      <Input className="rounded-full h-[3rem] border-primary/80 bg-primary/5 w-full focus:ring-0 focus:border-hidden" />

      <Button
        size="sm"
        variant="shine"
        className="rounded-full absolute right-2 top-2 mt-[0.1rem] gap-2"
      >
        <Icon size={17} />
        {btnText}
      </Button>
    </div>
  );
};
