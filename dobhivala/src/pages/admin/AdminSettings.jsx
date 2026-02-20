import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const AdminSettings = ({ settings, setSettings, saveSettings }) => {
  const updatePaymentMethod = (key, enabled) => {
    setSettings((prev) => ({
      ...prev,
      paymentMethods: { ...prev.paymentMethods, [key]: enabled },
    }));
  };

  const onSaveSettings = async () => {
    const ok = await saveSettings(settings);
    if (ok) {
      alert("Settings saved successfully!");
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <label className="block text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">
            Delivery Charge (Rs)
          </label>
          <input
            type="number"
            min="0"
            value={settings.deliveryCharge}
            onChange={(e) => setSettings({ ...settings, deliveryCharge: Number(e.target.value) })}
            className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">
            Minimum Order Value (Rs)
          </label>
          <input
            type="number"
            min="0"
            value={settings.minOrderValue}
            onChange={(e) => setSettings({ ...settings, minOrderValue: Number(e.target.value) })}
            className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">
            Business Hours
          </label>
          <input
            type="text"
            value={settings.businessHours}
            onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
            className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-indigo-300 uppercase tracking-wider mb-2">
            Service Area
          </label>
          <input
            type="text"
            value={settings.serviceArea}
            onChange={(e) => setSettings({ ...settings, serviceArea: e.target.value })}
            className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
          />
        </div>

        <div className="border border-slate-500 rounded-xl p-4 space-y-4">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
            Brand Identity
          </p>
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Brand Name</label>
            <input
              type="text"
              value={settings.brandName || ""}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
              placeholder="DobhiWala"
            />
          </div>
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Logo URL</label>
            <input
              type="url"
              value={settings.logoUrl || ""}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>

        <div className="border border-slate-500 rounded-xl p-4 space-y-4">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
            Contact Details
          </p>
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Support Phone</label>
            <input
              type="text"
              value={settings.supportPhone || ""}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail || ""}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
              placeholder="help@dobhiwala.in"
            />
          </div>
          <div>
            <label className="block text-sm text-indigo-300 mb-2">Support Address</label>
            <input
              type="text"
              value={settings.supportAddress || ""}
              onChange={(e) => setSettings({ ...settings, supportAddress: e.target.value })}
              className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold"
              placeholder="Jaipur, Rajasthan"
            />
          </div>
        </div>

        <div className="border border-slate-500 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Order Control</p>
          <label className="flex items-center gap-2 text-slate-200 font-semibold">
            <input
              type="checkbox"
              checked={Boolean(settings.ordersEnabled)}
              onChange={(e) => setSettings({ ...settings, ordersEnabled: e.target.checked })}
            />
            Accept New Orders
          </label>
        </div>

        <div className="border border-slate-500 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Category Visibility</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-200">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.categoryVisibility?.men)}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    categoryVisibility: { ...prev.categoryVisibility, men: e.target.checked },
                  }))
                }
              />
              Men
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.categoryVisibility?.female)}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    categoryVisibility: { ...prev.categoryVisibility, female: e.target.checked },
                  }))
                }
              />
              Female
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.categoryVisibility?.kids)}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    categoryVisibility: { ...prev.categoryVisibility, kids: e.target.checked },
                  }))
                }
              />
              Kids
            </label>
          </div>
        </div>

        <div className="border border-slate-500 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Payment Methods</p>
          <div className="grid grid-cols-2 gap-3 text-slate-200">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.paymentMethods?.cod)}
                onChange={(e) => updatePaymentMethod("cod", e.target.checked)}
              />
              COD
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.paymentMethods?.upi)}
                onChange={(e) => updatePaymentMethod("upi", e.target.checked)}
              />
              UPI
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.paymentMethods?.card)}
                onChange={(e) => updatePaymentMethod("card", e.target.checked)}
              />
              Card
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(settings.paymentMethods?.netbanking)}
                onChange={(e) => updatePaymentMethod("netbanking", e.target.checked)}
              />
              Net Banking
            </label>
          </div>
        </div>

        <div className="border border-slate-500 rounded-xl p-4 space-y-3">
          <label className="flex items-center gap-2 text-slate-200 font-semibold">
            <input
              type="checkbox"
              checked={Boolean(settings.rushDeliveryEnabled)}
              onChange={(e) =>
                setSettings({ ...settings, rushDeliveryEnabled: e.target.checked })
              }
            />
            Enable Rush Delivery
          </label>

          <div>
            <label className="block text-sm text-indigo-300 mb-2">Rush Delivery Charge (Rs)</label>
            <input
              type="number"
              min="0"
              value={settings.rushDeliveryCharge}
              onChange={(e) =>
                setSettings({ ...settings, rushDeliveryCharge: Number(e.target.value) })
              }
              disabled={!settings.rushDeliveryEnabled}
              className="w-full bg-slate-600 border border-slate-500 text-slate-200 rounded-xl px-4 py-3 font-semibold disabled:opacity-50"
            />
          </div>
        </div>

        <Button
          onClick={onSaveSettings}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl py-6 text-lg gap-3"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </Button>
      </div>
    </section>
  );
};

export default AdminSettings;
