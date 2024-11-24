import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { FC } from "react";
import { tiers } from "@/constants";
import { CheckIcon } from "lucide-react";
import { PATHS } from "@/types";
import OpenSubscribeWindowBtn from "./open-subscribe-window-btn";

const PricingCard: FC<
  (typeof tiers)[0] & { tierIdx?: number; className?: string; btnText?: string }
> = ({
  featured,
  features,
  id,
  name,
  priceMonthly,
  description,
  tierIdx,
  className,
  btnText = "Get started today",
}) => {
  return (
    <div
      className={cn(
        featured
          ? "relative bg-gray-900 shadow-2xl"
          : "bg-white sm:mx-8 lg:mx-0",
        featured
          ? ""
          : tierIdx === 0
          ? "rounded-t-3xl sm:rounded-b-none lg:rounded-bl-3xl lg:rounded-tr-none"
          : "sm:rounded-t-none lg:rounded-bl-none lg:rounded-tr-3xl",
        "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10",
        className
      )}
    >
      <h3
        id={id}
        className={cn(
          featured ? "text-primary" : "text-indigo-600",
          "text-base/7 font-semibold"
        )}
      >
        {name}
      </h3>
      <p className="mt-4 flex items-baseline gap-x-2">
        <span
          className={cn(
            featured ? "text-white" : "text-gray-900",
            "text-5xl font-semibold tracking-tight"
          )}
        >
          {priceMonthly}
        </span>
        <span
          className={cn(
            featured ? "text-gray-400" : "text-gray-500",
            "text-base"
          )}
        >
          /month
        </span>
      </p>
      <p
        className={cn(
          featured ? "text-gray-300" : "text-gray-600",
          "mt-6 text-base/7"
        )}
      >
        {description}
      </p>
      <ul
        role="list"
        className={cn(
          featured ? "text-gray-300" : "text-gray-600",
          "mt-8 space-y-3 text-sm/6 sm:mt-10"
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <CheckIcon
              aria-hidden="true"
              className={cn("h-6 w-5 flex-none text-primary")}
            />
            {feature}
          </li>
        ))}
      </ul>
      {name === "Free" && (
        <Button asChild>
          <Link
            to={PATHS.SIGNUP}
            aria-describedby={id}
            className={cn(
              "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 w-full"
            )}
          >
            {btnText}
          </Link>
        </Button>
      )}
      {tierIdx === 1 && (
        <OpenSubscribeWindowBtn>
          <Button
            variant="default"
            className="mt-8 block bg-primary rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 w-full"
          >
            {btnText}
          </Button>
        </OpenSubscribeWindowBtn>
      )}
    </div>
  );
};

export default PricingCard;
