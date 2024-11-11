import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayOut } from "./components/app-layout";
import LandingPage from "./pages/landing-page";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AppLayOut>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </AppLayOut>
    </ThemeProvider>
  );
}

export default App;
1111;
