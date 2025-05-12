import React from "react";
import { LightingSceneProps } from "@/types";
import { cn } from "@/lib/utils";

//

const sizeClasses = {
  small: "w-[36.125rem] sm:w-[72.1875rem]",
  medium: "w-[48.125rem] sm:w-[96.1875rem]",
  large: "w-[60.125rem] sm:w-[120.1875rem]",
};

export const LightingScene: React.FC<LightingSceneProps> = ({
  side = "right",
  size = "medium",
}) => {
  const sideClass =
    side === "left" ? "left-[calc(0%-3rem)]" : "left-[calc(100%-3rem)]";
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div
      className={`absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl`}
      aria-hidden="true"
    >
      <div
        className={cn(
          "relative aspect-[1000/300] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-primary opacity-30",
          sideClass,
          sizeClass
        )}
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
};
