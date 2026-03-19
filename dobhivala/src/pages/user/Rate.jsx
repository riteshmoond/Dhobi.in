import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dryCleanServices } from "./DryCleanServices";

const RatePage = ({
  cart = {},
  addToCart = () => console.warn("addToCart not provided"),
  removeFromCart = () => console.warn("removeFromCart not provided"),
  allServices = [],
  totalItems = 0,
  subtotal = 0,
}) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedQtyById, setSelectedQtyById] = useState({});

  const plan = state;
  const dryCleanServicesById = useMemo(
    () =>
      dryCleanServices.reduce((acc, service) => {
        acc[String(service.id)] = service;
        return acc;
      }, {}),
    []
  );
  const rateItems = useMemo(
    () =>
      (plan?.rateList || []).map((item) => ({
        ...item,
        service:
          allServices.find((service) => String(service.id) === String(item.serviceId)) ||
          dryCleanServicesById[String(item.serviceId)] ||
          null,
      })),
    [allServices, dryCleanServicesById, plan]
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

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        No Rate Data Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f6ff] via-[#f0faff] to-[#d8f1ff] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#0284c7]" />
          </button>

          <h1 className="text-3xl font-extrabold text-[#0369a1] tracking-wide drop-shadow-sm">
            {plan.title} Rates
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#bce8ff] mb-8">
          <div className="flex items-center gap-6">
            <img
              src={plan.img}
              alt={plan.title}
              className="w-24 h-24 rounded-2xl object-cover shadow-md border"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#045f9a]">{plan.title}</h2>
              <p className="text-slate-600 mt-1 text-sm">{plan.description}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-extrabold text-[#0284c7]">{plan.price}</p>
              <p className="text-xs text-slate-500">{plan.subtitle}</p>
            </div>
          </div>

          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(plan.features || []).map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-[#0ea5c9]" />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-[#bce8ff]">
          <h3 className="text-xl font-bold text-[#045f9a] mb-4">
            Detailed Rate List
          </h3>

          <div className="divide-y border rounded-xl overflow-hidden">
            {rateItems.map((item, index) => {
              const qty = item.service ? getSelectedQty(item.service.id) : 0;

              return (
                <div
                  key={index}
                  className="flex flex-col gap-3 px-4 py-3 bg-white hover:bg-[#f0fbff] transition sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-xl border bg-sky-50 p-1">
                      <img
                        src={item.service?.img || item.img || plan.img}
                        alt={item.item}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div>
                      <span className="text-slate-700 font-medium">{item.item}</span>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.service?.name || "Dry Clean Product"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span className="min-w-16 text-[#0284c7] font-bold">{item.price}</span>

                    <div className="flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-2 py-1">
                      <button
                        type="button"
                        aria-label={`Remove ${item.item}`}
                        className="rounded-full p-1 text-[#045f9a] transition hover:bg-white disabled:opacity-40"
                        disabled={qty === 0}
                        onClick={() => decreaseSelectedQty(item.service.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-6 text-center font-semibold text-[#045f9a]">
                        {qty}
                      </span>

                      <button
                        type="button"
                        aria-label={`Add ${item.item}`}
                        className="rounded-full p-1 text-[#045f9a] transition hover:bg-white"
                        onClick={() => increaseSelectedQty(item.service.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      type="button"
                      className="rounded-full bg-[#0369a1] px-4 py-2 text-white"
                      onClick={() => addSelectedToCart(item.service.id)}
                      disabled={qty === 0}
                    >
                      Add to Cart {qty > 0 ? `(${qty})` : ""}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            className="rounded-full bg-gradient-to-r from-[#0284c7] to-[#0369a1] px-6 py-2 text-white"
            disabled={totalItems === 0}
            onClick={() => navigate("/addtocard")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Cart ({totalItems}) - Rs {subtotal}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatePage;
