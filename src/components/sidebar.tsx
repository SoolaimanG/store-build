import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { sidebarItems } from "@/constants";
import { isPathMatching } from "@/lib/utils";

const SideBar = () => {
  return (
    <TooltipProvider>
      <div className="fixed left-0 top-16 bottom-0 w-16 bg-background border-r flex flex-col items-center py-4 space-y-4">
        {sidebarItems.map((item) => (
          <Link key={item.label} to={item.path}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isPathMatching(item.path) ? "default" : "ghost"}
                  size="icon"
                  className="relative"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </Link>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SideBar;
