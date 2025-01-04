import {
  BrushIcon,
  ChartBar,
  DollarSign,
  HeadphonesIcon,
  LayoutGrid,
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
  { icon: "👚", className: "-left-16 top-0" },
  { icon: "💍", className: "-right-8 md:-right-[5rem] top-6" },
  { icon: "🏋️", className: "-left-8 md:-left-[5rem] -bottom-14" },
  { icon: "💻", className: "right-4 md:-right-[5rem] -bottom-[5.5rem]" },
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
  shippingMethod: z.string().min(1, "Shipping method is required"),
  shippingCost: z.number().optional(),
  estimatedDeliveryDate: z
    .date({
      message: "Estimated delivery date is required",
    })
    .optional(),
  note: z.string().optional(),
  products: z.array(z.any()),
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
      { name: "storeId", label: "Store ID", type: "text", readOnly: true },
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
        options: ["Standard", "Express", "Overnight"],
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
    ],
    className: "lg:col-span-1 row-span-1",
  },
  {
    title: "Additional Information",
    fields: [{ name: "note", label: "Note", type: "textarea" }],
    className: "lg:col-span-3 row-span-1",
  },
];
