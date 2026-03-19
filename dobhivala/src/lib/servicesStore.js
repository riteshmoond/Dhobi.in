import { menServices } from "../pages/user/Menservices";
import { femaleServices } from "../pages/user/Femaleservices";
import { kidsservices } from "../pages/user/Kidsservices";
import { dryCleanServices } from "../pages/user/DryCleanServices";
import { defaultAdminSettings } from "./adminSettings";

export const SERVICES_STORAGE_KEY = "dobhivala_services_v1";

export const SERVICE_VARIANT_KEYS = [
  { key: "iron", label: "Iron", adjustmentField: "ironAdjustment" },
  { key: "wash", label: "Wash", adjustmentField: "washAdjustment" },
  { key: "dryclean", label: "Dry Clean", adjustmentField: "dryCleanAdjustment" },
];

export const getServiceVariantDefinitions = (settings = defaultAdminSettings) =>
  SERVICE_VARIANT_KEYS.map((variant) => ({
    ...variant,
    priceFor: (service) =>
      Math.max(
        10,
        Number(service.price || 0) +
          Number(settings?.serviceVariantPricing?.[variant.adjustmentField] || 0)
      ),
  }));

const getDefaultOptionPrices = (service, settings = defaultAdminSettings) =>
  getServiceVariantDefinitions(settings).reduce((acc, variant) => {
    acc[variant.key] = variant.priceFor(service);
    return acc;
  }, {});

const normalizeOptionPrices = (service, settings = defaultAdminSettings) => {
  const defaults = getDefaultOptionPrices(service, settings);
  const incoming = service?.optionPrices || {};
  const hasLegacyZeroValues =
    Number(incoming.iron) === 0 &&
    Number(incoming.wash) === 0 &&
    Number(incoming.dryclean) === 0;

  if (hasLegacyZeroValues) {
    return defaults;
  }

  return {
    iron: Number.isFinite(Number(incoming.iron)) ? Number(incoming.iron) : defaults.iron,
    wash: Number.isFinite(Number(incoming.wash)) ? Number(incoming.wash) : defaults.wash,
    dryclean: Number.isFinite(Number(incoming.dryclean))
      ? Number(incoming.dryclean)
      : defaults.dryclean,
  };
};

export const withResolvedOptionPrices = (service, settings = defaultAdminSettings) => ({
  ...service,
  optionPrices: normalizeOptionPrices(service, settings),
});

export const getVariantServiceId = (serviceId, variantKey) =>
  `${String(serviceId)}__${String(variantKey)}`;

const createVariantServices = (services = [], settings = defaultAdminSettings) =>
  services.flatMap((service) => {
    if (service?.variantOf || service?.category === "dryclean") return [];

    const optionPrices = normalizeOptionPrices(service, settings);

    return getServiceVariantDefinitions(settings).map((variant) => ({
      ...service,
      id: getVariantServiceId(service.id, variant.key),
      name: `${service.name} (${variant.label})`,
      unit: variant.label,
      price: optionPrices[variant.key],
      variantOf: service.id,
      variantKey: variant.key,
      hiddenFromCategory: true,
      popular: false,
    }));
  });

export const expandServicesWithVariants = (services = [], settings = defaultAdminSettings) => {
  const baseServices = Array.isArray(services) ? services : [];
  const variantServices = createVariantServices(baseServices, settings);
  return [...baseServices, ...variantServices];
};

export const getDefaultServices = () => [
  ...menServices.map((item) => ({ ...item, category: "men" })),
  ...femaleServices.map((item) => ({ ...item, category: "female" })),
  ...kidsservices.map((item) => ({ ...item, category: "kids" })),
  ...dryCleanServices.map((item) => ({ ...item, category: "dryclean" })),
];

const normalizeService = (service) => ({
  ...service,
  id: service.id ?? service.code ?? `${service.category || "men"}_${service.name || "service"}`,
  name: String(service.name || "").trim(),
  unit: String(service.unit || "").trim(),
  price: Number(service.price) || 0,
  img: String(service.img || "").trim(),
  popular: Boolean(service.popular),
  category: service.category || "men",
  optionPrices: service.optionPrices || undefined,
});

const getServiceKey = (service) =>
  `${String(service.category || "men").toLowerCase()}::${String(service.id || "").toLowerCase()}`;

export const loadServicesFromStorage = (settings = defaultAdminSettings) => {
  try {
    const raw = JSON.parse(localStorage.getItem(SERVICES_STORAGE_KEY));
    if (!Array.isArray(raw) || raw.length === 0) {
      return expandServicesWithVariants(getDefaultServices(), settings);
    }
    return mergeServicesWithDefaults(raw, settings);
  } catch {
    return expandServicesWithVariants(getDefaultServices(), settings);
  }
};

export const saveServicesToStorage = (services) => {
  const normalized = services.map(normalizeService);
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("dobhivala:services:updated"));
  return normalized;
};

export const mergeServicesWithDefaults = (services = [], settings = defaultAdminSettings) => {
  const defaults = getDefaultServices().map(normalizeService);
  const incoming = Array.isArray(services)
    ? services
        .filter((service) => !service?.variantOf)
        .map(normalizeService)
    : [];

  const mergedByKey = new Map();
  for (const service of defaults) {
    mergedByKey.set(getServiceKey(service), service);
  }
  for (const service of incoming) {
    mergedByKey.set(getServiceKey(service), service);
  }

  return expandServicesWithVariants(Array.from(mergedByKey.values()), settings);
};

export const splitServicesByCategory = (services) => ({
  men: services.filter((s) => s.category === "men" && !s.hiddenFromCategory),
  female: services.filter((s) => s.category === "female" && !s.hiddenFromCategory),
  kids: services.filter((s) => s.category === "kids" && !s.hiddenFromCategory),
});
