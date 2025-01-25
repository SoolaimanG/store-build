import { LucideProps } from "lucide-react";
import { ReactNode } from "react";

export enum PATHS {
  HOME = "/",
  FEATURES = "#features",
  SUBSCRIBE = "#subscribe",
  SIGNUP = "/sign-up",
  SIGNIN = "/sign-in",
  DASHBOARD = "/store-dashboard/",
  STORE_PRODUCTS = "/store-products/",
  STORE_FRONT = "/store-front/",
  STORE_ORDERS = "/store-orders/",
  STORE_SETTINGS = "/store-settings/",
  STORE_CUSTOMERS = "/store-customers/",
  STORE_INTEGRATIONS = "/store-integrations/",
  STORE = "/store/",
}

export type IDashboardMetrics = {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
};

export type IIntegration = {
  id: string;
  name: string;
  description: string;
  icon: any;
  connected: boolean;
};

export type btnVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "expandIcon"
  | "ringHover"
  | "shine"
  | "gooeyRight"
  | "gooeyLeft"
  | "linkHover1"
  | "linkHover2";

export type IIntegrationType = {
  name: string;
  settings: Record<string, any>;
  isConnected: boolean;
};

export type IFilter = {
  id: string;
  label: string;
  value: string;
};

export type IPaymentDetails = {
  accountNumber: string;
  bankName: string;
  accountName: string;
};

export type IMeta = {
  type: "subscription" | "product";
  products?: [];
  date: string;
  storeId: string;
};

export type ICompletePaymentDetails = {
  children: ReactNode;
  amount: number;
  title?: string;
  description?: string;
  meta?: IMeta;
  customer: ICustomer;
  onSuccess?: () => {};
  onError?: () => {};
};

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

export interface apiResponse<T = any> {
  status: string;
  message: string;
  data: T;
}

export type IStepProps = {
  onNext: (data: Partial<ISignUp>) => void;
  onBack?: () => void;
  data: Partial<ISignUp>;
};

export type ISignUp = {
  email: string;
  storeName: string;
  productType: string;
  fullName: string;
};

export type IProductTypes = {
  _id: string;
  name: string;
  icon: string;
};

export type IOtpValidator = {
  open?: boolean;
  header?: string;
  desc?: string;
  userEmail?: string;
  otpFor?: IOTPFor;
  onSuccess?: () => void;
  onError?: () => void;
};

export interface ICartItem {
  productId: string;
  color?: string;
  size?: string;
  quantity: number;
}

export type IUseStoreBuildTypes = {
  openOTPValidator: IOtpValidator;
  openAddPaymentDetailsModal: boolean;
  currentStore?: IStore;
  setOpenAddPaymentDetailsModal: (prop: boolean) => void;
  setOpenOTPValidator: (prop: IOtpValidator) => void;
  user: IUser | null;
  setUser: (props: Partial<IUser>) => void;
  setIsPaymentDetailsConfirmed: () => void;
  isPaymentConfirmed: boolean;
  selectedProducts: IProduct[];
  onProductSelect: (products: IProduct[]) => void;
  removeProduct: (productId: string) => void;
  setCurrentStore: (store: IStore) => void;
};

export type IProductReview = {
  _id?: string;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  note: string;
  rating: number;
  productId: string;
  userEmail: string;
};

export type IJoinNewsLetterFrom = "modal" | "input";
export type ICheckFor = "storeName" | "email";

export type INewsLetter = {
  email: string;
  joinedFrom: IJoinNewsLetterFrom;
};

export type IPlanType = "free" | "premium";

export type IDiscoveredUsBy =
  | "referral"
  | "social-media"
  | "blog-post"
  | "google-search"
  | "other";

export type IStoreTemplates =
  | "tech"
  | "fitness"
  | "food"
  | "book"
  | "beauty"
  | "decoration";

export type IOTPFor = "login" | "verify-email";

export type ITimeStamp = {
  createdAt?: string;
  updatedAt?: string;
};

export type IPlan = {
  type: IPlanType;
  subscribedAt: string;
  autoRenew: boolean;
  expiredAt: string;
  amountPaid: number;
};

// Main User Data Structure
export type IUser = {
  _id: string;
  email: string;
  plan: IPlan;
  discoveredUsBy: IDiscoveredUsBy;
  firstTimeUser: boolean;
  isEmailVerified: boolean;
  referralCode: string;
  storeName: string;
  storeId: string;
  isActive: boolean;
  productType: string;
  storeCode: string;
  balance?: number;
  paymentDetails: IPaymentDetails;
} & ITimeStamp;

export type IOTP = {
  token: string;
  user: string;
  expiredAt: number;
  tokenFor: IOTPFor;
} & ITimeStamp;

export type IReferral = {
  _id: string;
  user: string;
  referBy: string;
} & ITimeStamp;

export type IBannerType = "discount" | "best-selling";
export type IBtnAction = "goToPage" | "checkOut";
export type ISortBy = "price" | "discount" | "date" | "name";
export type IProductToShow =
  | "random"
  | "best-sellers"
  | "expensive"
  | "discounted";
export type IDisplay = "grid" | "flex";
export type IDisplayStyle = "one" | "two" | "three";

export type IStoreFeatures = {
  _id?: string;
  header: string;
  description?: string;
  style: IDisplayStyle;
  image: string;
};

export type ISection = {
  _id?: string;
  header: string;
  products: IProductToShow;
  display: IDisplay;
};

export type IStoreFeatureProps = {
  showFeatures: boolean;
  features: IStoreFeatures[];
  style: IDisplayStyle;
};

export type IStoreStatus = "active" | "on-hold" | "banned";

export type IProductPage = {
  showSimilarProducts: boolean;
  style: IDisplayStyle;
  showReviews: boolean;
};

export type IStoreTheme = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
};

export type IStoreHeroSection = {
  product: string;
  message: string;
  description: string;
  btnAction: "addToCart" | "buyNow";
  image: string;
  style: IDisplayStyle;
};

export type IStore = {
  _id?: string;
  storeName: string;
  productType: string;
  status: IStoreStatus;
  storeCode: string;
  templateId: string;
  aboutStore?: string;
  description?: string;
  owner: string;
  isActive: boolean;
  paymentDetails: IPaymentDetails;
  customizations?: {
    logoUrl: string;
    theme: IStoreTheme;
    hero?: IStoreHeroSection;
    banner?: {
      type: IBannerType;
      product: string;
      description: string;
      header: string;
      btnAction: IBtnAction;
      buttonLabel: string;
      image?: string;
    };
    category?: {
      showImage: boolean;
      icon?: string;
      header: string;
      image?: string;
    };
    productsPages: {
      canFilter: boolean;
      canSearch: boolean;
      sort: ISortBy[];
      havePagination: boolean;
    };
    productPage: IProductPage;
    features: IStoreFeatureProps;
    footer: {
      style: IDisplayStyle;
      showNewsLetter: boolean;
    };
  };
  sections: ISection[];
} & ITimeStamp;

export interface CollectionFormProps {
  initialName: string;
  initialIcon: string;
  initialImage: string;
  pending?: boolean;
  onSave: (
    name: string,
    icon: string,
    image: File | null,
    slot: string
  ) => void;
  onCancel: () => void;
}

export type ICustomer = {
  email: string;
  phoneNumber: string;
  name?: string;
};

export type IPaymentStatus = "pending" | "paid" | "failed";

export type IOrderPaymentDetails = {
  paymentStatus: IPaymentStatus;
  paymentMethod: string; // Method used for payment
  transactionId?: string; // Unique ID for the payment transaction
  paymentDate: string; // Date and time of payment
  paymentLink?: string;
  tx_ref?: string;
};

export type ICustomerAddress = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type IShippingDetails = {
  shippingMethod: string;
  shippingCost: number;
  estimatedDeliveryDate: string;
  trackingNumber: string;
  carrier: "DHL";
};

export type IOrderStatus =
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Refunded"
  | "Shipped"
  | "Processing";

export type IOrder = {
  _id?: string;
  storeId: string;
  orderStatus: IOrderStatus;
  paymentDetails: IOrderPaymentDetails;
  products: IProduct[];
  customerDetails: { shippingAddress: ICustomerAddress } & ICustomer;
  paymentMethod: string;
  amountPaid: number;
  amountLeftToPay: number;
  totalAmount: number;
  shippingDetails: IShippingDetails;
  note?: string;
} & ITimeStamp;

export type IProductMedia = {
  _id?: string;
  url: string; // URL of the product image
  altText?: string; // Alt text for accessibility
  mediaType: "image" | "video";
};

export type getProductsTypes = {
  q?: string;
  sort?: "default" | "stock-level" | "low-to-high" | "high-to-low";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: number;
  productsToShow?: IProductToShow;
  colors?: string[];
  sizes?: string[];
  gender?: IGender[];
  rating?: number;
  isActive?: boolean;
  productIds?: string[];
};

export type ISaleData = {
  month: string;
  sales: number;
  revenue: number;
  returns: number;
};

export interface IProductAnalytics {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalReturns: number;
  returnRate: number;
  currentStock: number;
  saleData: ISaleData[];
  ratings: {
    average: number;
    totalReviews: number;
  };
}

export type IProductDimensions = {
  length?: number; // Length of the product
  width?: number; // Width of the product
  height?: number; // Height of the product
};

export type IRatings = {
  average: number; // Average rating (1-5 scale)
  totalReviews: number; // Total number of reviews
};

export type IProductShippingDetails = {
  isFreeShipping: boolean;
  shippingCost?: number;
  shipAllRegion: boolean;
  shippingRegions: string[];
};

export type IAvailableColors = {
  name: string;
  colorCode: string;
};

export type IGender = "M" | "F" | "U";

export type ICategory = {
  _id?: string;
  slot: string;
  img?: string;
  icon: string;
  name: string;
  storeId: string;
  description?: string;
  productCount: number;
};

export type IProduct = {
  _id?: string; // Unique identifier for the product
  storeId: string; // ID of the store owning the product
  productName: string; // Name of the product
  description: string; // Detailed description of the product
  category: string; // Category of the product (e.g., Electronics, Fashion)
  tags?: string[]; // Keywords or tags for searchability
  isDigital: boolean;
  gender: IGender[];
  price: {
    default: number;
    useDefaultPricingForDifferentSizes: boolean;
    sizes: Record<string, number>[];
  }; // Base price of the product
  discount: number;
  stockQuantity: number; // Quantity available in stock
  maxStock: number;
  availableSizes: string[];
  media: IProductMedia[]; // Array of product images
  availableColors: IAvailableColors[];
  weight: number; // Weight of the product (used for shipping)
  dimensions?: IProductDimensions; // Physical dimensions of the product
  shippingDetails: IProductShippingDetails; // Shipping-related information
  isActive: boolean;
  averageRating?: number;
  totalReviews?: number;
  lastReview?: IRating;
} & ITimeStamp;

export type IRating = {
  storeId: string;
  productId: string;
  userEmail: string;
  rating: number;
  note: string;
} & ITimeStamp;

export type IUserProductPreference = {
  color: string;
  size: string;
  quantity: number;
};

export type IPaymentIntegration = {
  chargeCustomers: boolean;
  useCustomerDetails: boolean;
  storeName: string;
  storeEmail: string;
  storePhoneNumber: string;
};

export type IChatBotIntegrationPermissions = {
  allowProductAccess: boolean;
  allowOrderAccess: boolean;
  allowCustomerAccess: boolean;
};

export type IChatBotIntegration = {
  name: string;
  language: "english";
  permissions: IChatBotIntegrationPermissions;
};

export type IDeliveryIntegration = {
  deliveryNationwide: boolean;
  shippingRegions?: string[];
};

export type IUnsplashIntegration = {
  numberOfImages: number;
};

export interface ICustomerStats {
  label: string;
  value: number;
  percentage?: number;
  formattedValue?: string; // Add this line
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt?: string;
  amountSpent: number;
  itemsBought: number;
  lastPurchase: Date;
}

export interface CustomersResponse {
  customerStats: ICustomerStats[];
  customers: Customer[];
  totalCustomers: number;
  totalPages: number;
}
