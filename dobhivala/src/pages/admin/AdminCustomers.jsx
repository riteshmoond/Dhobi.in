import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AdminCustomers = ({ customers = [] }) => {
  const getAllCustomers = useMemo(() => {
    return customers.map((customer) => ({
      ...customer,
      orders: Number(customer.orders) || 0,
      totalSpent: Number(customer.totalSpent) || 0,
    }));
  }, [customers]);

  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }
    const csv = [Object.keys(data[0]).join(","), ...data.map(obj => Object.values(obj).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Action Buttons */}
      <Button 
        onClick={() => {
          const data = getAllCustomers.map(c => ({
            Name: c.name,
            Email: c.email,
            Phone: c.phone,
            City: c.city,
            Orders: c.orders,
            TotalSpent: c.totalSpent
          }));
          exportToCSV(data, "customers.csv");
        }}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 gap-2"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </Button>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-blue-100">Total Customers</p>
          <p className="text-3xl font-black mt-2">{getAllCustomers.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-purple-100">Total Orders</p>
          <p className="text-3xl font-black mt-2">{getAllCustomers.reduce((sum, c) => sum + c.orders, 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-green-100">Total Revenue</p>
          <p className="text-3xl font-black mt-2">₹ {getAllCustomers.reduce((sum, c) => sum + c.totalSpent, 0)}</p>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] overflow-y-auto scrollbar-hide">
        {getAllCustomers.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg font-semibold">👥 No customers yet</p>
            <p className="text-slate-500 mt-2">Your customers will appear here as they place orders</p>
          </div>
        ) : (
          getAllCustomers.map((customer, idx) => (
            <div 
              key={idx}
              className="group relative bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-5 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/10 group-hover:to-indigo-600/10 rounded-xl transition-all"></div>
              
              <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">👤 Name</p>
                  <p className="text-lg font-black text-blue-300 mt-1">{customer.name}</p>
                  <p className="text-xs text-slate-400 mt-1">📧 {customer.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">📍 City</p>
                  <p className="font-bold text-slate-200 mt-1">{customer.city}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">📦 Orders</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mt-1">{customer.orders}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">💰 Total Spent</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-1">₹ {customer.totalSpent}</p>
                </div>
              </div>
            </div>
          ))
        )}
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

export default AdminCustomers;
