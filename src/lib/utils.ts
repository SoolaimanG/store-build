import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import {
  apiResponse,
  chargeResponse,
  Customer,
  CustomersResponse,
  getProductsTypes,
  IAvailableColors,
  ICategory,
  IChatBotIntegration,
  ICheckFor,
  ICoupon,
  ICustomerAddress,
  ICustomerStats,
  IDashboardMetrics,
  IDeliveryCostPayload,
  IDeliveryIntegration,
  IIntegrationType,
  IJoinNewsLetterFrom,
  IOrder,
  IOrderStatus,
  IOTPFor,
  IPaymentIntegration,
  IProduct,
  IProductAnalytics,
  IProductReview,
  IProductTypes,
  IRating,
  IStore,
  IStoreTheme,
  IUser,
  ShipmentResponse,
} from "@/types";
import qs from "query-string";
import Cookie from "js-cookie";
import queryString from "query-string";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const appConfig = {
  name: "Store Build",
  premiumAmount: 600,
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API + "/api/v1",
});

export const errorMessageAndStatus = (error: any) => {
  const message = error?.response?.data?.message;
  const status = error?.response?.data?.status?.toUpperCase();
  const data = error?.response?.data?.data;

  return { message, status, data };
};

export class StoreBuild {
  get getSessionToken() {
    return `Bearer ${Cookie.get("access-token")}`;
  }

  set saveCurrentStoreCodeInCookie(storeCode: string) {
    Cookie.set("current-store-code", storeCode);
  }

  get getCurrentStoreCodeFromCookie() {
    return Cookie.get("current-store-code");
  }

  // Setter for the access token, with a 2-day expiration
  setSessionToken(token: string) {
    const twoDays = 60 * 60 * 24 * 2;
    Cookie.set("access-token", token, { expires: twoDays, sameSite: "strict" });
  }

  removeSessionToken() {
    Cookie.remove("access-token");
  }

  addToCookies<T = any>(key: string, value: T) {
    Cookie.set(key, JSON.stringify(value));
  }

  getValueFromCookies<T = any>(key: string) {
    return Cookie.get(key)
      ? JSON.parse(Cookie.get(key) || "")
      : (undefined as T);
  }

  async joinNewsLetter(email: string, joinFrom: IJoinNewsLetterFrom) {
    const res: { data: apiResponse } = await api.post("/join-newsletter", {
      email,
      joinFrom,
    });
    return res.data;
  }

  async getProductTypes() {
    const res: { data: apiResponse<IProductTypes[]> } = await api.get(
      "/product-types/"
    );
    return res.data;
  }

  async signUp(
    email: string,
    storeName: string,
    productType: string,
    fullName: string,
    referralCode?: string,
    discoveredUsBy?: string
  ) {
    const res: { data: apiResponse<{ user: IUser; token: string }> } =
      await api.post("/sign-up/", {
        email,
        productType,
        referralCode,
        storeName,
        fullName,
        discoveredUsBy,
      });

    this.setSessionToken(res.data.data.token);
    return res.data;
  }

  async verifyOTP(otp: string, email: string, otpFor?: IOTPFor) {
    const res: { data: apiResponse<{ token: string }> } = await api.post(
      "/verify-token/",
      { otp, email },
      { headers: { Authorization: this.getSessionToken } }
    );

    otpFor === "login" && this.setSessionToken(res.data.data.token);

    return res.data;
  }

  async sendOTP(tokenFor: IOTPFor, email: string) {
    const res: { data: apiResponse } = await api.post("/send-otp/", {
      tokenFor,
      email,
    });

    return res.data;
  }

  async getUser() {
    const res: { data: apiResponse<IUser> } = await api.get("/user/", {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async doesEmailOrStoreExist(
    email?: string,
    storeName?: string,
    checkFor?: ICheckFor
  ) {
    const q = queryString.stringify({ email, storeName, checkFor });
    const res: { data: apiResponse<{ isExisting: boolean }> } = await api.get(
      `/does-email-or-store-exist/?${q}`
    );
    return res.data;
  }

  async verifySubscription(id: string, autoRenew = false) {
    const q = queryString.stringify({ id, autoRenew });
    const res: { data: apiResponse } = await api.get(
      "/verify-subscription/?" + q,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getBanks() {
    const res: {
      data: apiResponse<
        {
          code: string;
          id: string;
          name: string;
        }[]
      >;
    } = await api.get(`/get-banks/`);

    return res.data;
  }

  async verifyAccountNumber(accountBank: string, accountNumber: string) {
    const q = queryString.stringify({ accountBank, accountNumber });
    const res: { data: apiResponse } = await api.get(
      `/verify-account-number/?${q}`
    );

    return res.data;
  }

  async getDashboardContent(timeFrame: "all" | "7d" | "30d") {
    const q = queryString.stringify({ timeFrame });

    const res: { data: apiResponse<IDashboardMetrics[]> } = await api.get(
      `/get-dashboard-content/?${q}`,
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async getOrders(
    q?: string,
    start?: number,
    end?: number,
    asc = false,
    filter: IOrderStatus | "All" = "All",
    startDate?: string,
    endDate?: string,
    sort?: string
  ) {
    const _q = queryString.stringify({
      q,
      start,
      end,
      asc,
      filter,
      startDate,
      endDate,
      sort,
    });

    const res: {
      data: apiResponse<{
        orders: IOrder[];
        orderStatusCount: Record<IOrderStatus | "All", number>;
      }>;
    } = await api.get(`/get-orders/?${_q}`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async signOut() {
    this.removeSessionToken();
    window.location.reload();
  }

  async createOrEditProduct(product: IProduct) {
    const res: { data: apiResponse<IProduct> } = await api.post(
      "/create-or-edit-product/",
      product,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async createCategory(payload: ICategory) {
    const res: apiResponse<ICategory> = await api.post(
      "/create-category/",
      payload,
      {
        headers: {
          Authorization: this.getSessionToken,
        },
      }
    );

    return res.data;
  }

  async editCategory(id: string, payload: Partial<ICategory>) {
    const res = await api.patch(`/edit-category/${id}/`, payload, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async deleteCategory(id: string) {
    const res = await api.delete(`/delete-category/${id}`, {
      headers: { Authorization: this.getSessionToken },
    });
    return res.data;
  }

  async calculateProductsPrice(
    cartItems: { productId: string; color?: string; size?: string }[],
    couponCode?: string
  ) {
    const res: {
      data: apiResponse<{
        totalAmount: number;
        discountedAmount: number;
        discountPercentage: number;
      }>;
    } = await api.post(`/calculate-products-price/`, { cartItems, couponCode });

    return res.data;
  }

  async getCategories(storeId: string) {
    const res: { data: apiResponse<ICategory[]> } = await api.get(
      `/get-categories/${storeId}/`
    );

    return res.data;
  }

  async getIntegrations() {
    const res: {
      data: apiResponse<{ storeId: string; integration: IIntegrationType }[]>;
    } = await api.get("/get-integrations/", {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async connectAndDisconnectIntegrations(integrationId: string) {
    const res: { data: apiResponse } = await api.post(
      "/connect-and-disconnect-integration/",
      { integrationId },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async manageIntegration(integrationId: string, data: any) {
    const res: { data: apiResponse } = await api.patch(
      "/manage-integration/",
      { integrationId, data },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getIntegration(integrationId: string) {
    const res: {
      data: apiResponse<{
        integration: {
          isConnected: boolean;
          settings:
            | IPaymentIntegration
            | IDeliveryIntegration
            | IChatBotIntegration;
          name: string;
          _id?: string;
        };
      }>;
    } = await api.get(`/get-integrations/${integrationId}`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async getProducts(storeId: string, query?: getProductsTypes) {
    const q = queryString.stringify({ ...query, storeId });
    const res: {
      data: apiResponse<{
        totalProducts: number;
        products: IProduct[];
        filters: {
          priceRange: {
            min: number;
            max: number;
          };
          allColors: IAvailableColors[];
          allSizes: string[];
          ratingsDistribution: Record<number, number>;
        };
        // Optional metrics for authenticated users
        digitalProducts?: number;
        lowStockProducts?: number;
        outOfStockProducts?: number;
      }>;
    } = await api.get(`/get-products/?${q}`, {
      headers: { Authorization: this.getSessionToken },
    });
    return res.data;
  }

  async getProductAnalytics(productId: string) {
    const res: { data: apiResponse<IProductAnalytics> } = await api.get(
      `/get-product-analytics/${productId}/`,
      {
        headers: {
          Authorization: this.getSessionToken,
        },
      }
    );

    return res.data;
  }

  async deleteProduct(productId: string) {
    const res: { data: apiResponse } = await api.delete(
      `/delete-products/${productId}/`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getProduct(productId: string) {
    const res: { data: apiResponse<IProduct> } = await api.get(
      `/get-products/${productId}/`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async createOrder(
    order: Partial<IOrder>,
    storeId?: string,
    couponCode?: string
  ) {
    const res: { data: apiResponse<IOrder> } = await api.post(
      `/create-order/`,
      { order, storeId, couponCode },
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async getOrder<T = any>(orderId: string, storeId?: string) {
    const q = queryString.stringify({ storeId });
    const res: { data: apiResponse<T> } = await api.get(
      `/get-orders/${orderId}/?${q}`,
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async getQuickEmails() {
    const res: { data: apiResponse<{ id: string; label: string }[]> } =
      await api.get("/get-quick-emails/", {
        headers: {
          Authorization: this.getSessionToken,
        },
      });

    return res.data;
  }

  async sendQuickEmail(emailId: string, orderId: string) {
    const res: { data: apiResponse } = await api.post(
      `/send-quick-email/${emailId}/`,
      { orderId },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async editOrder(orderId: string, updates: Partial<IOrder>, partial = false) {
    const res: { data: apiResponse<IOrder> } = await api.patch(
      `/edit-order/${orderId}/`,
      { updates, partial },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getCustomers(search: string, page = 1, limit = 10, sort = "") {
    const q = queryString.stringify({ search, page, limit, sort });

    const res: {
      data: apiResponse<CustomersResponse>;
    } = await api.get(`/get-customers/?${q}`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async getCustomer(email: string) {
    const res: { data: apiResponse<Customer & { orders: IOrder[] }> } =
      await api.get(`/get-customers/${email}/`, {
        headers: { Authorization: this.getSessionToken },
      });
    return res.data;
  }

  async getStore(storeCode?: string) {
    const q = queryString.stringify({ storeCode });
    const res: { data: apiResponse<IStore> } = await api.get(
      `/get-store/?${q}`,
      { headers: { Authorization: this.getSessionToken } }
    );

    this.saveCurrentStoreCodeInCookie = res.data.data.storeCode!;

    return res.data;
  }

  async editStore(updates: Partial<IStore>, partial = false) {
    const res: { data: apiResponse<IStore> } = await api.post(
      `/edit-store/`,
      { updates, partial },
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async getThemes() {
    const res: { data: apiResponse<IStoreTheme[]> } = await api.get(
      `/get-themes/`
    );

    return res.data;
  }

  async getProductReview(storeId: string, productId: string, size = 10) {
    const q = queryString.stringify({ size });
    const res: { data: apiResponse<IProductReview[]> } = await api.get(
      `/get-product-review/${storeId}/${productId}/?${q}`
    );
    return res.data;
  }

  async writeReviewOnProduct(payload: IRating) {
    const res: { data: apiResponse<IRating> } = await api.post(
      "/write-review-on-product/",
      payload
    );

    return res.data;
  }

  async getProductsWithIds(ids: string[]) {
    const q = queryString.stringify({ ids });
    const res: { data: apiResponse<IProduct[]> } = await api.get(
      "/get-products-with-ids/?" + q
    );
    return res.data;
  }

  async createCoupon(payload: ICoupon) {
    const res: { data: apiResponse<ICoupon> } = await api.post(
      `/create-coupon/`,
      payload,
      {
        headers: { Authorization: this.getSessionToken },
      }
    );
    return res.data;
  }

  async getCoupons(size = 20) {
    const q = queryString.stringify({ size });
    const res: { data: apiResponse<ICoupon[]> } = await api.get(
      `/get-coupons/?${q}`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async deleteCoupon(couponId: string) {
    const res: { data: apiResponse } = await api.delete(
      `/delete-coupon/${couponId}/`,
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async calculateDeliveryCost(storeId: string, payload: IDeliveryCostPayload) {
    const res: { data: apiResponse<ShipmentResponse> } = await api.post(
      `/calculate-delivery-cost/${storeId}/`,
      payload
    );
    return res.data;
  }

  async getStoreAddresses() {
    const res: {
      data: apiResponse<(ICustomerAddress & { isDefault: boolean })[]>;
    } = await api.get(`/get-store-addresses/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async addOrEditStoreAddress(address: ICustomerAddress) {
    const res: { data: apiResponse } = await api.post(
      `/add-or-edit-store-address/`,
      { address },
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async deleteStoreAddress(addressId: string) {
    const res: { data: apiResponse } = await api.delete(
      `/delete-store-address/${addressId}/`,
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async getCoupon(couponCode: string) {
    const res: { data: apiResponse<ICoupon> } = await api.get(
      `/get-coupons/${couponCode}/`
    );
    return res.data;
  }

  async completeOrderPayment(orderId: string, storeId?: string) {
    const res: { data: apiResponse<IOrder> } = await api.post(
      `/complete-payment/${orderId}/`,
      { storeId }
    );
    return res.data;
  }

  async editDeliveryAddress(
    orderId: string,
    storeId: string,
    address: ICustomerAddress
  ) {
    const res: { data: apiResponse<IOrder> } = await api.patch(
      `/edit-delivery-address/${orderId}/`,
      { storeId, address }
    );

    return res.data;
  }

  async requestCancelOrder(orderId: string, storeId: string) {
    const q = queryString.stringify({ storeId });
    const res: { data: apiResponse } = await api.get(
      `/request-cancel-order/${orderId}/?${q}`
    );
    return res.data;
  }

  async requestConfirmationOrder(orderId: string, storeId: string) {
    const q = queryString.stringify({ storeId });
    const res: { data: apiResponse } = await api.get(
      `/request-confirmation-order/${orderId}/?${q}`
    );

    return res.data;
  }

  async initializeChargeForSubscription(autoRenew = true, months = 1) {
    const res: { data: apiResponse<chargeResponse> } = await api.post(
      `initialize-charge-for-subscription`,
      {
        autoRenew,
        months,
      },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getSalesChartData() {
    const res: { data: apiResponse<{ month: string; sale: number }[]> } =
      await api.get(`/get-sales-chart-data/`, {
        headers: { Authorization: this.getSessionToken },
      });
    return res.data;
  }

  async getOrderMetrics() {
    const res: {
      data: apiResponse<{
        totalOrders: number;
        deliveredOverTime: number;
        returns: number;
        avgOrderValue: number;
        totalOrderAmount: number;
      }>;
    } = await api.get(`/get-order-metrics/`, {
      headers: {
        Authorization: this.getSessionToken,
      },
    });

    return res.data;
  }

  async createDeliveryPickup(
    orderId: string,
    type: string,
    estimatedDeliveryDate?: string
  ) {
    const res: { data: apiResponse } = await api.post(
      `/create-delivery-pickup/${orderId}`,
      { type, estimatedDeliveryDate },
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async getCustomersStats() {
    const res: { data: apiResponse<{ customerStats: ICustomerStats[] }> } =
      await api.get(`/get-customers-stats/`, {
        headers: { Authorization: this.getSessionToken },
      });
    return res.data;
  }
}

export const formatDate = (
  date: string,
  day: "numeric" | "2-digit" = "numeric",
  year: "numeric" | "2-digit" = "numeric"
) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day,
    year,
  });
};

export const getProductPrice = (product: IProduct, size: string) => {
  let price: number | undefined = 0;

  if (!size) {
    price = product.discount || product.price.default;
  } else {
    price = product.price.sizes.find((s) => s[size])?.[size];
  }

  return price || 0;
};

export function generateTailwindClasses(primaryColor: string) {
  // Define the color variants based on Tailwind's naming convention
  const classes = {
    bg: {
      default: `bg-[${primaryColor}]`,
      light: `bg-[${primaryColor}]`,
      dark: `bg-[${primaryColor}]`,
      darker: `bg-[${primaryColor}]`,
      lightest: `bg-[${primaryColor}]`,
    },
    text: {
      default: `text-[${primaryColor}]`,
      dark: `text-[${primaryColor}]`, // Adjust if necessary
    },
  };

  return classes;
}

export const doesAllCategoriesHasImage = (categories: ICategory[]) => {
  if (!categories.length) return false;

  return categories.every((category) => Boolean(category.img));
};

export const allProductsAreDigital = (products: IProduct[] = []) =>
  products.every((product) => product?.isDigital);

export const sumUpValues = <T = any[]>(data: T, key: string) => {
  // @ts-ignore
  return data?.reduce((acc, curr) => acc + curr[key], 0);
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const q = queryString.stringify({
    key: import.meta.env.VITE_IBB_API_KEY,
  });

  const res: { data: { data: { display_url: string } } } = await axios.post(
    `https://api.imgbb.com/1/upload?${q}`,
    formData
  );

  return res.data;
};

export function generateRandomString(length = 7): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const isPathMatching = (
  page: string,
  options?: { level: number; pageLevel: number }
) => {
  const { level = 1, pageLevel = 1 } = options || {};

  const path = location.pathname.split("/");
  const _page = page.split("/")[pageLevel];

  const _isCurrentPage = path[level]?.toLowerCase() === _page?.toLowerCase();

  return _isCurrentPage;
};

export function addQueryParameter(key: string, value: string, url?: string) {
  const query = url?.split("?");
  const location = window.location;

  // Parse existing query parameters
  const queryObject = qs.parse(query?.[1] || location.search);

  // Add or update the new query parameter
  queryObject[key] = value;

  // Rebuild the query string with the updated parameters
  const updatedQuery = qs.stringify(queryObject);

  // Return the full URL with the new query string
  return updatedQuery;
}

export const getInitials = (name: string = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast({
    description: `${label} copied to clipboard`,
  });
};

export const getCallbackUrl = () => {
  const callbackUrl = queryString.parse(location.search) as {
    callbackUrl: string | null;
  };
  return callbackUrl.callbackUrl;
};

export const addEllipseToText = (text: string, num = 10) => {
  return text.slice(0, num) + "...";
};

export const getOrderProductCount = (
  products: IProduct[],
  productId: string
) => {
  return products.reduce((acc, curr) => {
    if (curr?._id === productId) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

export function formatAmountToNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const storeBuilder = new StoreBuild();
