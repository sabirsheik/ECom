{
  /* Start Project Date Sunday 21 April 2025 */
}

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./Pages/Home";
import { Toaster } from "sonner";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CollectionPage from "./Pages/CollectionPage";
import ProductDetails from "./components/Products/ProductDetails";
import Checkout from "./components/Products/Checkout";
import OrderConfirmationPage from "./Pages/OrderConfirmationPage";
import OrderDetailsPage from "./Pages/OrderDetailsPage";
import MyOrderPages from "./Pages/MyOrderPages";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./Pages/Admin-Pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import OrderManagement from "./components/Admin/OrderManagement";
import EditProductPage from "./components/Admin/EditProductPage";

import {Provider} from "react-redux";
import {store} from "./redux/store";
import { fetchUserProfile } from "./redux/slices/authSlices";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const RouteTransition = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition">
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/collections" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
          <Route path="order/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/my-order" element={<ProtectedRoute><MyOrderPages /></ProtectedRoute>} />
        </Route>
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </div>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return (
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ className: "store-toast" }} />
        <RouteTransition />
      </BrowserRouter>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
