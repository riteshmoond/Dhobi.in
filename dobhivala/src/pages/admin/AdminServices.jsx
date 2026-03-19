import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import {
  getDefaultServices,
  splitServicesByCategory,
} from "../../lib/servicesStore";

const emptyOptionPrices = {
  iron: 0,
  wash: 0,
  dryclean: 0,
};

const AdminServices = ({
  services,
  setServices,
  saveServices,
  createService,
  deleteService,
}) => {
  const [serviceFilter, setServiceFilter] = React.useState("all");
  const [newService, setNewService] = React.useState({
    name: "",
    unit: "Wash & Iron",
    price: 0,
    category: "men",
    img: "",
    popular: false,
    optionPrices: emptyOptionPrices,
  });

  const resetNewService = () =>
    setNewService({
      name: "",
      unit: "Wash & Iron",
      price: 0,
      category: "men",
      img: "",
      popular: false,
      optionPrices: emptyOptionPrices,
    });

  const addNewService = async () => {
    const name = newService.name.trim();
    if (!name) {
      alert("Service name is required");
      return;
    }

    const payload = {
      name,
      unit: newService.unit.trim() || "Wash & Iron",
      price: Number(newService.price) || 0,
      category: newService.category,
      img:
        newService.img.trim() ||
        "https://cdn-icons-png.flaticon.com/128/869/869636.png",
      popular: Boolean(newService.popular),
      optionPrices: {
        iron: Number(newService.optionPrices?.iron) || 0,
        wash: Number(newService.optionPrices?.wash) || 0,
        dryclean: Number(newService.optionPrices?.dryclean) || 0,
      },
    };

    if (typeof createService === "function") {
      const created = await createService(payload);
      if (!created) return;
      resetNewService();
      return;
    }

    setServices((prev) => [payload, ...prev]);
    resetNewService();
  };

  const updateServiceField = (serviceId, category, field, value) => {
    setServices((prev) =>
      prev.map((service) => {
        if (String(service.id) !== String(serviceId) || service.category !== category) {
          return service;
        }
        if (field === "price") return { ...service, price: Number(value) || 0 };
        if (field === "popular") return { ...service, popular: Boolean(value) };
        if (field.startsWith("optionPrices.")) {
          const optionKey = field.split(".")[1];
          return {
            ...service,
            optionPrices: {
              ...emptyOptionPrices,
              ...service.optionPrices,
              [optionKey]: Number(value) || 0,
            },
          };
        }
        return { ...service, [field]: value };
      })
    );
  };

  const onSaveServices = async () => {
    const ok = await saveServices(services);
    if (ok) {
      alert("Services updated successfully");
    }
  };

  const onResetServices = async () => {
    const defaults = getDefaultServices();
    setServices(defaults);
    const ok = await saveServices(defaults);
    if (ok) {
      alert("Services reset to default");
    }
  };

  const onDeleteService = async (service) => {
    if (!service?.id || typeof deleteService !== "function") return;
    const confirmed = window.confirm(`Delete "${service.name}" service?`);
    if (!confirmed) return;
    const ok = await deleteService(service.id);
    if (ok) {
      alert("Service deleted successfully");
    }
  };

  const visibleServices = useMemo(() => {
    if (serviceFilter === "all") return services;
    return services.filter((service) => service.category === serviceFilter);
  }, [serviceFilter, services]);

  const serviceCounts = useMemo(() => splitServicesByCategory(services), [services]);

  return (
    <section className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={addNewService}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          + Add New Service
        </Button>
        <Button
          onClick={onSaveServices}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 gap-2"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button
          onClick={onResetServices}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Reset
        </Button>
      </div>

      <div className="bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-4">
        <h3 className="text-slate-200 font-bold mb-3">Add New Service/Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-9 gap-3">
          <input
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold md:col-span-2"
            placeholder="Service name"
            value={newService.name}
            onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold"
            placeholder="Unit (e.g. Wash & Iron)"
            value={newService.unit}
            onChange={(e) => setNewService((prev) => ({ ...prev, unit: e.target.value }))}
          />
          <input
            type="number"
            min="0"
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold"
            placeholder="Price"
            value={newService.price}
            onChange={(e) => setNewService((prev) => ({ ...prev, price: Number(e.target.value) }))}
          />
          <select
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold"
            value={newService.category}
            onChange={(e) => setNewService((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="men">Men</option>
            <option value="female">Female</option>
            <option value="kids">Kids</option>
            <option value="dryclean">Dry Clean</option>
          </select>
          <input
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold md:col-span-3"
            placeholder="Image URL (optional)"
            value={newService.img}
            onChange={(e) => setNewService((prev) => ({ ...prev, img: e.target.value }))}
          />
          <input
            type="number"
            min="0"
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold"
            placeholder="Iron price"
            value={newService.optionPrices.iron}
            onChange={(e) =>
              setNewService((prev) => ({
                ...prev,
                optionPrices: { ...prev.optionPrices, iron: Number(e.target.value) || 0 },
              }))
            }
          />
          <input
            type="number"
            min="0"
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold"
            placeholder="Wash price"
            value={newService.optionPrices.wash}
            onChange={(e) =>
              setNewService((prev) => ({
                ...prev,
                optionPrices: { ...prev.optionPrices, wash: Number(e.target.value) || 0 },
              }))
            }
          />
          <input
            type="number"
            min="0"
            className="bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold"
            placeholder="Dry clean price"
            value={newService.optionPrices.dryclean}
            onChange={(e) =>
              setNewService((prev) => ({
                ...prev,
                optionPrices: { ...prev.optionPrices, dryclean: Number(e.target.value) || 0 },
              }))
            }
          />
          <label className="flex items-center gap-2 text-slate-300 font-semibold md:col-span-2">
            <input
              type="checkbox"
              checked={newService.popular}
              onChange={(e) => setNewService((prev) => ({ ...prev, popular: e.target.checked }))}
            />
            Popular
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-blue-100">Men</p>
          <p className="text-3xl font-black mt-2">{serviceCounts.men.length}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-pink-100">Women</p>
          <p className="text-3xl font-black mt-2">{serviceCounts.female.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-yellow-100">Kids</p>
          <p className="text-3xl font-black mt-2">{serviceCounts.kids.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold text-purple-100">Total</p>
          <p className="text-3xl font-black mt-2">{services.length}</p>
        </div>
      </div>

      <select
        className="w-full sm:w-40 bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 text-slate-200 rounded-xl px-4 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
        value={serviceFilter}
        onChange={(e) => setServiceFilter(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="men">Men's Services</option>
        <option value="female">Women's Services</option>
        <option value="kids">Kids' Services</option>
        <option value="dryclean">Dry Clean Services</option>
      </select>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
        {visibleServices.map((service) => (
          <div
            key={`${service.category}-${service.id}`}
            className="group relative bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-4 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 rounded-xl transition-all"></div>

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Service Name
                </label>
                <input
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.name}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "name", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Unit
                </label>
                <input
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.unit}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "unit", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Price (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.price}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "price", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Iron (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.optionPrices?.iron ?? 0}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "optionPrices.iron", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Wash (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.optionPrices?.wash ?? 0}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "optionPrices.wash", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Dry Clean (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.optionPrices?.dryclean ?? 0}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "optionPrices.dryclean", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
                  Category
                </label>
                <select
                  className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-lg px-3 py-2 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  value={service.category}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "category", e.target.value)
                  }
                >
                  <option value="men">Men</option>
                  <option value="female">Female</option>
                  <option value="kids">Kids</option>
                  <option value="dryclean">Dry Clean</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-pointer hover:text-green-400 transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(service.popular)}
                  onChange={(e) =>
                    updateServiceField(service.id, service.category, "popular", e.target.checked)
                  }
                  className="w-5 h-5 cursor-pointer"
                />
                <span>Popular</span>
              </label>

              <Button
                type="button"
                onClick={() => onDeleteService(service)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
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

export default AdminServices;
