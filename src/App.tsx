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
import { DashboardCustomers } from "./pages/admin/dashboard-customers";

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
            </Routes>
          </AppLayOut>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
