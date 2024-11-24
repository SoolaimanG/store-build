import { MobileIcon } from "@radix-ui/react-icons";
import { Laptop2Icon, TabletIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const DifferentViews = () => {
  const views = [
    {
      name: "Mobile",
      action: "",
      icon: MobileIcon,
    },
    {
      name: "Tablet",
      action: "",
      icon: TabletIcon,
    },
    {
      name: "Desktop",
      action: "",
      icon: Laptop2Icon,
    },
  ];

  return (
    <div className="flex items-center gap-1 rounded-full bg-accent/45">
      {views.map((view) => (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <Button
                size="icon"
                className="rounded-full hover:bg-primary"
                variant="ghost"
              >
                <view.icon size={19} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{view.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default DifferentViews;
