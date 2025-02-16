import { cn } from "@/lib/utils";

export const Progress: React.FC<{
  maxValue?: number;
  value: number;
  className?: string;
}> = ({ maxValue = 100, value, className }) => {
  return (
    <div
      className={cn(
        `h-[6px] rounded-md ${
          value / maxValue > 0.6
            ? "bg-green-500"
            : value / maxValue > 0.3
            ? "bg-yellow-500"
            : "bg-red-500"
        }`,
        className
      )}
      style={{
        width: `${(value / maxValue) * 100}%`,
      }}
    />
  );
};
