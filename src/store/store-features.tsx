import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import { IStoreFeatureProps } from "@/types";
import { FC } from "react";
import { Img } from "react-image";
import { useStoreBuildState } from ".";
import Marquee from "@/components/ui/marquee";

const FeatureCard: FC<{
  isSingleFeature: boolean;
  header: string;
  description: string;
  image: string;
}> = ({ description, header, isSingleFeature, image }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl dark:bg-slate-900 bg-gray-200 p-6 shadow-sm transition-shadow hover:shadow-md ${
        isSingleFeature ? "md:p-8" : ""
      }`}
    >
      <div className="mb-8">
        <h3 className="mb-2 text-xl font-semibold tracking-tight">{header}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div
        className={`relative overflow-hidden rounded-lg  ${
          isSingleFeature ? "h-[300px]" : "h-[200px]"
        }`}
      >
        {image ? (
          <Img
            src={image || "/placeholder.svg"}
            alt={header}
            className="object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-accent-foreground/5" />
        )}
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </div>
  );
};

export const StoreFeaturesOne: FC<IStoreFeatureProps> = ({ features }) => {
  const { currentStore } = useStoreBuildState();
  const gridClassName = cn(
    "grid gap-4 md:gap-6 mt-8",
    features.length === 1
      ? "place-items-center w-[25rem]"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  );
  return (
    <div>
      <Section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                style={{ color: currentStore?.customizations?.theme.primary }}
                className="text-sm font-medium text-primary"
              >
                FEATURES
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Exceptional Features Designed to Elevate Your Shopping
                Experience
              </h2>
            </div>
            <div className={gridClassName}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {feature.image ? (
                    <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                      <Img
                        src={feature.image || "/placeholder.svg"}
                        alt=""
                        className="w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] mb-4 rounded-lg bg-muted" />
                  )}
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.header}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Section>
    </div>
  );
};

export const StoreFeaturesTwo: FC<IStoreFeatureProps> = ({ features }) => {
  const isSingleFeature = features.length === 1;
  const { currentStore } = useStoreBuildState();

  return (
    <section className="container mx-auto px-4 py-24">
      <div
        className={`grid gap-6 lg:gap-8 ${
          isSingleFeature
            ? "md:max-w-4xl lg:max-w-5xl mx-auto"
            : "md:grid-cols-2"
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            style={{ color: currentStore?.customizations?.theme.primary }}
            className="text-sm font-medium text-primary"
          >
            FEATURES
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Exceptional Features Designed to Elevate Your Shopping Experience
          </h2>
        </div>
        {features.map((feature, index) => (
          <FeatureCard
            isSingleFeature={isSingleFeature}
            key={index}
            header={feature.header}
            description={feature.description!}
            image={feature.image}
          />
        ))}
      </div>
    </section>
  );
};

export const StoreFeatureThree: FC<IStoreFeatureProps> = ({ features }) => {
  const isSingleFeature = features.length === 1;
  const { currentStore } = useStoreBuildState();
  return (
    <section className="container mx-auto px-4 py-24">
      <div
        className={`grid gap-6 lg:gap-8 ${
          isSingleFeature
            ? "md:max-w-4xl lg:max-w-5xl mx-auto"
            : "md:grid-cols-2"
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div
            style={{ color: currentStore?.customizations?.theme.primary }}
            className="text-sm font-medium text-primary"
          >
            FEATURES
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Exceptional Features Designed to Elevate Your Shopping Experience
          </h2>
        </div>
        <Marquee pauseOnHover>
          {features.map((feature, index) => (
            <FeatureCard
              isSingleFeature={isSingleFeature}
              key={index}
              header={feature.header}
              description={feature.description!}
              image={feature.image}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
};
