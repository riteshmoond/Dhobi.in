import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Search, Trash2 } from "lucide-react";
import { TRACKING_STEPS } from "../../lib/orderTracking";

const buildEditForm = (order) => ({
  fullName: order?.address?.fullName || "",
  phone: order?.address?.phone || "",
  address: order?.address?.address || "",
  city: order?.address?.city || "",
  pincode: order?.address?.pincode || "",
  paymentMethod: order?.paymentMethod || "cod",
});

const AdminOrders = ({
  orders,
  searchTerm,
  setSearchTerm,
  orderStatusFilter,
  setOrderStatusFilter,
  updateOrderStep,
  updateOrderDetails,
  deleteOrder,
  loadOrders,
}) => {
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState(buildEditForm(null));
  const [savingOrderId, setSavingOrderId] = useState(null);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (orderStatusFilter !== "all") {
      filtered = filtered.filter((o) => {
        if (orderStatusFilter === "active") {
          return Number(o.trackingStep) < TRACKING_STEPS.length - 1;
        }
        if (orderStatusFilter === "delivered") {
          return Number(o.trackingStep) === TRACKING_STEPS.length - 1;
        }
        return true;
      });
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          String(o.id).includes(searchTerm) ||
          String(o.address?.fullName || "")
            .toLowerCase()
            .includes(q) ||
          String(o.address?.phone || "").includes(searchTerm)
      );
    }
    return filtered;
  }, [orders, orderStatusFilter, searchTerm]);

  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }
    const csv = [Object.keys(data[0]).join(","), ...data.map((obj) => Object.values(obj).join(","))].join(
      "\n"
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onStartEdit = (order) => {
    setEditingOrderId(String(order.id));
    setEditForm(buildEditForm(order));
  };

  const onCancelEdit = () => {
    setEditingOrderId(null);
    setEditForm(buildEditForm(null));
  };

  const onChangeEditField = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSaveEdit = async (orderId) => {
    setSavingOrderId(String(orderId));
    const payload = {
      paymentMethod: editForm.paymentMethod,
      address: {
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        city: editForm.city.trim(),
        pincode: editForm.pincode.trim(),
      },
    };
    const ok = await updateOrderDetails(orderId, payload);
    setSavingOrderId(null);
    if (ok) {
      onCancelEdit();
    }
  };

  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={loadOrders}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 gap-2"
        >
          Refresh
        </Button>
        <Button
          onClick={() => {
            const data = filteredOrders.map((o) => ({
              OrderID: o.id,
              Customer: o.address?.fullName || "N/A",
              Phone: o.address?.phone || "N/A",
              Total: o.total,
              Status: TRACKING_STEPS[o.trackingStep]?.label || "Unknown",
              CreatedAt: o.createdAt || "N/A",
            }));
            exportToCSV(data, "orders.csv");
          }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-purple-400" />
          <input
            type="text"
            placeholder="Search by order ID, name, or phone..."
            className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-slate-700 border border-slate-600 text-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          value={orderStatusFilter}
          onChange={(e) => setOrderStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active Orders</option>
          <option value="delivered">Delivered</option>
        </select>
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl px-4 py-3 flex items-center justify-center text-sm font-semibold text-purple-300">
          {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-[65vh] lg:max-h-[70vh] overflow-y-auto scrollbar-hide">
        {filteredOrders.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg font-semibold">No orders found</p>
            <p className="text-slate-500 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isEditing = String(order.id) === String(editingOrderId);
            const isSaving = String(order.id) === String(savingOrderId);

            return (
              <div
                key={order.id}
                className="group relative bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-4 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 rounded-xl transition-all"></div>

                <div className="relative flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-black text-lg bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                          Order #{order.id}
                        </p>
                        <span className="text-xs bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2.5 py-1 rounded-full font-semibold">
                          {Array.isArray(order.items) ? order.items.length : 0} items
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-2">
                        <span className="font-semibold text-slate-200">{order.address?.fullName || "N/A"}</span> |
                        <span className="ml-3 font-semibold text-slate-200">{order.address?.phone || "N/A"}</span>
                      </p>
                      <p className="text-sm text-slate-400">
                        {order.address?.address || "N/A"}, {order.address?.city || "N/A"}{" "}
                        {order.address?.pincode || ""}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Payment: {order.paymentMethod || "N/A"}</p>
                      <p className="text-lg font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                        Rs {order.total}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <select
                        className="bg-slate-600 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm font-semibold focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        value={Number(order.trackingStep) || 0}
                        onChange={(e) => updateOrderStep(order.id, e.target.value)}
                      >
                        {TRACKING_STEPS.map((step, idx) => (
                          <option key={step.key} value={idx}>
                            {step.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={() => (isEditing ? onCancelEdit() : onStartEdit(order))}
                        className="bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        {isEditing ? "Close Edit" : "Edit"}
                      </Button>
                      <Button
                        onClick={() => {
                          if (window.confirm("Delete this order?")) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="bg-red-600/80 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="bg-slate-900/40 border border-slate-600 rounded-lg p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        className="bg-slate-700 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm"
                        placeholder="Full Name"
                        value={editForm.fullName}
                        onChange={(e) => onChangeEditField("fullName", e.target.value)}
                      />
                      <input
                        className="bg-slate-700 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm"
                        placeholder="Phone"
                        value={editForm.phone}
                        onChange={(e) => onChangeEditField("phone", e.target.value)}
                      />
                      <input
                        className="bg-slate-700 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm"
                        placeholder="Pincode"
                        value={editForm.pincode}
                        onChange={(e) => onChangeEditField("pincode", e.target.value)}
                      />
                      <input
                        className="bg-slate-700 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm md:col-span-2"
                        placeholder="Address"
                        value={editForm.address}
                        onChange={(e) => onChangeEditField("address", e.target.value)}
                      />
                      <input
                        className="bg-slate-700 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm"
                        placeholder="City"
                        value={editForm.city}
                        onChange={(e) => onChangeEditField("city", e.target.value)}
                      />
                      <select
                        className="bg-slate-700 border border-slate-500 text-slate-100 rounded-lg px-3 py-2 text-sm"
                        value={editForm.paymentMethod}
                        onChange={(e) => onChangeEditField("paymentMethod", e.target.value)}
                      >
                        <option value="cod">COD</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                        <option value="netbanking">Net Banking</option>
                      </select>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <Button
                          onClick={() => onSaveEdit(order.id)}
                          disabled={isSaving}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                        >
                          {isSaving ? "Saving..." : "Save Details"}
                        </Button>
                        <Button
                          onClick={onCancelEdit}
                          className="bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
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

export default AdminOrders;
