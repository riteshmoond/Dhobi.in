import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { menServices } from "./Menservices";
import { femaleServices } from "./Femaleservices";
import { kidsservices } from "./Kidsservices";

const Addtocard = ({
  cart,
  allServices,
  addToCart,
  removeFromCart,
  totalItems,
  subtotal,
}) => {
  const navigate = useNavigate();
  const serviceList = allServices || [...menServices, ...femaleServices, ...kidsservices];
  const selectedItems = serviceList.filter((item) => cart[item.id] > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] pt-20 text-gray-800">
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-6 sm:mb-8 px-1">
          <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-[#009dff]" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#007acc] drop-shadow-sm">Your Cart</h2>
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-center py-10 sm:py-14 bg-white shadow-md rounded-3xl border border-[#b9e5ff] px-4">
            <p className="text-gray-500 text-base sm:text-lg">Your cart is empty</p>
            <Button
              className="mt-5 bg-gradient-to-r from-[#009dff] to-[#007acc] text-white px-6 py-3 rounded-full hover:opacity-90 text-sm sm:text-base"
              onClick={() => navigate("/male")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <Card
                  key={item.id}
                  className="p-3 sm:p-4 rounded-2xl border border-[#b9e5ff] bg-gradient-to-br from-[#ffffff] via-[#e8f7ff] to-[#dff3ff] hover:shadow-lg transition-transform hover:-translate-y-1"
                >
                  <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="bg-[#e0f3ff] rounded-xl p-2 sm:p-3 shadow-inner">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#003366]">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">₹{item.price} • {item.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-center gap-3 bg-[#e8f7ff] rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-[#b9e5ff] w-full sm:w-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full bg-white hover:bg-[#d0ecff]"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Minus className="w-4 h-4 text-[#007acc]" />
                      </Button>

                      <span className="font-semibold w-6 text-center text-[#003366] text-sm sm:text-base">
                        {cart[item.id]}
                      </span>

                      <Button
                        size="sm"
                        className="h-8 w-8 rounded-full bg-[#009dff] hover:bg-[#007acc] text-white shadow-md"
                        onClick={() => addToCart(item.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 bg-gradient-to-br from-[#ffffff] via-[#e8f7ff] to-[#dff3ff] shadow-md rounded-3xl p-5 sm:p-6 border border-[#b9e5ff]">
              <h3 className="text-lg sm:text-xl font-semibold text-[#007acc] mb-4">Order Summary</h3>

              <div className="flex justify-between text-gray-700 mb-3 text-sm sm:text-base">
                <span>Total Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="flex justify-between text-gray-700 text-lg font-semibold mb-6">
                <span>Total Amount</span>
                <span className="text-[#009dff]">₹{subtotal}</span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#009dff] to-[#007acc] text-white py-3 rounded-xl text-base sm:text-lg font-medium hover:opacity-90 transition"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      items: selectedItems.map(({ id, name, price, unit }) => ({
                        id,
                        name,
                        price,
                        unit,
                        qty: cart[id],
                      })),
                      subtotal,
                    },
                  })
                }
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Addtocard;
