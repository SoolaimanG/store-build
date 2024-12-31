export const Progress: React.FC<{ maxValue?: number; value: number }> = ({
  maxValue = 100,
  value,
}) => {
  return (
    <div
      className={`h-[6px] rounded-md ${
        value / maxValue > 0.6
          ? "bg-green-500"
          : value / maxValue > 0.3
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
      style={{
        width: `${(value / maxValue) * 100}%`,
      }}
    />
  );
};
