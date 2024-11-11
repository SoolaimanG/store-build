import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export enum PATHS {
  HOME = "/",
  FEATURES = "#features",
  PRICING = "#pricing",
}

export type LightingSceneProps = {
  side?: "left" | "right" | "top" | "bottom";
  color?: "purple";
  size?: "small" | "medium" | "large";
  intensity?: "low" | "medium" | "high";
};

export type rateCardTypes = {
  title: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

export type templateShowCase = {
  id: string;
  name: string;
  descriptions: string;
  used: number;
  image?: string;
};

export type bentoCardType = {
  name: string;
  className: string;
  background: React.ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
};

export type lucideIcons = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;
