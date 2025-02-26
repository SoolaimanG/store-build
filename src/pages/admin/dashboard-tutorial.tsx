import { SquigglyUnderline } from "@/components/squiggly-underline";
import { Text } from "@/components/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { tutorialVideos } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { useToastError } from "@/hooks/use-toast-error";
import { appConfig, errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { ITutorial, PATHS } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, PlayCircle, Star } from "lucide-react";
import { useState } from "react";
import { Img } from "react-image";
import { Link, useNavigate } from "react-router-dom";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export const TutorialCard = ({
  title,
  description,
  category,
  rating,
  _id,
}: ITutorial & { videoUrl: string }) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useState(false);
  const { isLoading, data, error } = useQuery({
    queryKey: ["tutorial", _id],
    queryFn: () => storeBuilder.getTutorial(_id),
  });

  const markAsCompleted = async () => {
    try {
      startTransition(true);
      const payload: ITutorial = {
        _id,
        category,
        description,
        rating,
        title,
        isCompleted: true,
        type: "video",
        user: "",
      };

      await storeBuilder.markTutorialAsCompleted(payload);
      queryClient.invalidateQueries({ queryKey: ["tutorial", _id] });
      toast({
        title: "Success",
        description: "Tutorial marked as completed",
      });
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  useToastError(error);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative h-[200px]">
        <Link to={PATHS.STORE_TUTORIAL + _id}>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <Button variant="secondary" size="lg" className="gap-2">
              <PlayCircle className="w-5 h-5" />
              Watch Now
            </Button>
          </div>
          <Img
            src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(
              title
            )}`}
            alt={title}
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="capitalize">
            {category}
          </Badge>
          <StarRating rating={rating} />
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={markAsCompleted}
          disabled={isLoading || data?.data?.isCompleted || isPending}
          variant="secondary"
          className="w-full gap-2 hover:bg-primary hover:text-primary-foreground"
        >
          <Check className="w-4 h-4" />
          Mark As Completed
        </Button>
      </CardFooter>
    </Card>
  );
};

const DashboardTutorial = () => {
  const n = useNavigate();
  const [isPending, startTransition] = useState(false);
  const markAllAsCompleted = async () => {
    const payload: ITutorial[] = tutorialVideos.map(
      ({ videoUrl, ...tutorial }) => ({
        ...tutorial,
      })
    );

    try {
      startTransition(true);
      await storeBuilder.markTutorialAsCompleted(payload);
      toast({
        title: "SUCCESS",
        description: "All Tutorials Are Now Mark As Completed",
      });
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "SUCCESS",
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  const watchTutorial = async () => {
    // TODO: Implement logic to watch tutorial
    try {
      startTransition(true);
      const res = await storeBuilder.watchTutorial();

      if (!res.data) {
        toast({
          title: "INFO",
          description: "All Tutorials Videos Has Been Watched",
        });
      } else {
        n(PATHS.STORE_TUTORIAL + res.data);
      }

      console.log(res);
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
    } finally {
      startTransition(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <header className="flex flex-col gap-6 items-center max-w-2xl mx-auto mb-12">
          <h2 className="text-center text-3xl md:text-4xl font-bold leading-tight">
            Watch Step By Step Tutorial On How To Use{" "}
            <SquigglyUnderline color="purple">
              {appConfig.name}
            </SquigglyUnderline>
          </h2>
          <Text className="text-center text-muted-foreground">
            Learn how to make the most of our platform with our comprehensive
            video tutorials. From basic setup to advanced features, we've got
            you covered.
          </Text>
          <div className="flex items-center gap-2">
            <Button
              disabled={isPending}
              onClick={watchTutorial}
              className="gap-3 rounded-full h-12 hover:bg-primary hover:text-primary-foreground"
              size="lg"
              variant="ringHover"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Tutorial
            </Button>
            <Button
              disabled={isPending}
              onClick={markAllAsCompleted}
              className="gap-3 rounded-full h-12 hover:bg-primary hover:text-primary-foreground"
              size="lg"
              variant="secondary"
            >
              <Check className="w-5 h-5" />
              Mark All As Watched
            </Button>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {tutorialVideos.map((tutorial, index) => (
            <TutorialCard {...tutorial} key={index + String(isPending)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardTutorial;
