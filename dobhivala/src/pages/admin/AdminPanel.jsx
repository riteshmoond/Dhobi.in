import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { normalizeOrdersTracking } from "../../lib/orderTracking";
import { defaultAdminSettings, normalizeSettings } from "../../lib/adminSettings";
import {
  adminUpdateOrderApi,
  createServiceApi,
  deleteServiceApi,
  deleteOrderApi,
  deleteRatingApi,
  getAdminCustomersApi,
  getAdminOrdersApi,
  getAdminRatingsApi,
  getServicesApi,
  getSettingsApi,
  replaceServicesApi,
  updateOrderStatusApi,
  updateSettingsApi,
} from "../../lib/backendApi";

// Import admin components
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminServices from "./AdminServices";
import AdminRatings from "./AdminRatings";
import AdminSettings from "./AdminSettings";
import AdminContacts from "./AdminContacts";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [ratings, setRatings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [settings, setSettings] = useState(defaultAdminSettings);

  const loadOrders = async () => {
    const result = await getAdminOrdersApi();
    if (result.success && Array.isArray(result.data?.orders)) {
      const normalized = normalizeOrdersTracking(result.data.orders);
      setOrders([...normalized].sort((a, b) => Number(b.id) - Number(a.id)));
      return;
    }
    setOrders([]);
  };

  const loadRatings = async () => {
    const result = await getAdminRatingsApi();
    if (result.success && Array.isArray(result.data?.ratings)) {
      setRatings(result.data.ratings);
      return;
    }
    setRatings([]);
  };

  const loadSettings = async () => {
    const result = await getSettingsApi();
    if (result.success && result.data?.settings) {
      setSettings(normalizeSettings(result.data.settings));
      return;
    }
    setSettings(defaultAdminSettings);
  };

  const loadServices = async () => {
    const result = await getServicesApi();
    if (result.success && Array.isArray(result.data?.services)) {
      setServices(result.data.services);
      return;
    }
    setServices([]);
  };

  const loadCustomers = async () => {
    const result = await getAdminCustomersApi();
    if (result.success && Array.isArray(result.data?.customers)) {
      setCustomers(result.data.customers);
      return;
    }
    setCustomers([]);
  };

  useEffect(() => {
    loadServices();
    loadOrders();
    loadRatings();
    loadCustomers();
    loadSettings();
  }, []);

  useEffect(() => {
    if (tab === "customers") {
      loadCustomers();
    }
  }, [tab]);

  const onLogout = () => {
    logoutAdmin();
    navigate("/auth");
  };

  const updateOrderStep = async (orderId, step) => {
    const result = await updateOrderStatusApi(orderId, step);
    if (!result.success) {
      alert(result.message || "Failed to update order status");
      return;
    }
    loadOrders();
  };

  const updateOrderDetails = async (orderId, payload) => {
    const result = await adminUpdateOrderApi(orderId, payload);
    if (!result.success) {
      alert(result.message || "Failed to update order details");
      return false;
    }
    loadOrders();
    loadCustomers();
    return true;
  };

  const deleteOrder = async (orderId) => {
    const result = await deleteOrderApi(orderId);
    if (!result.success) {
      alert(result.message || "Failed to delete order");
      return;
    }
    loadOrders();
    loadCustomers();
  };

  const deleteRating = async (ratingId) => {
    const result = await deleteRatingApi(ratingId);
    if (!result.success) {
      alert(result.message || "Failed to delete rating");
      return;
    }
    loadRatings();
  };

  const saveServices = async (nextServices) => {
    const result = await replaceServicesApi(nextServices);
    if (!result.success) {
      alert(result.message || "Failed to save services");
      return false;
    }
    setServices(result.data?.services || nextServices);
    window.dispatchEvent(new Event("dobhivala:services:updated"));
    return true;
  };

  const createService = async (servicePayload) => {
    const result = await createServiceApi(servicePayload);
    if (!result.success || !result.data?.service) {
      alert(result.message || "Failed to add service");
      return null;
    }
    setServices((prev) => [result.data.service, ...prev]);
    window.dispatchEvent(new Event("dobhivala:services:updated"));
    return result.data.service;
  };

  const deleteService = async (serviceId) => {
    const result = await deleteServiceApi(serviceId);
    if (!result.success) {
      alert(result.message || "Failed to delete service");
      return false;
    }
    setServices((prev) => prev.filter((service) => String(service.id) !== String(serviceId)));
    window.dispatchEvent(new Event("dobhivala:services:updated"));
    return true;
  };

  const saveSettings = async (nextSettings) => {
    const result = await updateSettingsApi(nextSettings);
    if (!result.success) {
      alert(result.message || "Failed to save settings");
      return false;
    }
    setSettings(normalizeSettings(result.data?.settings || nextSettings));
    window.dispatchEvent(new Event("dobhivala:settings:updated"));
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:w-64 lg:fixed lg:h-screen lg:block lg:overflow-hidden">
        <AdminSidebar activeTab={tab} setActiveTab={setTab} onLogout={onLogout} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 z-50 transform transition-transform duration-300 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar activeTab={tab} setActiveTab={setTab} onLogout={onLogout} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-64 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex-shrink-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-700 shadow-xl backdrop-blur-md">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors mr-4"
            >
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight truncate">
                {tab === "dashboard" && "Dashboard"}
                {tab === "orders" && "Orders Management"}
                {tab === "customers" && "Customer Management"}
                {tab === "services" && "Service Management"}
                {tab === "ratings" && "Reviews & Ratings"}
                {tab === "settings" && "System Settings"}
                {tab === "contact" && "Contact Requests"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {tab === "dashboard" && "Overview of your business metrics"}
                {tab === "orders" && "Manage and track all customer orders"}
                {tab === "customers" && "View and analyze your customers"}
                {tab === "services" && "Configure pricing and services"}
                {tab === "ratings" && "Manage customer reviews and feedback"}
                {tab === "settings" && "Configure system parameters"}
                {tab === "contact" && "View and manage contact requests"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 pointer-events-none opacity-10 -z-10">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {tab === "dashboard" && (
              <AdminDashboard orders={orders} ratings={ratings} services={services} />
            )}

            {tab === "orders" && (
              <AdminOrders
                orders={orders}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                orderStatusFilter={orderStatusFilter}
                setOrderStatusFilter={setOrderStatusFilter}
                updateOrderStep={updateOrderStep}
                updateOrderDetails={updateOrderDetails}
                deleteOrder={deleteOrder}
                loadOrders={loadOrders}
              />
            )}

            {tab === "customers" && (
              <AdminCustomers customers={customers} />
            )}

            {tab === "services" && (
              <AdminServices
                services={services}
                setServices={setServices}
                saveServices={saveServices}
                createService={createService}
                deleteService={deleteService}
              />
            )}

            {tab === "ratings" && (
              <AdminRatings ratings={ratings} deleteRating={deleteRating} />
            )}

            {tab === "settings" && (
              <AdminSettings
                settings={settings}
                setSettings={setSettings}
                saveSettings={saveSettings}
              />
            )}

            {tab === "contact" && <AdminContacts />}
          </div>
        </div>
      </main>

      {/* Global Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
