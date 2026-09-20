import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/web/Home';
import Shops from './pages/web/Shops';
import ShopDetail from './pages/web/ShopDetail';
import Products from './pages/web/Products';
import Service from './pages/web/Community';
import CategoriesPage from './pages/admins/CategoriesPage';
import Learn from './pages/web/Learn';
import Profile from './pages/web/Profile';
import Cart from './pages/web/Cart';
import Wishlist from './pages/web/Wishlist';
import Login from './pages/admins/auth/Login';
import ModernCardLogin from './pages/admins/auth/adminLogin';
import HorizontalGlassLogin from './pages/admins/auth/HorizontalGlassLogin';
import MinimalistFloatingLogin from './pages/admins/auth/MinimalistFloatingLogin';
import GradientGlassLogin from './pages/admins/auth/ModernGradientGlassLogin';
import AdminDashboardRouter from './pages/admins/AdminDashboardRouter';
import AdminProducts from './pages/admins/AdminProducts';
import AdminUsers from './pages/admins/AdminUsers';
import CustomersManagement from './pages/admins/CustomersManagement';
import OrdersManagement from './pages/admins/OrdersManagement';
import SalesAnalytics from './pages/admins/SalesAnalytics';
import RevenueAnalytics from './pages/admins/RevenueAnalytics';
import CustomerAnalytics from './pages/admins/CustomerAnalytics';
import SalesReport from './pages/admins/SalesReport';
import InventoryReport from './pages/admins/InventoryReport';
import SystemSettings from './pages/admins/SystemSettings';
import UserManagement from './pages/admins/UserManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Applies the admin Theme Customizer (dark mode, color presets, fonts) via
// antd's ConfigProvider. Scoped to the admin route tree only, so the
// customer-facing website always renders with antd's plain default theme
// and never inherits an admin's dark mode or custom styling choices.
const AdminThemeWrapper = ({ children }) => {
  const { currentTheme } = useTheme();
  return (
    <ConfigProvider theme={currentTheme}>
      {children}
    </ConfigProvider>
  );
};

const ThemedAdminLayout = () => (
  <ThemeProvider>
    <AdminThemeWrapper>
      <AdminLayout />
    </AdminThemeWrapper>
  </ThemeProvider>
);

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="sourcing" element={<Navigate to="/products" replace />} />
        <Route path="shop" element={<Shops />} />
        <Route path="shop/:shopId" element={<ShopDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="service" element={<Service />} />
        <Route path="community" element={<Navigate to="/service" replace />} />
        <Route path="learn" element={<Learn />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      </Route>
      
      <Route path="/login" element={<Login />} />
      <Route path="/admins/login" element={<ModernCardLogin />} />
      <Route path="/admins/HorizontalGlassLogin" element={<HorizontalGlassLogin />} />
      <Route path="/admins/MinimalistFloatingLogin" element={<MinimalistFloatingLogin />} />
      <Route path="/admins/GradientGlassLogin" element={<GradientGlassLogin />} />
      
      {/* Admin Routes */}
      <Route path="/admins/" element={<ThemedAdminLayout />}>
        <Route index element={<AdminDashboardRouter />} />
        <Route path="dashboard" element={<AdminDashboardRouter />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="customers" element={<CustomersManagement />} />
        <Route path="orders" element={<OrdersManagement />} />
        <Route path="analytics/sales" element={<SalesAnalytics />} />
        <Route path="analytics/revenue" element={<RevenueAnalytics />} />
        <Route path="analytics/customers" element={<CustomerAnalytics />} />
        <Route path="reports/sales" element={<SalesReport />} />
        <Route path="reports/inventory" element={<InventoryReport />} />
        <Route path="settings/categories" element={<CategoriesPage />} />
        <Route path="settings/users" element={<UserManagement />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <WishlistProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </WishlistProvider>
  </AuthProvider>
);

export default App;