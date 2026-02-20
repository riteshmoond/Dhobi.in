import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/useAuth";

// Shared Components
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AdminRoute from "./components/admin/AdminRoute";

// Auth Pages
import UnifiedAuth from "./pages/auth/UnifiedAuth";

// Admin Pages
import AdminPanel from "./pages/admin/AdminPanel";

// User Pages
import Home from "./pages/user/Home";
import Male from "./pages/user/Male";
import Female from "./pages/user/Female";
import Kids from "./pages/user/Kids";
import About from "./pages/user/About";
import Contact from "./pages/user/Contact";
import Addtocard from "./pages/user/Addtocard";
import Checkout from "./pages/user/Checkout";
import OrderSuccess from "./pages/user/OrderSuccess";
import MyOrders from "./pages/user/MyOrders";
import OrderTracking from "./pages/user/OrderTracking";
import Rate from "./pages/user/Rate";

// Utils & Libraries
import {
  loadServicesFromStorage,
  splitServicesByCategory,
} from "./lib/servicesStore";
import {
  defaultAdminSettings,
  loadAdminSettings,
  normalizeSettings,
} from "./lib/adminSettings";
import { getServicesApi, getSettingsApi } from "./lib/backendApi";

const CART_STORAGE_KEY = "dobhivala_cart_v2";

const App = () => {
  const { isUserLoggedIn, isAdminLoggedIn, loading } = useAuth();
  const location = useLocation();
  const [cart, setCart] = useState({});
  const [allServices, setAllServices] = useState([]);
  const [adminSettings, setAdminSettings] = useState(defaultAdminSettings);

  const hideChromeOnPaths = ["/auth", "/login"];
  const shouldShowLayoutChrome =
    (isUserLoggedIn || isAdminLoggedIn) &&
    !loading &&
    !hideChromeOnPaths.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    const loadInitialData = async () => {
      const [servicesResult, settingsResult] = await Promise.all([
        getServicesApi(),
        getSettingsApi(),
      ]);

      if (servicesResult.success && Array.isArray(servicesResult.data?.services)) {
        setAllServices(servicesResult.data.services);
      } else {
        setAllServices(loadServicesFromStorage());
      }

      if (settingsResult.success && settingsResult.data?.settings) {
        setAdminSettings(normalizeSettings(settingsResult.data.settings));
      } else {
        setAdminSettings(loadAdminSettings());
      }
    };

    loadInitialData();
  }, []);

  const servicesByCategory = useMemo(
    () => splitServicesByCategory(allServices),
    [allServices]
  );

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = allServices.find((s) => String(s.id) === String(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleClearCart = () => setCart({});
    const handleServicesUpdate = async () => {
      const result = await getServicesApi();
      if (result.success && Array.isArray(result.data?.services)) {
        setAllServices(result.data.services);
        return;
      }
      setAllServices(loadServicesFromStorage());
    };
    const handleSettingsUpdate = async () => {
      const result = await getSettingsApi();
      if (result.success && result.data?.settings) {
        setAdminSettings(normalizeSettings(result.data.settings));
        return;
      }
      setAdminSettings(loadAdminSettings());
    };
    window.addEventListener("dobhivala:cart:clear", handleClearCart);
    window.addEventListener("dobhivala:services:updated", handleServicesUpdate);
    window.addEventListener("dobhivala:settings:updated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("dobhivala:cart:clear", handleClearCart);
      window.removeEventListener("dobhivala:services:updated", handleServicesUpdate);
      window.removeEventListener("dobhivala:settings:updated", handleSettingsUpdate);
    };
  }, []);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      if (prev[id] - 1 <= 0) delete next[id];
      else next[id] = prev[id] - 1;
      return next;
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Header and Footer only when logged in */}
      {shouldShowLayoutChrome && (
        <Header
          totalItems={totalItems}
          subtotal={subtotal}
          categoryVisibility={adminSettings.categoryVisibility}
          branding={{
            brandName: adminSettings.brandName,
            logoUrl: adminSettings.logoUrl,
          }}
        />
      )}

      <main className="flex-1">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          </div>
        ) : (
          <Routes>
          {/* Auth Route */}
          <Route
            path="/auth"
            element={
              isAdminLoggedIn ? (
                <Navigate to="/admin" replace />
              ) : isUserLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <UnifiedAuth />
              )
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/"
            element={
              isUserLoggedIn ? (
                <Home
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  categoryVisibility={adminSettings.categoryVisibility}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/addtocard"
            element={
              isUserLoggedIn ? (
                <Addtocard
                  cart={cart}
                  allServices={allServices}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  totalItems={totalItems}
                  subtotal={subtotal}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/male"
            element={
              isUserLoggedIn ? (
                <Male
                  services={
                    adminSettings.categoryVisibility?.men !== false
                      ? servicesByCategory.men
                      : []
                  }
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  totalItems={totalItems}
                  subtotal={subtotal}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/female"
            element={
              isUserLoggedIn ? (
                <Female
                  services={
                    adminSettings.categoryVisibility?.female !== false
                      ? servicesByCategory.female
                      : []
                  }
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  totalItems={totalItems}
                  subtotal={subtotal}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/kids"
            element={
              isUserLoggedIn ? (
                <Kids
                  services={
                    adminSettings.categoryVisibility?.kids !== false
                      ? servicesByCategory.kids
                      : []
                  }
                  cart={cart}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  totalItems={totalItems}
                  subtotal={subtotal}
                />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          <Route
            path="/about"
            element={
              isUserLoggedIn ? <About /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/contact"
            element={
              isUserLoggedIn ? <Contact /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/checkout"
            element={
              isUserLoggedIn ? <Checkout /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/order-success"
            element={
              isUserLoggedIn ? <OrderSuccess /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/orders"
            element={
              isUserLoggedIn ? <MyOrders /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/track-order/:id"
            element={
              isUserLoggedIn ? <OrderTracking /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/rate"
            element={
              isUserLoggedIn ? <Rate /> : <Navigate to="/auth" replace />
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Catch all - redirect to auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        )}
      </main>

      {/* Footer */}
      {shouldShowLayoutChrome && (
        <Footer
          branding={{
            brandName: adminSettings.brandName,
          }}
          contact={{
            supportPhone: adminSettings.supportPhone,
            supportEmail: adminSettings.supportEmail,
            supportAddress: adminSettings.supportAddress,
          }}
        />
      )}
    </div>
  );
};

export default App;
