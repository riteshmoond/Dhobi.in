import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  Shirt,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Mail,
} from "lucide-react";

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, setSidebarOpen }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
    { id: "orders", label: "Orders", icon: ListOrdered, color: "from-purple-500 to-pink-500" },
    { id: "customers", label: "Customers", icon: Users, color: "from-orange-500 to-red-500" },
    { id: "services", label: "Services", icon: Shirt, color: "from-green-500 to-emerald-500" },
    { id: "ratings", label: "Reviews", icon: Star, color: "from-yellow-500 to-amber-500" },
    { id: "contact", label: "Contact", icon: Mail, color: "from-pink-500 to-blue-500" },
    { id: "settings", label: "Settings", icon: Settings, color: "from-indigo-500 to-purple-500" },
  ];

  
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after tab click
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside className="h-screen w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 pt-6 flex flex-col shadow-2xl overflow-hidden">
      {/* Logo Section */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Dhobi
            </h1>
            <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6 mb-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 px-3 space-y-2 overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/50 scale-105`
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              {/* Animated background */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
              )}

              <Icon className={`w-5 h-5 transition-transform ${isActive ? "rotate-12" : "group-hover:rotate-6"}`} />
              <span className="flex-1 text-left">{tab.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 animate-bounce" />}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-6 my-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>

      {/* Logout Button */}
      <div className="px-3 pb-6">
        <Button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl gap-2 shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
    </aside>
  );
};

export default AdminSidebar;
