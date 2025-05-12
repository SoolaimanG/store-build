import { Text } from "@/components/text";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IProductReview } from "@/types";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { FC } from "react";
import { useStoreBuildState } from ".";

export const ReviewCard: FC<IProductReview> = ({
  userEmail,
  createdAt,
  rating,
  ...prop
}) => {
  const { currentStore: store } = useStoreBuildState();

  return (
    <Card className="bg-gray-50 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center pt-3 justify-between space-y-0 pb-2">
        <div className="font-medium truncate">
          {userEmail.charAt(0).toUpperCase() + userEmail.slice(1)}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(createdAt, "dd/MM/yyyy")}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              style={{
                color: store?.customizations?.theme?.primary,
                fill: i < rating ? store?.customizations?.theme?.primary : "",
              }}
              key={i}
              className={`md:h-5 md:w-5 h-4 w-4 `}
            />
          ))}
        </div>

        <Text>{prop.note}</Text>
      </CardContent>
    </Card>
  );
};
