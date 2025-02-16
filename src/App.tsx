import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AppLayOut } from "./components/app-layout";
import LandingPage from "./pages/landing-page";
import { ThemeProvider } from "./components/theme-provider";
import NProgress from "nprogress";
import { useEffect } from "react";
import "nprogress/nprogress.css";
import { PATHS } from "./types";
import SignUp from "./pages/auth/signUp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignIn from "./pages/auth/signIn";
import DashboardProvider from "./components/dashboard-provider";
import Dashboard from "./pages/admin/dashboard";
import DashboardProducts from "./pages/admin/dashboard-products";
import DashboardOrders from "./pages/admin/dashboard-order";
import DashboardOrderDetails from "./pages/admin/dashboard-order-details";
import DashboardCustomers from "./pages/admin/dashboard-customers";
import DashboardStoreFront from "./pages/admin/dashboard-store-front";
import DashboardIntegrations from "./pages/admin/dashboard-integrations";
import DashboardCreateNewProduct from "./pages/admin/dashboard-create-new-product";
import DashboardCreateOrder from "./pages/admin/dashboard-create-order";
import PreviewStore from "./pages/preview-store";
import StoreProvider from "./store/store-provider";
import StoreProducts from "./store/store-products";
import StoreProductsDetails from "./store/store-products-details";
import DashboardCoupon from "./pages/admin/dashboard-coupon";
import StoreTrackOrder from "./store/store-track-order";
import OrderTracking from "./components/order-detail";
import StoreOrderDetail from "./store/store-order-detail";

NProgress.configure({ showSpinner: false });

const ProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    // Start the progress bar when location changes
    NProgress.start();

    // Stop the progress bar once the page has rendered
    NProgress.done();

    // Cleanup to ensure it resets between navigations
    return () => {
      NProgress.done();
    };
  }, [location]);

  return null;
};

function App() {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ProgressBar />
          <AppLayOut>
            <Routes>
              <Route path={PATHS.HOME} element={<LandingPage />} />
              <Route path={PATHS.SIGNUP} element={<SignUp />} />
              <Route path={PATHS.SIGNIN} element={<SignIn />} />

              <Route
                path={PATHS.DASHBOARD}
                element={
                  <DashboardProvider>
                    <Dashboard />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_PRODUCTS}
                element={
                  <DashboardProvider>
                    <DashboardProducts />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_CUSTOMERS}
                element={
                  <DashboardProvider>
                    <DashboardCustomers />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_ORDERS}
                element={
                  <DashboardProvider>
                    <DashboardOrders />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_ORDERS + ":id"}
                element={
                  <DashboardProvider>
                    <DashboardOrderDetails />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_FRONT}
                element={
                  <DashboardProvider>
                    <DashboardStoreFront />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_INTEGRATIONS}
                element={
                  <DashboardProvider>
                    <DashboardIntegrations />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_PRODUCTS + ":id"}
                element={
                  <DashboardProvider>
                    <DashboardCreateNewProduct />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_ORDERS + ":id" + "/create/"}
                element={
                  <DashboardProvider>
                    <DashboardCreateOrder />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE_COUPON}
                element={
                  <DashboardProvider>
                    <DashboardCoupon />
                  </DashboardProvider>
                }
              />
              <Route
                path={PATHS.STORE + ":storeCode"}
                element={
                  <StoreProvider>
                    <PreviewStore />
                  </StoreProvider>
                }
              />
              <Route
                path={PATHS.STORE + ":storeCode" + "/products/"}
                element={
                  <StoreProvider>
                    <StoreProducts />
                  </StoreProvider>
                }
              />
              <Route
                path={PATHS.STORE + ":storeCode" + "/products/" + ":productId"}
                element={
                  <StoreProvider>
                    <StoreProductsDetails />
                  </StoreProvider>
                }
              />
              <Route
                path={PATHS.STORE + ":storeCode" + "/track-order/"}
                element={
                  <StoreProvider>
                    <StoreTrackOrder />
                  </StoreProvider>
                }
              />
              <Route
                path={PATHS.STORE + ":storeCode" + "/track-order/" + ":orderId"}
                element={
                  <StoreProvider>
                    <StoreOrderDetail />
                  </StoreProvider>
                }
              />
            </Routes>
          </AppLayOut>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
