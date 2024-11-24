import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import {
  apiResponse,
  ICheckFor,
  IJoinNewsLetterFrom,
  IOTPFor,
  IProductTypes,
  IUser,
} from "@/types";
import qs from "query-string";
import Cookie from "js-cookie";
import queryString from "query-string";

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

  // Setter for the access token, with a 2-day expiration
  setSessionToken(token: string) {
    const twoDays = 60 * 60 * 24 * 2;
    Cookie.set("access-token", token, { expires: twoDays, sameSite: "strict" });
  }

  removeSessionToken() {
    Cookie.remove("access-token");
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
    referralCode?: string,
    discoveredUsBy?: string
  ) {
    const res: { data: apiResponse<{ user: IUser; token: string }> } =
      await api.post("/sign-up/", {
        email,
        productType,
        referralCode,
        storeName,
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

  async signOut() {
    this.removeSessionToken();
    window.location.reload();
  }
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

export const getCallbackUrl = () => {
  const callbackUrl = queryString.parse(location.search) as {
    callbackUrl: string | null;
  };
  return callbackUrl.callbackUrl;
};

export function formatAmountToNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const storeBuilder = new StoreBuild();
