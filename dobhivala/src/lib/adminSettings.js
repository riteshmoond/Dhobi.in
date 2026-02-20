export const ADMIN_SETTINGS_KEY = "admin_settings";

export const defaultAdminSettings = {
  deliveryCharge: 50,
  minOrderValue: 200,
  businessHours: "9 AM - 9 PM",
  serviceArea: "All",
  brandName: "DobhiWala",
  logoUrl: "",
  supportPhone: "+91 98765 43210",
  supportEmail: "help@dobhiwala.in",
  supportAddress: "Jaipur, Rajasthan",
  rushDeliveryEnabled: false,
  rushDeliveryCharge: 80,
  ordersEnabled: true,
  categoryVisibility: {
    men: true,
    female: true,
    kids: true,
  },
  paymentMethods: {
    cod: true,
    upi: true,
    card: true,
    netbanking: true,
  },
};

export const normalizeSettings = (settings) => ({
  deliveryCharge: Number(settings?.deliveryCharge) || 0,
  minOrderValue: Number(settings?.minOrderValue) || 0,
  businessHours: String(settings?.businessHours || defaultAdminSettings.businessHours),
  serviceArea: String(settings?.serviceArea || defaultAdminSettings.serviceArea),
  brandName: String(settings?.brandName || defaultAdminSettings.brandName),
  logoUrl: String(settings?.logoUrl || defaultAdminSettings.logoUrl),
  supportPhone: String(settings?.supportPhone || defaultAdminSettings.supportPhone),
  supportEmail: String(settings?.supportEmail || defaultAdminSettings.supportEmail),
  supportAddress: String(settings?.supportAddress || defaultAdminSettings.supportAddress),
  rushDeliveryEnabled: Boolean(settings?.rushDeliveryEnabled),
  rushDeliveryCharge: Number(settings?.rushDeliveryCharge) || 0,
  ordersEnabled: settings?.ordersEnabled !== false,
  categoryVisibility: {
    men: settings?.categoryVisibility?.men !== false,
    female: settings?.categoryVisibility?.female !== false,
    kids: settings?.categoryVisibility?.kids !== false,
  },
  paymentMethods: {
    cod: settings?.paymentMethods?.cod !== false,
    upi: settings?.paymentMethods?.upi !== false,
    card: settings?.paymentMethods?.card !== false,
    netbanking: settings?.paymentMethods?.netbanking !== false,
  },
});

export const loadAdminSettings = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(ADMIN_SETTINGS_KEY));
    if (!raw) return defaultAdminSettings;
    return normalizeSettings(raw);
  } catch {
    return defaultAdminSettings;
  }
};

export const saveAdminSettings = (settings) => {
  const normalized = normalizeSettings(settings);
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("dobhivala:settings:updated"));
  return normalized;
};
