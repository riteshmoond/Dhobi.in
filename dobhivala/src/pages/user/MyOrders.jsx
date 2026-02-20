import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { normalizeOrdersTracking } from "../../lib/orderTracking";
import { getMyOrdersApi } from "../../lib/backendApi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAndSyncOrders = async () => {
      const result = await getMyOrdersApi();
      if (result.success && Array.isArray(result.data?.orders)) {
        const normalized = normalizeOrdersTracking(result.data.orders);
        const sorted = [...normalized].sort((a, b) => Number(b.id) - Number(a.id));
        setOrders(sorted);
        return;
      }
      setOrders([]);
    };

    loadAndSyncOrders();
    const timer = setInterval(loadAndSyncOrders, 30000);
    return () => clearInterval(timer);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-600 text-xl gap-4">
        <p>No orders found.</p>
        <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg border rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between gap-4"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Order ID: {order.id}</h3>

                <p className="text-gray-600 mt-1">
                  Total: <span className="font-bold text-blue-600">Rs {order.total}</span>
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {Array.isArray(order.items) ? order.items.length : 0} items |{" "}
                  {order.status || "Order Received"}
                </p>

                {order.createdAt ? (
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                ) : null}
              </div>

              <button
                onClick={() => navigate(`/track-order/${order.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 h-fit"
              >
                Track Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
