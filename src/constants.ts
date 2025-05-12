import {
  BrushIcon,
  ChartBar,
  DollarSign,
  Footprints,
  HeadphonesIcon,
  LayoutGrid,
  LayoutPanelTop,
  Sparkles,
  Ticket,
  UserRoundPlus,
} from "lucide-react";
import { bentoCardType, ITutorial, PATHS, templateShowCase } from "./types";
import JewelryTemplateImage from "@/assets/jewelry-template-img.jpeg";
import ClothingTemplateImage from "@/assets/clothing-template-img.jpeg";
import TechTemplateImage from "@/assets/tech-template-img.jpeg";
import BeautyTemplateImage from "@/assets/beauty-template-img.jpeg";
import FoodTemplateImage from "@/assets/food-store-template-image.png";
import FitnessTemplateImage from "@/assets/tech-template-img.jpeg";
import { z } from "zod";
import { Home, Users, Settings, ShoppingBag, Store } from "lucide-react";
import { appConfig } from "./lib/utils";
import { Variants } from "framer-motion";

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

export const nigeriaStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
].map((state) => ({
  value: state.toLowerCase().replace(" ", "-"),
  label: state,
}));

export const availableSizes = [
  { size: "XS", label: "Extra Small" },
  { size: "S", label: "Small" },
  { size: "M", label: "Medium" },
  { size: "L", label: "Large" },
  { size: "XL", label: "Extra Large" },
  { size: "XXL", label: "Double Extra Large" },
  { size: "XXXL", label: "Triple Extra Large" },
];

export const availableGenders = [
  {
    sex: "M",
    label: "Male",
  },
  {
    sex: "F",
    label: "Female",
  },
  {
    sex: "U",
    label: "Unisex",
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
    icon: LayoutGrid,
    label: "Integrations",
    path: PATHS.STORE_INTEGRATIONS,
  },
  {
    icon: Ticket,
    label: "Coupon",
    path: PATHS.STORE_COUPON,
  },
  {
    icon: Footprints,
    label: "Tutorials",
    path: PATHS.STORE_TUTORIAL,
  },
  {
    icon: UserRoundPlus,
    label: "Referrals",
    path: PATHS.STORE_REFERRALS,
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

export const chatBotLanguage = [
  {
    value: "english",
    label: "English",
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
  { icon: "👚", className: "md:-left-16 -left-5 -top-10 md:top-0" },
  { icon: "💍", className: "-right-4 md:-right-[5rem] -top-[4rem] md:top-6" },
  { icon: "🏋️", className: "md:-left-8 -left-1 md:-left-[5rem] -bottom-20" },
  { icon: "💻", className: "right-4 md:-right-[5rem] -bottom-[6rem]" },
];

export const iconList = [
  "ShoppingBag",
  "ShoppingCart",
  "Store",
  "Package",
  "Truck",
  "CreditCard",
  "Wallet",
  "DollarSign",
  "Percent",
  "Tag",
  "Tags",
  "Ticket",
  "Receipt",
  "BarChart",
  "PieChart",
  "TrendingUp",
  "Gift",
  "Award",
  "Star",
  "Heart",
  "ThumbsUp",
  "Zap",
  "Box",
  "Boxes",
  "Archive",
  "Clipboard",
  "ClipboardCheck",
  "ClipboardList",
  "Smartphone",
  "Laptop",
  "Monitor",
  "Printer",
  "Camera",
  "Headphones",
  "Speaker",
  "Watch",
  "Shirt",
  "Shoe",
  "Umbrella",
  "Coffee",
  "Utensils",
  "ShoppingBasket",
  "Banknote",
  "Coins",
  "CreditCard",
  "Landmark",
  "Building",
  "Home",
  "Truck",
  "Plane",
  "Car",
  "Train",
  "Ship",
  "MapPin",
  "Globe",
  "Search",
  "Filter",
  "SortAsc",
  "SortDesc",
  "ArrowUpDown",
];

export const menu = (
  storeCode: string,
  payload?: { category?: string; trackOrder?: string }
) => [
  {
    name: "About Us",
    path: `${location.pathname}#about-us`,
  },
  {
    name: "Collections",
    path: `/store/${storeCode}/products/?category=${payload?.category || ""}`,
  },
  {
    name: "Products",
    path: `/store/${storeCode}/products/`,
  },
  {
    name: "Track Order",
    path: `/store/${storeCode}/track-order/${payload?.trackOrder || ""}`,
  },
];

// Schemas
export const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const storeNameSchema = z.object({
  storeName: z.string().min(1, { message: "Store name is required" }),
});

export const fullNameSchema = z.object({
  fullName: z.string().max(30, "Name is too long").min(4, "Name is too short"),
});

export const productTypeSchema = z.object({
  productType: z.string().min(1, { message: "Please select a product type" }),
});

export const flutterwaveManagerSchema = z.object({
  useCustomerDetails: z.boolean(),
  storeName: z.string().optional(),
  storeEmail: z.string().optional(),
  storePhoneNumber: z.string().optional(),
  chargeCustomers: z.boolean(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  price: z.object({
    default: z.number().min(0, "Price must be a positive number"),
    useDefaultForAll: z.boolean(),
    sizes: z.array(z.record(z.number().min(0))).optional(),
  }),
  availableSizes: z.array(z.string()).optional(),
  discount: z.number().min(0).max(100).optional(),
  colors: z
    .array(
      z.object({
        name: z.string(),
        hex: z.string(),
      })
    )
    .optional(),
  stockQuantity: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
  isDigital: z.boolean(),
  gender: z.array(z.string()).optional(),
  shippingDetails: z
    .object({
      isFreeShipping: z.boolean(),
      shippingCost: z.number().optional(),
      weight: z.number().optional(),
      dimensions: z
        .object({
          length: z.number().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
  isActive: z.boolean(),
  shippingRegions: z.array(z.string()).optional(),
  media: z
    .array(
      z.object({
        url: z.string(),
        altText: z.string(),
        mediaType: z.string(),
      })
    )
    .optional(),
  shipAllRegion: z.boolean().optional(),
});

export const orderSchema = z.object({
  storeId: z.string().min(1, "Store ID is required"),
  orderStatus: z.enum([
    "Pending",
    "Completed",
    "Cancelled",
    "Refunded",
    "Shipped",
    "Processing",
  ]),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(1, "Phone number is required"),
  customerName: z.string().optional(),
  shippingAddress: z.object({
    addressLine1: z.string().min(1, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  paymentMethod: z.string().min(1, "Payment method is required").optional(),
  amountPaid: z.number().optional(),
  totalAmount: z.number().optional(),
  shippingMethod: z.enum(["EXPRESS", "REGULAR"]),
  shippingCost: z.number().optional(),
  estimatedDeliveryDate: z
    .date({
      message: "Estimated delivery date is required",
    })
    .optional(),
  note: z.string().optional(),
  products: z.array(z.any()),
  deliveryType: z.enum(["pick_up", "sendbox", "waybill"]),
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

export const orderForm = (states?: string[], orderStatus = ["Pending"]) => [
  {
    title: "Order Details",
    fields: [
      { name: "storeId", label: "Order Id", type: "text", readOnly: true },
      {
        name: "orderStatus",
        label: "Order Status",
        type: "select",
        options: orderStatus,
      },
      {
        name: "paymentStatus",
        label: "Payment Status",
        type: "select",
        options: ["pending", "paid", "failed"],
      },
    ],
    className: "lg:col-span-1 row-span-1",
  },
  {
    title: "Customer Information",
    fields: [
      { name: "customerEmail", label: "Customer Email", type: "email" },
      { name: "customerPhone", label: "Customer Phone", type: "tel" },
      { name: "customerName", label: "Customer Name", type: "text" },
    ],
    className: "lg:col-span-2 row-span-1",
  },
  {
    title: "Shipping Address",
    fields: [
      {
        name: "shippingAddress.addressLine1",
        label: "Address Line 1",
        type: "text",
      },
      {
        name: "shippingAddress.addressLine2",
        label: "Address Line 2",
        type: "text",
      },
      { name: "shippingAddress.city", label: "City", type: "text" },
      {
        name: "shippingAddress.state",
        label: "State",
        type: "select",
        options: states,
      },
      {
        name: "shippingAddress.postalCode",
        label: "Postal Code",
        type: "text",
      },
      {
        name: "shippingAddress.country",
        label: "Country",
        type: "select",
        options: ["Nigeria"],
      },
    ],
    className: "lg:col-span-2 row-span-2",
  },
  {
    title: "Payment Details",
    fields: [
      {
        name: "paymentMethod",
        label: "Payment Method",
        type: "select",
        options: ["Credit Card", "PayPal", "Bank Transfer"],
      },
      {
        name: "amountPaid",
        label: "Amount Paid",
        type: "number",
        readOnly: true,
      },
      {
        name: "totalAmount",
        label: "Total Amount",
        type: "number",
        readOnly: true,
      },
    ],
    className: "lg:col-span-1 row-span-1",
  },
  {
    title: "Shipping Details",
    fields: [
      {
        name: "shippingMethod",
        label: "Shipping Method",
        type: "select",
        options: ["Standard", "Express"],
      },
      {
        name: "shippingCost",
        label: "Shipping Cost",
        type: "number",
        readOnly: true,
      },
      {
        name: "estimatedDeliveryDate",
        label: "Estimated Delivery Date",
        type: "date",
      },
      {
        name: "deliveryType",
        label: "Delivery Type",
        type: "select",
        options: ["pick_up", "waybill", "sendbox"],
      },
    ],
    className: "lg:col-span-1 row-span-1",
  },
  {
    title: "Additional Information",
    fields: [{ name: "note", label: "Note", type: "textarea" }],
    className: "lg:col-span-3 row-span-1",
  },
];

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

export const slideInFromTop: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export const slideInFromLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

export const popIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export const tutorialVideos: (ITutorial & {
  videoUrl: string;
  relatedVideos?: string[];
})[] = [
  {
    _id: "1",
    videoUrl: "https://example.com/video1.mp4",
    title: "Getting Started with Dashboard",
    description:
      "Learn how to navigate and use the dashboard effectively to monitor key metrics. This tutorial covers an overview of the interface, key features like real-time analytics, and how to access detailed reports to make informed decisions about your business operations. By the end of this video, you'll be comfortable using the dashboard as a central hub for managing your store's performance. Additionally, it provides a foundation for exploring advanced tools available in the dashboard, ensuring your store's operational efficiency is maximized. Understand the nuances of data interpretation and apply these insights to boost productivity and customer satisfaction.",
    isCompleted: false,
    category: "Dashboard",
    user: "User 1",
    rating: 4.5,
    type: "video",
    relatedVideos: ["2", "4", "6", "8", "9"],
  },
  {
    _id: "2",
    videoUrl: "https://example.com/video2.mp4",
    title: "Managing Products",
    description:
      "Step-by-step guide to adding, editing, and organizing products in your store. This video will walk you through the process of creating product listings with detailed descriptions, managing inventory levels to avoid stockouts, and categorizing products for easy customer navigation. You'll also learn best practices for optimizing product pages to boost sales and improve customer experience. Furthermore, the tutorial highlights how to analyze product performance and adapt strategies to meet evolving market trends, ensuring your inventory remains competitive and appealing to your target audience.",
    isCompleted: false,
    category: "Products",
    user: "User 2",
    rating: 4.7,
    type: "video",
    relatedVideos: ["3", "8"],
  },
  {
    _id: "3",
    videoUrl: "https://example.com/video3.mp4",
    title: "Creating New Products",
    description:
      "How to use the CreateProducts feature to add new items to your inventory. This tutorial explains everything from entering essential product details, uploading high-quality images, to setting competitive prices. You'll also discover tips for using product tags and attributes to enhance searchability and improve the shopping experience for your customers. Beyond the basics, this video includes advanced techniques for leveraging customer feedback to refine product listings and drive higher engagement, making it an invaluable resource for effective product management.",
    isCompleted: false,
    category: "CreateProducts",
    user: "User 3",
    rating: 4.4,
    type: "video",
    relatedVideos: ["2", "8"],
  },
  {
    _id: "4",
    videoUrl: "https://example.com/video4.mp4",
    title: "Managing Orders",
    description:
      "Learn how to view, track, and fulfill orders efficiently. This video provides an in-depth guide to order management, including how to process payments, update order statuses, and handle cancellations or returns. You'll also get insights into using order analytics to identify trends and improve fulfillment workflows, ensuring a seamless customer experience. Additionally, the tutorial covers advanced reporting tools that can help identify bottlenecks in the order process, enabling proactive solutions for better customer satisfaction and operational effectiveness.",
    isCompleted: false,
    category: "Orders",
    user: "User 4",
    rating: 4.6,
    type: "video",
    relatedVideos: ["8", "5"],
  },
  {
    _id: "5",
    videoUrl: "https://example.com/video5.mp4",
    title: "Creating New Orders",
    description:
      "Step-by-step guide to using CreateOrders to process customer orders. You'll learn how to manually create orders for customers who contact you directly, apply discounts or coupons, and ensure accurate order details are captured. This tutorial also discusses ways to personalize orders for customer satisfaction and retention. Moreover, it emphasizes the importance of maintaining consistent communication during order processing to build trust and encourage repeat business, making it a must-watch for enhancing customer relationships.",
    isCompleted: false,
    category: "CreateOrders",
    user: "User 5",
    rating: 4.5,
    type: "video",
    relatedVideos: ["4", "8"],
  },
  {
    _id: "6",
    videoUrl: "https://example.com/video6.mp4",
    title: "Managing Customers",
    description:
      "How to view, edit, and communicate with your customer base. This video teaches you to access customer profiles, track their purchase history, and understand their preferences. You'll also learn how to segment customers into groups for targeted marketing campaigns and use communication tools to build strong relationships and drive repeat business. Additionally, the video offers practical advice on leveraging customer insights to craft personalized experiences, fostering loyalty and boosting your store's reputation in the competitive market.",
    isCompleted: false,
    category: "Customers",
    user: "User 6",
    rating: 4.3,
    type: "video",
    relatedVideos: ["7", "5", "4", "3", "2", "1"],
  },
  {
    _id: "7",
    videoUrl: "https://example.com/video7.mp4",
    title: "Customizing Storefront",
    description:
      "Learn how to design and manage your storefront layout and branding. This tutorial walks you through customizing your store's appearance, from choosing templates to adjusting colors, fonts, and layouts. You'll also explore options for adding banners, promotional sections, and optimizing your store's design for mobile devices to enhance user experience and boost conversions. Furthermore, the video emphasizes the importance of consistent branding across all touchpoints, ensuring your store resonates well with customers and stands out in the marketplace.",
    isCompleted: false,
    category: "Storefront",
    user: "User 7",
    rating: 4.7,
    type: "video",
    relatedVideos: ["8", "9"],
  },
  {
    _id: "8",
    videoUrl: "https://example.com/video8.mp4",
    title: "Setting Up Integrations",
    description:
      "How to connect third-party tools and APIs using the Integrations feature. This video demonstrates the process of integrating payment gateways, marketing tools, and analytics platforms to streamline your business operations. You'll also learn about troubleshooting common issues and ensuring seamless data flow between your store and external services. Additionally, the tutorial highlights key security measures to adopt when integrating external tools, safeguarding your data and maintaining a robust operational framework.",
    isCompleted: false,
    category: "Integrations",
    user: "User 8",
    rating: 4.4,
    type: "video",
    relatedVideos: ["1", "2", "4"],
  },
  {
    _id: "9",
    videoUrl: "https://example.com/video9.mp4",
    title: "Managing Coupons",
    description:
      "Step-by-step guide to creating, applying, and tracking coupon codes. This tutorial explains how to use coupons to attract new customers, encourage repeat purchases, and boost sales during promotional campaigns. You'll also learn how to set expiration dates, minimum order requirements, and analyze the effectiveness of your coupon strategies. Beyond that, it delves into advanced techniques for designing enticing promotional offers that align with seasonal trends and customer preferences, maximizing their impact on revenue.",
    isCompleted: false,
    category: "Coupons",
    user: "User 9",
    rating: 4.6,
    type: "video",
    relatedVideos: ["6"],
  },
  {
    _id: "10",
    videoUrl: "https://example.com/video10.mp4",
    title: "Setting Up Referrals",
    description:
      "How to create and track referral programs to grow your user base. This video covers designing referral incentives, tracking referrals through your dashboard, and leveraging analytics to optimize your program. By the end, you'll be equipped to use referrals as a powerful tool for organic growth and increased engagement. Additionally, the tutorial highlights ways to measure the effectiveness of different referral campaigns, enabling you to refine strategies for maximizing reach and profitability.",
    isCompleted: false,
    category: "Referrals",
    user: "User 10",
    rating: 4.5,
    type: "video",
  },
  {
    _id: "12",
    videoUrl: "https://example.com/video11.mp4",
    title: "Learn to Use AI",
    description:
      "Discover how to leverage AI features for enhanced app performance and user preferences. This tutorial introduces the AI-driven tools available in your store builder, including personalized product recommendations, automated customer support, and data-driven insights. You'll see practical demonstrations of how AI can save time, increase efficiency, and provide a superior customer experience. Furthermore, the tutorial explores cutting-edge AI applications that can adapt to market changes, keeping your business ahead in an evolving digital landscape.",
    isCompleted: false,
    category: "Settings",
    user: "User 11",
    rating: 5.0,
    type: "video",
    relatedVideos: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  },
  {
    _id: "11",
    videoUrl: "https://example.com/video11.mp4",
    title: "Customizing Settings",
    description:
      "Configure app settings for optimal performance and user preferences. This video covers the various customization options available, such as adjusting notification preferences, setting up security measures, and personalizing the app's appearance. You'll learn how to ensure that the platform aligns perfectly with your operational needs and enhances overall efficiency. Additionally, the tutorial delves into advanced customization features that cater to unique business requirements, offering unparalleled flexibility and control over your store's functionality.",
    isCompleted: false,
    category: "Settings",
    user: "User 11",
    rating: 4.8,
    type: "video",
    relatedVideos: ["8"],
  },
];
