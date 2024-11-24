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
import BeautyTemplateImage from "@/assets/beauty-template-img.jpeg";
import FoodTemplateImage from "@/assets/food-store-template-image.png";
import FitnessTemplateImage from "@/assets/tech-template-img.jpeg";
import { z } from "zod";
import { Home, Users, Settings, ShoppingBag, Store } from "lucide-react";
import { appConfig } from "./lib/utils";

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
    path: "#pricing",
  },
  {
    name: "Dashboard",
    path: PATHS.DASHBOARD,
  },
];

export const dashboardPages = [
  {
    name: "Insights",
    path: "",
  },
  {
    name: "Inventories",
    path: "",
  },
  {
    name: "Orders",
    path: "",
  },
  {
    name: "Store Front",
    path: "",
  },
  {
    name: "Settings",
    path: "",
  },
];

export const sidebarItems = [
  { icon: Home, label: "Dashboard", path: PATHS.DASHBOARD },
  {
    icon: ShoppingBag,
    label: "Products",
    path: PATHS.STORE_PRODUCTS,
  },
  {
    icon: DollarSign,
    label: "Orders",
    path: PATHS.STORE_ORDERS,
  },
  {
    icon: Users,
    label: "Customers",
    path: PATHS.STORE_CUSTOMERS,
  },
  {
    icon: Store,
    label: "Storefront",
    path: PATHS.STORE_FRONT,
  },
  {
    icon: Settings,
    label: "Settings",
    path: PATHS.STORE_SETTINGS,
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
    image: BeautyTemplateImage,
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
    image: FoodTemplateImage,
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
    priceMonthly: `₦${appConfig.premiumAmount}`,
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

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export const pageVariants = {
  initial: { opacity: 0, x: 50 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -50 },
};

export const formAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.4 },
};

export const buttonAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.6 },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export const floatingIcons = [
  { icon: "👚", className: "-left-16 top-0" },
  { icon: "💍", className: "-right-8 md:-right-[5rem] top-6" },
  { icon: "🏋️", className: "-left-8 md:-left-[5rem] -bottom-14" },
  { icon: "💻", className: "right-4 md:-right-[5rem] -bottom-[5.5rem]" },
];

// Schemas
export const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const storeNameSchema = z.object({
  storeName: z.string().min(1, { message: "Store name is required" }),
});

export const productTypeSchema = z.object({
  productType: z.string().min(1, { message: "Please select a product type" }),
});

// Animation Variant
export const buttonVariants = (scale = 1.05, tabScale = 0.95) => {
  return {
    hover: {
      scale,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: tabScale },
  };
};
