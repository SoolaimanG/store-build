"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  UserPlus,
  Check,
  Twitter,
  Share,
  Instagram,
  Users,
} from "lucide-react";
import { appConfig, formatAmountToNaira, storeBuilder } from "@/lib/utils";
import { Text } from "@/components/text";
import { PATHS } from "@/types";
import { useStoreBuildState } from "@/store";
import { EmptyProductState } from "@/components/empty";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useToastError } from "@/hooks/use-toast-error";

const steps = [
  {
    icon: MessageSquare,
    title: "Step 1: Send Invitations",
    description: `Send your referral link to friends and tell them how useful ${appConfig.name} is!`,
  },
  {
    icon: UserPlus,
    title: "Step 2: Registration",
    description: `Let your friends register to our services using your personal referral code!`,
  },
  {
    icon: Check,
    title: `Step 3: Use ${appConfig.name} for Free!`,
    description: `You get ${formatAmountToNaira(appConfig.referralPrice)} on ${
      appConfig.name
    } when your referral complete signup.`,
  },
];

function ReferralsLoading() {
  return (
    <div className="container mx-auto p-3 md:p-0 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-28 bg-muted animate-pulse rounded" />
      </header>

      {/* Top Section Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Steps Card Skeleton */}
        <div className="p-4 md:p-6 lg:col-span-2 border rounded-lg">
          <div className="h-7 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center px-4">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="text-center mb-12 md:mb-0">
                <div className="w-16 h-16 bg-muted animate-pulse rounded-full mx-auto mb-4" />
                <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2 mx-auto" />
                <div className="h-4 w-[250px] bg-muted animate-pulse rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Invite Card Skeleton */}
        <div className="p-4 md:p-6 border rounded-lg">
          <div className="h-6 w-36 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-full bg-muted animate-pulse rounded mb-4" />
          <div className="h-10 w-full bg-muted animate-pulse rounded mb-6" />
          <div className="h-5 w-40 bg-muted animate-pulse rounded mb-4" />
          <div className="h-4 w-full bg-muted animate-pulse rounded mb-4" />
          <div className="h-12 w-full bg-muted/50 animate-pulse rounded" />
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="p-4 border rounded-lg">
            <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
            <div className="h-7 w-32 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
        {[1, 2, 3].map((_, idx) => (
          <div key={idx} className="p-4 border-t">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardReferrals() {
  const { user } = useStoreBuildState();
  const referralLink = `${import.meta.env.VITE_BASE_URL}${
    PATHS.SIGNUP
  }?referral=${user?.referralCode}`;

  const { isLoading, data, error } = useQuery({
    queryKey: ["referrals"],
    queryFn: () => storeBuilder.getReferrals(),
  });

  const shareReferralLink = async (socialMedia?: "instagram" | "twitter") => {
    if (!socialMedia) {
      try {
        // First check if sharing is supported
        if (!navigator.canShare) {
          toast({
            title: "ERROR",
            description:
              "Sharing is not supported on your device. Please copy the link manually.",
          });
          return;
        }

        const shareData = {
          text: "Check out this amazing platform! Sign up using my referral link to get started.",
          title: "Join Us Today!",
          url: referralLink,
        };

        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast({
            title: "Success",
            description: "Referral link shared successfully!",
          });
        } else {
          toast({
            title: "ERROR",
            description:
              "Unable to share this content. Please copy the link manually.",
          });
        }
      } catch (error) {
        console.error("Error sharing:", error);
        toast({
          title: "ERROR",
          description:
            "An error occurred while trying to share the referral link. Please try again.",
        });
      }
    } else {
      // Handle social media-specific sharing
      const encodedText = encodeURIComponent(
        "Check out this amazing platform! Sign up using my referral link to get started: "
      );
      const encodedLink = encodeURIComponent(referralLink);

      if (socialMedia === "instagram") {
        // Instagram sharing logic
        toast({
          title: "INFO",
          description:
            "Instagram does not support direct sharing of links. Please copy and share manually.",
        });
      } else if (socialMedia === "twitter") {
        // Twitter sharing logic
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}${encodedLink}`;
        window.open(twitterUrl, "_blank");
        toast({
          title: "Success",
          description: "Redirecting to Twitter to share your referral link!",
        });
      }
    }
  };

  const { data: referralData } = data || {};

  useToastError(error);

  if (isLoading) return <ReferralsLoading />;

  return (
    <div className="container mx-auto p-3 md:p-0 space-y-6 md:space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-4xl">Referrals</h2>
        <Button
          onClick={() => shareReferralLink()}
          variant="ringHover"
          className="gap-2 rounded-sm"
        >
          <Share size={17} />
          Share Link
        </Button>
      </header>
      {/* Top Section */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="p-4 md:p-6 lg:col-span-2">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            Earn with {appConfig.name}
          </h1>
          <Text className="tracking-tight mb-8">
            Invite your friends to {appConfig.name}. If they sign up, you and
            your friend will get 2 premium features for free!
          </Text>

          <div className="flex flex-col md:flex-row justify-between items-center relative px-4">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center mb-12 md:mb-0">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon size={24} className="text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">{step.title}</h3>
                <Text className="tracking-tight w-[250px]">
                  {step.description}
                </Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Invite your friends!
          </h2>
          <Text className=" mb-4">
            Add your friends email addresses and sent them invitations to join!
          </Text>

          <div className="space-y-4">
            <Input placeholder="Email addresses..." className="mb-6" />

            <div className="space-y-4">
              <h3 className="font-medium">Share the referral link</h3>
              <p className="text-sm text-gray-500">
                You can also share your referral link by copying and sending it
                to your friends or sharing it on social media.
              </p>

              <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded">
                <span className="text-sm text-gray-300 truncate flex-1">
                  {referralLink}
                </span>
                <div className="flex gap-1">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      toast({ title: "Referral Link Copied Successfully" });
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Copy link
                  </Button>
                  <Button
                    onClick={() => shareReferralLink("instagram")}
                    variant="ghost"
                    size="sm"
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => shareReferralLink("twitter")}
                    variant="ghost"
                    size="sm"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Your Earnings</p>
          <p className="text-xl md:text-2xl font-semibold">
            {formatAmountToNaira(user?.balance || 0)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Your Profit</p>
          <p className="text-xl md:text-2xl font-semibold">
            {formatAmountToNaira(referralData?.totalEarnings || 0)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Referral</p>
          <p className="text-xl md:text-2xl font-semibold">
            {referralData?.totalReferrals}
          </p>
        </Card>
      </div>

      {/* Table Section */}
      {!referralData?.referrals?.length ? (
        <EmptyProductState
          icon={Users}
          header="No Referrals"
          message="You haven't refer anyone yet!, Please click on the link below to start sharing your referral link."
        >
          <Button
            onClick={() => shareReferralLink()}
            variant="ringHover"
            className="gap-2 rounded-sm"
          >
            <Share size={17} />
            Share Link
          </Button>
        </EmptyProductState>
      ) : (
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FULL NAME</TableHead>
                <TableHead>TOTAL ORDERS</TableHead>
                <TableHead>SIGN UP COMPLETE</TableHead>
                <TableHead>JOINED AT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referralData?.referrals?.map((referral, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20-2-2025_115440_dribbble.com-V5i940R3XRIw3GwQw0zcvQt2nPGMWL.jpeg"
                          alt="User"
                        />
                        <AvatarFallback>VM</AvatarFallback>
                      </Avatar>
                      <span>{referral.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{referral.totalOrders}</TableCell>
                  <TableCell>
                    {referral.signUpComplete ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{referral.joinedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
