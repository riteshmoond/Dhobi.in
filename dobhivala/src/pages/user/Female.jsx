import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Star } from "lucide-react";
import { femaleServices } from "./Femaleservices";
import { useNavigate } from "react-router-dom";

const Female = ({
  services = femaleServices,
  addToCart = () => console.warn("addToCart not provided"),
  totalItems = 0,
  subtotal = 0,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedQtyById, setSelectedQtyById] = useState({});

  const filteredItems = services.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSelectedQty = (itemId) => selectedQtyById[itemId] || 0;

  const increaseSelectedQty = (itemId) => {
    setSelectedQtyById((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const decreaseSelectedQty = (itemId) => {
    setSelectedQtyById((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 0) return prev;
      const next = { ...prev };
      if (current === 1) delete next[itemId];
      else next[itemId] = current - 1;
      return next;
    });
  };

  const addSelectedToCart = (itemId) => {
    const qty = getSelectedQty(itemId);
    if (qty <= 0) return;
    for (let i = 0; i < qty; i += 1) {
      addToCart(itemId);
    }
    setSelectedQtyById((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f7fbff] to-[#cfe9ff] pt-20 text-gray-800">
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-10">

        {/* Header */}
        <div className="text-center px-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#009dff] drop-shadow-lg">
            Women’s Laundry Services
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Premium care for your delicate wear 👗✨
          </p>
        </div>

        {/* Search */}
        <div className="mt-6 px-2 flex justify-center">
          <input
            type="text"
            placeholder="Search Women’s Clothing..."
            className="border rounded-full px-4 py-2 w-full max-w-md text-sm sm:text-base bg-white border-[#87cefa] outline-none shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards Grid */}
        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredItems.map((item) => {
            const qty = getSelectedQty(item.id);

            return (
              <Card
                key={item.id}
                className="overflow-hidden rounded-3xl border border-[#b9e5ff] shadow-md hover:shadow-xl 
                transition-transform duration-300 hover:-translate-y-1 bg-gradient-to-br 
                from-[#ffffff] via-[#e8f7ff] to-[#dff3ff] w-full"
              >
                {/* Image */}
                <CardHeader className="flex justify-center items-center p-5 sm:p-8">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xl"
                  />
                </CardHeader>

                {/* Info */}
                <CardContent className="text-center p-4 sm:p-5 bg-[#f9fcff]">
                  <CardTitle className="text-[#003366] text-base sm:text-lg font-bold mb-1">
                    {item.name}
                  </CardTitle>

                  <div className="flex justify-center items-center text-[#009dff] text-sm gap-1 mb-1">
                    <Star fill="currentColor" className="w-4 h-4" />
                    <span>{item.rating || "4.8"}</span>
                  </div>

                  <p className="text-gray-700 text-xs sm:text-sm mb-2">
                    ₹{item.price} • {item.unit}
                  </p>

                  {/* Price */}
                  <div className="flex justify-center items-center gap-2 mb-3">
                    <p className="text-lg font-semibold text-[#009dff]">
                      ₹{item.price}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 line-through">
                      ₹{item.price + 30}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex justify-center items-center gap-3 mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-[#e0f3ff] hover:bg-[#b3e5fc] h-7 w-7 sm:h-8 sm:w-8 border border-[#87cefa]"
                      disabled={qty === 0}
                      onClick={() => decreaseSelectedQty(item.id)}
                    >
                      <Minus className="w-4 h-4 text-[#007acc]" />
                    </Button>

                    <span className="font-semibold w-6 text-center text-[#003366]">
                      {qty}
                    </span>

                    <Button
                      size="icon"
                      className="rounded-full bg-[#009dff] hover:bg-[#007acc] text-white h-7 w-7 sm:h-8 sm:w-8 shadow-md"
                      onClick={() => increaseSelectedQty(item.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button
                      className="bg-gradient-to-r from-[#009dff] to-[#007acc] 
                      text-white rounded-full px-4 py-2 text-sm w-full sm:w-auto"
                      onClick={() => navigate("/addtocard")}
                    >
                      Buy Now
                    </Button>

                    <Button
                      variant="outline"
                      className="border-[#009dff] text-[#009dff] hover:bg-[#009dff] hover:text-white 
                      rounded-full px-4 py-2 text-sm w-full sm:w-auto"
                      onClick={() => addSelectedToCart(item.id)}
                      disabled={qty === 0}
                    >
                      Add to Cart {qty > 0 ? `(${qty})` : ""}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* View Cart */}
        <div className="text-center mt-12 px-4">
          <Button
            className="bg-gradient-to-r from-[#009dff] to-[#007acc] 
            text-white rounded-full px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
            disabled={totalItems === 0}
            onClick={() => navigate("/addtocard")}
          >
            View Cart ({totalItems}) • ₹{subtotal}
          </Button>
        </div>

      </main>
    </div>
  );
};

export default Female;
