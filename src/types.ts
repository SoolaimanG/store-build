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
  STORE_ORDERS = "/store-orders",
  STORE_SETTINGS = "/store-settings/",
  STORE_CUSTOMERS = "/store-customers/",
}

export type IPaymentDetails = {
  accountNumber: string;
  bankName: string;
  accountName: string;
};

export type ICustomer = {
  email: string;
  phone_number: string;
  name: string;
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

export type IUseStoreBuildTypes = {
  openOTPValidator: IOtpValidator;
  openAddPaymentDetailsModal: boolean;
  setOpenAddPaymentDetailsModal: (prop: boolean) => void;
  setOpenOTPValidator: (prop: IOtpValidator) => void;
  user: IUser | null;
  setUser: (props: Partial<IUser>) => void;
  setIsPaymentDetailsConfirmed: () => void;
  isPaymentConfirmed: boolean;
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
export type ISortBy = "least" | "expensive" | "discount";
export type IProductToShow =
  | "random"
  | "best-sellers"
  | "expensive"
  | "discounted";
export type IDisplay = "grid" | "flex";
export type IDisplayStyle = "one" | "two" | "three";

export type IStoreFeatures = {
  header: string;
  description: string;
  style: IDisplayStyle;
  image: string;
};

export type ISection = {
  header: string;
  products: IProductToShow;
  display: IDisplay;
};

export type IStore = {
  _id?: string;
  storeName: string;
  productType: string;
  templateId: string;
  aboutStore?: string;
  description?: string;
  owner: string;
  isActive: boolean;
  paymentDetails: IPaymentDetails;
  customizations?: {
    logoUrl: string;
    theme: string;
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
    productPage: {
      showSimilarProducts: boolean;
      style: IDisplayStyle;
      showReviews: boolean;
    };
    features: {
      showFeatures: boolean;
      features: IStoreFeatures[];
      style: IDisplayStyle;
    };
    footer: {
      style: IDisplayStyle;
      showNewsLetter: boolean;
    };
  };
  sections: ISection[];
} & ITimeStamp;
