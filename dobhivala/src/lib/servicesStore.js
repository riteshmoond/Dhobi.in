import { menServices } from "../pages/user/Menservices";
import { femaleServices } from "../pages/user/Femaleservices";
import { kidsservices } from "../pages/user/Kidsservices";

export const SERVICES_STORAGE_KEY = "dobhivala_services_v1";

export const getDefaultServices = () => [
  ...menServices.map((item) => ({ ...item, category: "men" })),
  ...femaleServices.map((item) => ({ ...item, category: "female" })),
  ...kidsservices.map((item) => ({ ...item, category: "kids" })),
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
});

const getServiceKey = (service) =>
  `${String(service.category || "men").toLowerCase()}::${String(service.id || "").toLowerCase()}`;

export const loadServicesFromStorage = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(SERVICES_STORAGE_KEY));
    if (!Array.isArray(raw) || raw.length === 0) return getDefaultServices();
    return raw.map(normalizeService);
  } catch {
    return getDefaultServices();
  }
};

export const saveServicesToStorage = (services) => {
  const normalized = services.map(normalizeService);
  localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event("dobhivala:services:updated"));
  return normalized;
};

export const mergeServicesWithDefaults = (services = []) => {
  const defaults = getDefaultServices().map(normalizeService);
  const incoming = Array.isArray(services) ? services.map(normalizeService) : [];

  const mergedByKey = new Map();
  for (const service of defaults) {
    mergedByKey.set(getServiceKey(service), service);
  }
  for (const service of incoming) {
    mergedByKey.set(getServiceKey(service), service);
  }

  return Array.from(mergedByKey.values());
};

export const splitServicesByCategory = (services) => ({
  men: services.filter((s) => s.category === "men"),
  female: services.filter((s) => s.category === "female"),
  kids: services.filter((s) => s.category === "kids"),
});
