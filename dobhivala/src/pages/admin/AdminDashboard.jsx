import React, { useMemo } from "react";
import { TRACKING_STEPS } from "../../lib/orderTracking";

const AdminDashboard = ({ orders, ratings, services }) => {
  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const activeOrders = orders.filter((o) => Number(o.trackingStep) < TRACKING_STEPS.length - 1).length;
    const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length).toFixed(1) : 0;
    
    const customers = {};
    orders.forEach((order) => {
      const phone = order.address?.phone;
      if (phone && !customers[phone]) customers[phone] = true;
    });

    return {
      totalOrders: orders.length,
      activeOrders,
      delivered: orders.length - activeOrders,
      revenue,
      totalCustomers: Object.keys(customers).length,
      avgRating,
    };
  }, [orders, ratings]);

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
        {/* Total Orders */}
        <div className="group relative bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-xs sm:text-sm font-semibold text-blue-100 relative z-10">Total Orders</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 sm:mt-3 relative z-10">{stats.totalOrders}</p>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Active Orders */}
        <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-xs sm:text-sm font-semibold text-amber-100 relative z-10">Active Orders</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 sm:mt-3 relative z-10">{stats.activeOrders}</p>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Delivered */}
        <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-xs sm:text-sm font-semibold text-green-100 relative z-10">Delivered</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 sm:mt-3 relative z-10">{stats.delivered}</p>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Revenue */}
        <div className="group relative bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-xs sm:text-sm font-semibold text-cyan-100 relative z-10">Revenue</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-black mt-2 sm:mt-3 relative z-10">₹ {stats.revenue}</p>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Customers */}
        <div className="group relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-xs sm:text-sm font-semibold text-purple-100 relative z-10">Customers</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 sm:mt-3 relative z-10">{stats.totalCustomers}</p>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Avg Rating */}
        <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-xs sm:text-sm font-semibold text-yellow-100 relative z-10">Avg Rating</p>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-black mt-2 sm:mt-3 relative z-10">⭐ {stats.avgRating}</p>
          <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>

      {/* Widget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* Recent Orders Widget */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg sm:rounded-xl lg:rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 sm:mb-4">📦 Recent Orders</h3>
            <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto scrollbar-hide">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all transform hover:translate-x-1">
                  <p className="font-bold text-cyan-300 text-xs sm:text-sm">Order #{order.id}</p>
                  <p className="text-xs text-slate-300">{order.address?.fullName || "Unknown"}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">₹ {order.total} • {TRACKING_STEPS[order.trackingStep]?.label || "Unknown"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Services Widget */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg sm:rounded-xl lg:rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl hover:shadow-2xl transition-all">
            <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3 sm:mb-4">⭐ Top Services</h3>
            <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto scrollbar-hide">
              {services.filter(s => s.popular).slice(0, 5).map((service) => (
                <div key={`${service.category}-${service.id}`} className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-2 sm:p-3 hover:from-green-500/20 hover:to-emerald-500/20 transition-all transform hover:translate-x-1">
                  <p className="font-bold text-green-300 text-xs sm:text-sm">{service.name}</p>
                  <p className="text-xs text-slate-300">{service.category.toUpperCase()} • {service.unit}</p>
                  <p className="text-xs font-black text-emerald-400 mt-1">₹ {service.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default AdminDashboard;
