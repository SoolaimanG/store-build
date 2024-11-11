import { cn } from "@/lib/utils";
import React from "react";

const colors = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
};

type SquigglyUnderlineProps = {
  children: React.ReactNode;
  color?: keyof typeof colors;
  className?: string;
};

export const SquigglyUnderline: React.FC<SquigglyUnderlineProps> = ({
  children,
  color = "red",
  className,
}) => {
  const svgString = encodeURIComponent(
    `<svg width="100%" height="6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 3C20 1 40 5 60 3C80 1 100 5 120 3C140 1 160 5 180 3C200 1 220 5 240 3" stroke="${colors[color]}" stroke-width="2"/></svg>`
  );

  return (
    <span
      className={cn("relative inline-block", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,${svgString}")`,
        backgroundPosition: "0 100%",
        backgroundSize: "auto 6px",
        backgroundRepeat: "repeat-x",
        paddingBottom: "6px",
      }}
    >
      {children}
    </span>
  );
};
