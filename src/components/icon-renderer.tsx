import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

export const renderIcon = (iconName: string, className?: string) => {
  const IconComponent = LucideIcons[
    iconName as keyof typeof LucideIcons
  ] as React.ElementType;
  if (IconComponent) {
    return <IconComponent className={cn("h-6 w-6", className)} />;
  }
  return <span className="text-xs">No icon</span>;
};
