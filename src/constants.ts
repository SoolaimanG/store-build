import {
  BrushIcon,
  ChartBar,
  DollarSign,
  HeadphonesIcon,
  LayoutPanelTop,
  Sparkles,
} from "lucide-react";
import { bentoCardType, PATHS, templateShowCase } from "./types";
import JewelryTemplateImage from "@/assets/jewelry-template-img.jpeg";
import ClothingTemplateImage from "@/assets/clothing-template-img.jpeg";
import TechTemplateImage from "@/assets/tech-template-img.jpeg";
import FitnessTemplateImage from '@/assets/tech-template-img.jpeg'

export const landingPageNavBarLinks = [
  {
    name: "Home",
    path: PATHS.HOME,
  },
  {
    name: "Features",
    path: PATHS.FEATURES,
  },
  {
    name: "Pricing",
    path: PATHS.PRICING,
  },
];

export const templateShowCaseList: templateShowCase[] = [
  {
    id: "1",
    descriptions:
      "A modern tech store template with a sleek design, suitable for showcasing gadgets, electronics, and accessories.",
    name: "Tech Store",
    used: 12,
    image: TechTemplateImage,
  },
  {
    id: "2",
    descriptions:
      "A vibrant and luxurious template for beauty products, ideal for skincare, makeup, and self-care brands.",
    name: "Beauty Store",
    used: 8,
    image: "https://example.com/images/beauty-store.png",
  },
  {
    id: "3",
    descriptions:
      "An elegant fashion store template that highlights clothing and accessories, with customizable sections for seasonal collections.",
    name: "Fashion Store",
    used: 15,
    image: ClothingTemplateImage,
  },
  {
    id: "4",
    descriptions:
      "A dynamic and energetic template perfect for fitness and sports products, designed for equipment, apparel, and accessories.",
    name: "Fitness Store",
    used: 6,
    image: FitnessTemplateImage,
  },
  {
    id: "5",
    descriptions:
      "A rich, appetizing template for food items, suited for groceries, organic products, and specialty food items.",
    name: "Food Store",
    used: 10,
    image: "https://example.com/images/food-store.png",
  },
  {
    id: "6",
    descriptions:
      "A stylish and cozy template for home decor, ideal for furniture, decor pieces, and interior design stores.",
    name: "Decoration Store",
    used: 5,
    image: JewelryTemplateImage,
  },
  {
    id: "7",
    descriptions:
      "A clean and organized book store template, perfect for showcasing collections, categories, and reading recommendations.",
    name: "Book Store",
    used: 9,
    image: "https://example.com/images/book-store.png",
  },
];

export const landingPageFeatures: bentoCardType[] = [
  {
    Icon: Sparkles, // Icon representing AI feature
    background: "bg-blue-500", // Example background class for styling
    className: "feature-card", // Class name for custom styles
    cta: "Get Started", // Call-to-action button text
    description:
      "Effortlessly create a personalized store with AI that guides you through setup, design, and customization tailored to your products and brand.",
    href: "/features/ai-store-creation", // Link to more information
    name: "AI-Powered Store Creation",
  },
  {
    Icon: LayoutPanelTop,
    background: "bg-green-500",
    className: "feature-card",
    cta: "Explore Templates",
    description:
      "Choose from a range of professionally designed templates for various industries like tech, beauty, fashion, and more. No design skills needed!",
    href: "/features/templates",
    name: "Intuitive Design Templates",
  },
  {
    Icon: BrushIcon,
    background: "bg-yellow-500",
    className: "feature-card",
    cta: "Customize Your Store",
    description:
      "Easily adjust images, products, and text with a simple drag-and-drop interface, enabling anyone to create a beautiful store layout without coding.",
    href: "/features/drag-drop",
    name: "Simple Drag-and-Drop Interface",
  },
  {
    Icon: DollarSign,
    background: "bg-purple-500",
    className: "feature-card",
    cta: "View Payment Options",
    description:
      "Provide your customers with a seamless checkout experience by integrating multiple secure payment options for both local and international transactions.",
    href: "/features/payment",
    name: "Flexible Payment Options",
  },
  {
    Icon: ChartBar,
    background: "bg-teal-500",
    className: "feature-card",
    cta: "Check Insights",
    description:
      "Track store performance with advanced analytics, giving you customer insights, popular products, and sales trends to grow your business.",
    href: "/features/analytics",
    name: "Advanced Analytics & Insights",
  },
  {
    Icon: HeadphonesIcon,
    background: "bg-gray-500",
    className: "feature-card",
    cta: "Get Support",
    description:
      "Receive 24/7 customer support from our dedicated team, ready to assist you at every step of your ecommerce journey.",
    href: "/features/support",
    name: "24/7 Customer Support",
  },
];

export const tiers = [
  {
    name: "Free",
    id: "tier-free",
    href: "#",
    priceMonthly: "Free",
    description: "Get started with essential features to set up your store.",
    features: [
      "Basic store setup",
      "Up to 10 products",
      "Simple analytics",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "₦500",
    description:
      "Unlock full potential with advanced features and customization.",
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Dynamic styling and template customization",
      "Marketing tools",
    ],
    featured: true,
  },
];
