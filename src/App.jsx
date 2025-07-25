import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import AppHeader from "./components/Layout/Header";
import { CartProvider } from "./hooks/useCart";
import ErrorBoundary from "./components/Layout/ErrorBoundary";
import LoadingSpinner from "./components/Layout/LoadingSpinner";
import React, { Suspense } from "react";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductPage = React.lazy(() => import("./pages/ProductPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));

// Ant Design theme configuration
const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    colorBgContainer: '#ffffff',
  },
  components: {
    Layout: {
      headerBg: '#001529',
      headerHeight: 80,
    },
    Card: {
      borderRadiusLG: 8,
    },
    Button: {
      borderRadiusLG: 6,
    },
  },
};

/**
 * Enhanced App component with better error handling, theming, and performance
 */
function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>
        <BrowserRouter>
          <ErrorBoundary>
            <CartProvider>
              <div className="app">
                <AppHeader />
                <main className="main-content">
                  <Suspense 
                    fallback={
                      <div style={{ position: 'relative', minHeight: '60vh' }}>
                        <LoadingSpinner message="Loading page..." />
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      {/* Fallback route */}
                      <Route path="*" element={<HomePage />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </CartProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
