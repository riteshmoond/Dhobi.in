export const ADMIN_SETTINGS_KEY = "admin_settings";

export const defaultServiceVariantPricing = {
  ironAdjustment: -10,
  washAdjustment: -5,
  dryCleanAdjustment: 20,
};

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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
  serviceVariantPricing: defaultServiceVariantPricing,
};

export const normalizeSettings = (settings) => ({
  deliveryCharge: toNumberOrDefault(settings?.deliveryCharge, 0),
  minOrderValue: toNumberOrDefault(settings?.minOrderValue, 0),
  businessHours: String(settings?.businessHours || defaultAdminSettings.businessHours),
  serviceArea: String(settings?.serviceArea || defaultAdminSettings.serviceArea),
  brandName: String(settings?.brandName || defaultAdminSettings.brandName),
  logoUrl: String(settings?.logoUrl || defaultAdminSettings.logoUrl),
  supportPhone: String(settings?.supportPhone || defaultAdminSettings.supportPhone),
  supportEmail: String(settings?.supportEmail || defaultAdminSettings.supportEmail),
  supportAddress: String(settings?.supportAddress || defaultAdminSettings.supportAddress),
  rushDeliveryEnabled: Boolean(settings?.rushDeliveryEnabled),
  rushDeliveryCharge: toNumberOrDefault(settings?.rushDeliveryCharge, 0),
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
  serviceVariantPricing: {
    ironAdjustment: toNumberOrDefault(
      settings?.serviceVariantPricing?.ironAdjustment,
      defaultServiceVariantPricing.ironAdjustment
    ),
    washAdjustment: toNumberOrDefault(
      settings?.serviceVariantPricing?.washAdjustment,
      defaultServiceVariantPricing.washAdjustment
    ),
    dryCleanAdjustment: toNumberOrDefault(
      settings?.serviceVariantPricing?.dryCleanAdjustment,
      defaultServiceVariantPricing.dryCleanAdjustment
    ),
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
