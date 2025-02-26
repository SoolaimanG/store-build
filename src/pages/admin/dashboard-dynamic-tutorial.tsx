import { EmptyProductState } from "@/components/empty";
import { Button } from "@/components/ui/button";
import { tutorialVideos } from "@/constants";
import { ITutorial, PATHS } from "@/types";
import { Check, CircleOff, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { TutorialCard } from "./dashboard-tutorial";
import { useQuery } from "@tanstack/react-query";
import { errorMessageAndStatus, storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import { Text } from "@/components/text";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export function TutorialSkeleton() {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

const DashboardDynamicTutorial = () => {
  const { videoId = "" } = useParams();
  const [isPending, startTransition] = useState(false);

  const tutorial = tutorialVideos.find((v) => v._id === videoId);

  const relatedVideos = tutorialVideos.filter((v) =>
    tutorial?.relatedVideos?.includes(v._id!)
  );

  const { isLoading, data, error } = useQuery({
    queryKey: ["tutorial", videoId],
    queryFn: () => storeBuilder.getTutorial(videoId),
    enabled: !!tutorial,
  });

  const markAsCompleted = async () => {
    try {
      startTransition(true);
      const { videoUrl, relatedVideos, ...rest } = tutorial || {};
      // Mark tutorial as completed
      const res = await storeBuilder.markTutorialAsCompleted(rest as ITutorial);
      toast({
        title: "SUCCESS!",
        description: res.message,
      });
    } catch (error) {
      const { message: description } = errorMessageAndStatus(error);
      toast({
        title: "ERROR",
        description,
        variant: "destructive",
      });
      console.error("Failed to mark tutorial as completed", error);
    } finally {
      startTransition(false);
    }
  };

  const { data: _tutorial } = data || {};

  useToastError(error);

  if (!tutorial) {
    return (
      <EmptyProductState
        className="mt-20"
        icon={CircleOff}
        header="404 - Not Found"
        message="The resources you are requesting for does not exist or not found."
      >
        <Button asChild variant="ringHover" size="lg">
          <Link to={PATHS.STORE_TUTORIAL}>Go Back</Link>
        </Button>
      </EmptyProductState>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Video Player Skeleton */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Skeleton className="h-full w-full" />
          </div>

          {/* Title and Actions Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>

          {/* Related Videos Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <TutorialSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Video Player Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <video
            className="h-full w-full"
            controls
            poster="/placeholder.svg?height=720&width=1280"
            preload="metadata"
          >
            <source src={tutorial.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Title and Actions */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold md:text-3xl">{tutorial.title}</h1>

          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
            <Button
              onClick={markAsCompleted}
              disabled={_tutorial?.isCompleted || isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Mark as Completed
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm max-w-none dark:prose-invert md:prose-base">
          <h2 className="text-xl font-semibold">Description</h2>
          <Text className="tracking-tight md:text-[17px]">
            {tutorial.description}
          </Text>
        </div>

        {/* Related Videos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Related Videos</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((tutorial, index) => (
              <TutorialCard {...tutorial} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDynamicTutorial;
