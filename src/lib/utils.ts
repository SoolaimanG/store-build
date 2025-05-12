import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import {
  aiChatResponse,
  apiResponse,
  chargeResponse,
  Customer,
  CustomersResponse,
  FlutterwaveResponse,
  FlutterwaveVirtualAccountResponse,
  getProductsTypes,
  IAvailableColors,
  IBank,
  ICategory,
  IChatBotIntegration,
  ICheckFor,
  ICoupon,
  ICustomerAddress,
  ICustomerStats,
  IDashboardMetrics,
  IDedicatedAccount,
  IDeliveryCostPayload,
  IDeliveryIntegration,
  IIntegration,
  IIntegrationType,
  IJoinNewsLetterFrom,
  Invoice,
  IOrder,
  IOrderStatus,
  IOTPFor,
  IPaymentFor,
  IPaymentIntegration,
  IProduct,
  IProductAnalytics,
  IProductReview,
  IProductTypes,
  IRating,
  IStore,
  IStoreBankAccounts,
  IStoreTheme,
  ITransaction,
  ITutorial,
  IUser,
  PATHS,
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
  referralPrice: 100,
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API + "/api/v1",
});

export const errorMessageAndStatus = (error: any) => {
  const message = error?.response?.data?.message || "Something went wrong";
  const status = error?.response?.data?.status?.toUpperCase();
  const data = error?.response?.data?.data;
  const code = error?.response?.data?.code;

  return { message, status, data, code };
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
          name: string;
          slug: string;
          code: string;
          longcode: string;
          gateway: null;
          pay_with_bank: boolean;
          active: boolean;
          is_deleted: boolean;
          country: "Nigeria";
          currency: "NGN";
          type: string;
          id: number;
          createdAt: string;
          updatedAt: string;
        }[]
      >;
    } = await api.get(`/get-banks/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async verifyAccountNumber(bankCode: string, accountNumber: string) {
    const q = queryString.stringify({ bankCode, accountNumber });
    const res = await api.get<
      apiResponse<{
        account_number: string;
        account_name: string;
        bank_id: number;
      }>
    >(`/verify-account-number/?${q}`, {
      headers: { Authorization: this.getSessionToken },
    });

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
    asc = false,
    filter: IOrderStatus | "All" = "All",
    startDate?: string,
    endDate?: string,
    sort?: string,
    page?: number,
    limit?: number
  ) {
    const _q = queryString.stringify({
      q,
      asc,
      filter,
      startDate,
      endDate,
      sort,
      page,
      limit,
    });

    const res: {
      data: apiResponse<{
        orders: IOrder[];
        orderStatusCount: Record<string, number>;
        pagination: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>;
    } = await api.get(`/get-orders/?${_q}`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async signOut() {
    this.removeSessionToken();
    window.location.replace(PATHS.SIGNIN);
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
        hasApiKeys?: boolean;
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
    const res = await api.get<apiResponse<IProduct>>(
      `/get-products/${productId}/`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async createOrder(
    order: Partial<IOrder>,
    storeId?: string,
    couponCode?: string,
    paymentOption?: "flutterwave" | "manual"
  ) {
    const res: { data: apiResponse<IOrder> } = await api.post(
      `/create-order/`,
      { order, storeId, couponCode, paymentOption },
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async getOrder<T = any>(orderId: string, phoneNumber?: string) {
    const q = queryString.stringify({ phoneNumber });
    const res: { data: apiResponse<T> } = await api.get(
      `/get-orders/${orderId}/?${q}`
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

  async sendQuickEmail(emailId: string, orderId: string, phoneNumber: string) {
    const res: { data: apiResponse } = await api.post(
      `/send-quick-email/${emailId}/`,
      { orderId, phoneNumber },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async editOrder(
    orderId: string,
    updates: Partial<IOrder>,
    phoneNumber?: string
  ) {
    const res: { data: apiResponse<IOrder> } = await api.patch(
      `/edit-order/${orderId}/`,
      { updates, phoneNumber },
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

  async requestCancelOrder(
    orderId: string,
    payload: { storeId: string; phoneNumber: string; reason?: string }
  ) {
    const q = queryString.stringify(payload);
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

  async updateUser(payload: {
    email?: string;
    phoneNumber?: string;
    fullName?: string;
  }) {
    const res: { data: apiResponse<IUser> } = await api.patch(
      `/update-user/`,
      payload,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getReferrals() {
    const res: {
      data: apiResponse<{
        totalReferrals: number;
        totalEarnings: number;
        referrals: {
          fullName: string;
          joinedAt: string;
          signUpComplete: boolean;
          totalOrders: number;
        }[];
      }>;
    } = await api.get(`/get-referrals/`, {
      headers: {
        Authorization: this.getSessionToken,
      },
    });

    return res.data;
  }

  async getTutorial(videoId: string) {
    const res: { data: apiResponse<ITutorial> } = await api.get(
      `/get-tutorial/${videoId}`,
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async markTutorialAsCompleted(payload: ITutorial | ITutorial[]) {
    const res: { data: apiResponse } = await api.post(
      `/mark-tutorial-as-completed/`,
      Array.isArray(payload) ? payload : [payload],
      {
        headers: {
          Authorization: this.getSessionToken,
        },
      }
    );

    return res.data;
  }

  async watchTutorial() {
    const res: { data: apiResponse<number | undefined | null> } =
      await api.post(`/watch-tutorial/`, undefined, {
        headers: { Authorization: this.getSessionToken },
      });
    return res.data;
  }

  async hasFinishedTutorialVideos() {
    const res: { data: apiResponse<boolean> } = await api.get(
      `/has-finished-tutorial-videos/`,
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  async exportCustomersData(
    type: "excel" | "json",
    date: { from?: string; to?: string }
  ) {
    return await api.post(
      `/export-customers-data/`,
      { type, ...date },
      { headers: { Authorization: this.getSessionToken }, responseType: "blob" }
    );
  }

  async customerHelper(prompt: string, storeId: string, sessionId: string) {
    const res: { data: apiResponse<string> } = await api.post(
      `/customer-ai-chat/${storeId}/`,
      { prompt, sessionId }
    );

    return res.data;
  }

  async getAiConversation(
    userId?: string,
    storeId?: string,
    sessionId?: string
  ) {
    const q = queryString.stringify({ userId, storeId, sessionId });
    const res: { data: apiResponse<aiChatResponse[]> } = await api.get(
      `/get-ai-conversation/?${q}`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async aiStoreAssistant(query: string, sessionId?: string) {
    const res = await api.post(
      `/ai-store-assistant/`,
      { query, sessionId },
      { headers: { Authorization: this.getSessionToken } }
    );
    return res.data;
  }

  get generateSessionId() {
    const now = new Date();
    const aiSessionId = Cookie.get("ai-session-id");

    if (!aiSessionId) {
      now.setMinutes(now.getMinutes() + 20);
      const randomToken = generateRandomString(20);
      Cookie.set("ai-session-id", randomToken, {
        expires: now,
      });

      return randomToken;
    }

    return aiSessionId;
  }

  async subscribeToChatBot() {
    const res: { data: apiResponse } = await api.post(
      "/subcribe-to-chat-bot/",
      undefined,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getOnboardingFlows() {
    const res: {
      data: apiResponse<{
        isEmailVerified: boolean;
        phoneNumber: string;
        hasProduct: boolean;
        addPaymentMethod: boolean;
        tutorialVideoWatch: boolean;
      }>;
    } = await api.get(`/get-onboarding-flow/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async getStoreBank(storeCode: string, getDefault = false, size = 5) {
    const q = queryString.stringify({ getDefault, storeCode, size });

    const res = await api.get<apiResponse<IStoreBankAccounts[]>>(
      `/get-store-bank/?${q}`,
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async getInvoice(id: string) {
    const res = await api.get<apiResponse<Invoice>>(`/get-invoice/${id}/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async payWithBankTransfer(
    id: string,
    paymentFor: "order" | "store-build-ai" | "subscription"
  ) {
    const res = await api.post<apiResponse<FlutterwaveVirtualAccountResponse>>(
      `/pay-with-bank-account/`,
      {
        id,
        paymentFor,
      }
    );

    return res.data;
  }

  async addsendBoxApiKey(accessKey: string) {
    const res = await api.post<apiResponse<IIntegration>>(
      `/add-send-box-api-key/`,
      { accessKey },
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async deleteSendBoxApiKey() {
    const res = await api.delete<apiResponse>(`/delete-send-box-api-keys/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async payWithFlutterwave(orderId: string, paymentFor: IPaymentFor = "order") {
    const res = await api.post<apiResponse<FlutterwaveResponse>>(
      `/pay-with-flutterwave/${orderId}`,
      { paymentFor },
      {
        headers: {
          Authorization: this.getSessionToken,
        },
      }
    );

    return res.data;
  }

  async listBank() {
    const res = await api.get<apiResponse<IBank[]>>(`/get-banks/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data.data;
  }

  async addBankAccount(
    accountNumber: string,
    nin: string,
    bankCode: string,
    bankName: string
  ) {
    const res = await api.post<apiResponse>(
      `/add-bank-account/`,
      { accountNumber, nin, bankCode, bankName },
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getProductsDrafts() {
    const res = await api.get<apiResponse<IProduct[]>>(
      `/get-products-drafts/`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data.data;
  }

  async getDedicatedAccount() {
    const res = await api.get<apiResponse<IDedicatedAccount>>(
      `/get-dedicated-account/`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data.data;
  }

  async createDedicatedAccount() {
    const res = await api.post<apiResponse>(
      `/create-dedicated-account/`,
      undefined,
      {
        headers: { Authorization: this.getSessionToken },
      }
    );

    return res.data;
  }

  async createCharge(payload: {
    id?: string;
    paymentFor: IPaymentFor;
    paymentOption: "virtualAccount" | "card" | "balance";
    storeCode?: string;
    meta?: any;
  }) {
    interface IRes {
      email: string;
      name: string;
      amount: number;
      phoneNumber: string;
      paymentChannel: string;
      paymentLink: string;
      virtualAccount?: FlutterwaveVirtualAccountResponse;
    }

    const res = await api.post<apiResponse<IRes>>(`/create-charge/`, payload, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async validatePayment(
    status: string,
    tx_ref: string,
    transaction_id?: string,
    storeId?: string
  ) {
    const q = queryString.stringify({
      status,
      tx_ref,
      transaction_id,
      storeId,
    });

    const res = await api.get<apiResponse>(
      `/validate-flutter-wave-payment/?${q}`
    );

    return res.data;
  }

  async requestWithdraw(payload: {
    amount: number;
    accountId: string;
    otp: string;
  }) {
    const res = await api.post<apiResponse>(`/request-withdraw/`, payload, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }

  async getInternalTransactions(payload?: { size?: number; skip?: number }) {
    interface IRes {
      transactions: ITransaction[];
      totalTransactions: number;
    }

    const q = queryString.stringify({
      ...payload,
    });
    const res = await api.get<apiResponse<IRes>>(
      `/get-internal-transaction/?${q}`,
      { headers: { Authorization: this.getSessionToken } }
    );

    return res.data;
  }

  async getAiSuggestion() {
    interface IRes {
      title: string;
      description: string;
      action: String;
    }

    const res = await api.get<apiResponse<IRes[]>>(`/get-ai-suggestion/`, {
      headers: { Authorization: this.getSessionToken },
    });

    return res.data;
  }
}

export function generateWhatsAppOrderMessage({
  phone,
  itemDetails,
  customerName,
  deliveryMethod,
  totalPrice,
  orderLink,
  paymentOptions,
  orderId,
}: {
  phone: string;
  itemDetails: string;
  customerName: string;
  deliveryMethod: string;
  totalPrice: string;
  orderLink: string;
  paymentOptions: {
    bankAccount: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    };
  };
  orderId: string;
}): string {
  const message = `
Hi, I'll like to buy these items:

📦 ${itemDetails}

🙇🏽‍♂️ Customer: ${customerName}

*Delivery Method:* ${deliveryMethod}

💰 Total Price: *${totalPrice}*

🛍️ Click here to update the order or make payments:
${orderLink}

-----------------------------------
*FOR PAYMENTS*

*OPTION 1:* Use the link attached to this order 🔗
Payments made via the link are automatically confirmed.

*OPTION 2:* Transfer to this bank account 🏦
Acc Num: ${paymentOptions.bankAccount.accountNumber}
Bank: ${paymentOptions.bankAccount.bankName}
Acc Name: ${paymentOptions.bankAccount.accountName}
-----------------------------------

Order ID: *${orderId}*
  `;

  const encodedMessage = encodeURIComponent(message.trim());
  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}`;
}

export const goToWhatsapp = (phoneNumber: string, message: string) => {
  const encodedMessage = encodeURIComponent(message.trim());
  const link = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}`;
  window.open(link, "_blank");
};

export function formatTextToHTML(text: string) {
  // Split the text by the numbered list
  const lines = text.split(/\d+\.\s+/).filter(Boolean);

  // Build the HTML content
  const html = `
    <div class="ai-response">
      <h2>Here's a list of things I can do for you:</h2>
      <ul>
        ${lines
          .map((line) => {
            const [title, ...rest] = line.split(":");
            const description = rest.join(":").trim();
            return `
              <li>
                <strong>${title.trim()}:</strong> ${description}
              </li>
            `;
          })
          .join("")}
      </ul>
    </div>
  `;

  return html.trim();
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
  return {
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
}

export const doesAllCategoriesHasImage = (categories: ICategory[]) => {
  if (!categories.length) {
    return false;
  }

  return categories.every((category) => Boolean(category.img));
};

export const allProductsAreDigital = (products: IProduct[] = []) => {
  return products.every((product) => product?.isDigital);
};

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

  return path[level]?.toLowerCase() === _page?.toLowerCase();
};

export function addQueryParameter(key: string, value: string, url?: string) {
  const query = url?.split("?");
  const { location } = window;

  // Parse existing query parameters
  const queryObject = qs.parse(query?.[1] || location.search);

  // Add or update the new query parameter
  queryObject[key] = value;

  // Return the full URL with the new query string
  return qs.stringify(queryObject);
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

export function formatAmountToNaira(amount: number, mfd = 2) {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(mfd)}m`;
  } else if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(mfd)}k`;
  } else {
    return new Intl.NumberFormat("en-NG", {
      currency: "NGN",
      style: "currency",
      minimumFractionDigits: mfd,
    }).format(amount);
  }
}

export const storeBuilder = new StoreBuild();
