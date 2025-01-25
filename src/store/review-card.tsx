import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IProductReview } from "@/types";
import { Star } from "lucide-react";
import { FC } from "react";

export const ReviewCard: FC<IProductReview> = ({
  userEmail,
  createdAt,
  rating,
  ...prop
}) => {
  return (
    <Card className="bg-gray-50 dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="font-medium capitalize">{userEmail}</div>
        <div className="text-sm text-muted-foreground">{createdAt}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < rating
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">{prop.note}</p>
        </div>
      </CardContent>
    </Card>
  );
};
