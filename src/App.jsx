import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AppHeader from "./components/Layout/Header";
import { CartProvider } from "./hooks/useCart";
import React from "react";
import { Spin } from "antd";

const Home = React.lazy(() => import("./pages/HomePage"));
const Product = React.lazy(() => import("./pages/ProductPage"));
const Cart = React.lazy(() => import("./pages/CartPage"));

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppHeader />
        <React.Suspense fallback={<Spin style={{position:'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} size="large" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </React.Suspense>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
