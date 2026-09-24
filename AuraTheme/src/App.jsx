import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Base Web Layout & Pages
import MainLayout from './layouts/MainLayout';
import Home from './pages/web/Home';
import Shops from './pages/web/Shops';
import ShopDetail from './pages/web/ShopDetail';
import Products from './pages/web/Products';
import Service from './pages/web/Community';
import Learn from './pages/web/Learn';
import Profile from './pages/web/Profile';
import Cart from './pages/web/Cart';
import Wishlist from './pages/web/Wishlist';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import CategoriesPage from './pages/admins/CategoriesPage';
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
import UserManagement from './pages/admins/UserManagement';

// E-Menu Telegram Mini App Layout & Views
import EMenuLayout from './pages/emenu/EMenuLayout';
import EMenuPage from './views/EMenuPage';
import TelegramEntry from './views/TelegramEntry';
import StoreNotFound from './views/StoreNotFound';
import StoreFront from './pages/tma/[store_slug]/page';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Admin Theme Wrapper
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
      {/* 1. Telegram Deep-Link Entry */}
      <Route path="/tg" element={<TelegramEntry />} />

      {/* 2. Isolated Multi-Store E-Menu Routes (No Base Header/Footer) */}
      <Route path="/shop" element={<EMenuLayout />}>
        <Route index element={<TelegramEntry />} />
        <Route path="not-found" element={<StoreNotFound />} />
        <Route path="by-biller/:billerId" element={<EMenuPage />} />
        <Route path=":storeSlug" element={<EMenuPage />} />
      </Route>

      {/* 2b. Telegram Mini App StoreFront Routes */}
      <Route path="/tma" element={<StoreFront />} />
      <Route path="/tma/:storeSlug" element={<StoreFront />} />

      {/* 3. Base Customer-Facing Website Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="sourcing" element={<Navigate to="/products" replace />} />
        <Route path="shops" element={<Shops />} />
        <Route path="shops/:shopId" element={<ShopDetail />} />
        <Route path="products" element={<Products />} />
        <Route path="service" element={<Service />} />
        <Route path="community" element={<Navigate to="/service" replace />} />
        <Route path="learn" element={<Learn />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
      </Route>

      {/* 4. Admin Management Routes */}
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

      {/* 5. Catch-All Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
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