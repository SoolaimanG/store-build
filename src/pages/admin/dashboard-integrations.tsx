import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  MessageSquare,
  Truck,
  Instagram,
  Image,
} from "lucide-react";
import { Section } from "@/components/section";
import { ManageIntegration } from "@/components/manage-integration";
import { useQuery } from "@tanstack/react-query";
import { storeBuilder } from "@/lib/utils";
import { useToastError } from "@/hooks/use-toast-error";
import ConnectAppBtn from "@/components/connect-app-btn";

const integrations = [
  {
    id: "unsplash",
    name: "Unsplash",
    description:
      "For users to find high-quality, royalty-free images for their store",
    icon: Image,
    connected: true,
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description:
      "Work faster and smarter by integrating directly with Flutterwave, right in the app.",
    icon: CreditCard,
    connected: true,
  },
  {
    id: "chatbot",
    name: "AI Chatbot",
    description: "Enhance customer support with AI-powered conversations.",
    icon: MessageSquare,
    connected: true,
  },
  {
    id: "kwik",
    name: "Kwik Delivery",
    description: "Streamline your delivery operations with automated dispatch.",
    icon: Truck,
    connected: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Connect your Instagram feed to showcase your products.",
    icon: Instagram,
    connected: false,
  },
];

export default function DashboardIntegrations() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["integrations"],
    queryFn: () => storeBuilder.getIntegrations(),
  });

  const { data: i } = data || {};

  useToastError(error);

  const _integrations = integrations?.map((integration) => ({
    ...integration,
    connected: Boolean(
      i?.find(
        (_) =>
          _.integration.isConnected && _.integration.name === integration.id
      )
    ),
  }));

  const IntegrationSkeleton = () => (
    <Card className="bg-secondary/50 border-0 shadow-sm">
      <CardHeader>
        <Skeleton className="h-14 w-14 rounded-lg" />
        <Skeleton className="h-6 w-3/4 mt-4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-5/6 mt-1" />
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );

  return (
    <Section className="min-h-screen">
      <div className="container mx-auto py-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Integrations Tool You Use to Run Your Business
          </h1>
          <p className="text-lg text-muted-foreground">
            Effortlessly integrate essential tools into your business
            operations, ensuring seamless functionality and enhanced efficiency
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg">Read More</Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => <IntegrationSkeleton key={index} />)
            : _integrations.map((integration) => (
                <Card
                  key={integration.id}
                  className="bg-secondary/50 border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <integration.icon className="w-8 h-8 text-primary" />
                      </div>
                      {integration.connected && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500 rounded-sm"
                        >
                          Connected
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">
                      {integration.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    {integration.connected ? (
                      <ManageIntegration integration={integration}>
                        <Button className="w-full" variant="outline">
                          Manage Integration
                        </Button>
                      </ManageIntegration>
                    ) : (
                      <ConnectAppBtn integrationId={integration.id}>
                        <Button
                          variant="ringHover"
                          disabled={integration.id === "instagram"}
                          className="w-full"
                        >
                          Connect {integration.name}
                        </Button>
                      </ConnectAppBtn>
                    )}
                  </CardFooter>
                </Card>
              ))}
        </div>
      </div>
    </Section>
  );
}
