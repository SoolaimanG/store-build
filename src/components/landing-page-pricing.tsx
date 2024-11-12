import { CheckIcon } from "lucide-react";
import { Text } from "./text";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { tiers } from "@/constants";
import { FadeInWhenVisible } from "./fade-in-when-visible";
import { NewsLetterButton } from "./news-letter-btn";

export default function LandingPagePricing() {
  return (
    <div className="relative isolate py-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <FadeInWhenVisible>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-primary">Pricing</h2>
          <Text className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-300 sm:text-6xl">
            Choose the right plan for you
          </Text>
        </div>
      </FadeInWhenVisible>
      <FadeInWhenVisible delay={0.2}>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-100 sm:text-xl/8">
          Choose an affordable plan that's packed with the best features for
          engaging your audience, creating customer loyalty, and driving sales.
        </p>
      </FadeInWhenVisible>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <FadeInWhenVisible key={tier.id} delay={0.3 + tierIdx * 0.1}>
            <div
              className={cn(
                tier.featured
                  ? "relative bg-gray-900 shadow-2xl"
                  : "bg-white sm:mx-8 lg:mx-0",
                tier.featured
                  ? ""
                  : tierIdx === 0
                  ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
                  : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
                "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
              )}
            >
              <h3
                id={tier.id}
                className={cn(
                  tier.featured ? "text-primary" : "text-indigo-600",
                  "text-base/7 font-semibold"
                )}
              >
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={cn(
                    tier.featured ? "text-white" : "text-gray-900",
                    "text-5xl font-semibold tracking-tight"
                  )}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={cn(
                    tier.featured ? "text-gray-400" : "text-gray-500",
                    "text-base"
                  )}
                >
                  /month
                </span>
              </p>
              <p
                className={cn(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-6 text-base/7"
                )}
              >
                {tier.description}
              </p>
              <ul
                role="list"
                className={cn(
                  tier.featured ? "text-gray-300" : "text-gray-600",
                  "mt-8 space-y-3 text-sm/6 sm:mt-10"
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className={cn("h-6 w-5 flex-none text-primary")}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <NewsLetterButton showModal>
              <Button asChild>
                <Link
                  to={tier.href}
                  aria-describedby={tier.id}
                  className={cn(
                    "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 w-full"
                  )}
                >
                  Get started today
                </Link>
              </Button>
              </NewsLetterButton>
            </div>
          </FadeInWhenVisible>
        ))}
      </div>
    </div>
  );
}
