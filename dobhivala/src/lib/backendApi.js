import { apiFetch } from "./apiClient";

const CUSTOMER_TOKEN_KEY = "dobhivala_customer_token";
const ADMIN_TOKEN_KEY = "dobhivala_admin_token";
const LEGACY_TOKEN_KEY = "dobhivala_auth_token";

const getToken = () => {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isAdminTab = pathname.startsWith("/admin");

  if (isAdminTab) {
    return (
      localStorage.getItem(ADMIN_TOKEN_KEY) ||
      localStorage.getItem(CUSTOMER_TOKEN_KEY) ||
      localStorage.getItem(LEGACY_TOKEN_KEY) ||
      ""
    );
  }

  return (
    localStorage.getItem(CUSTOMER_TOKEN_KEY) ||
    localStorage.getItem(ADMIN_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_TOKEN_KEY) ||
    ""
  );
};

export const getServicesApi = () => apiFetch("/services");

export const replaceServicesApi = (services) =>
  apiFetch("/services", {
    method: "PUT",
    token: getToken(),
    body: { services },
  });

export const createServiceApi = (payload) =>
  apiFetch("/services", {
    method: "POST",
    token: getToken(),
    body: payload,
  });

export const deleteServiceApi = (id) =>
  apiFetch(`/services/${id}`, {
    method: "DELETE",
    token: getToken(),
  });

export const getSettingsApi = () => apiFetch("/settings");

export const updateSettingsApi = (settings) =>
  apiFetch("/settings", {
    method: "PUT",
    token: getToken(),
    body: settings,
  });

export const createOrderApi = (payload) =>
  apiFetch("/orders", {
    method: "POST",
    token: getToken(),
    body: payload,
  });

export const getMyOrdersApi = () =>
  apiFetch("/orders/my", {
    token: getToken(),
  });

export const getOrderByIdApi = (id) =>
  apiFetch(`/orders/${id}`, {
    token: getToken(),
  });

export const getAdminOrdersApi = () =>
  apiFetch("/orders/admin/all", {
    token: getToken(),
  });

export const updateOrderStatusApi = (id, trackingStep) =>
  apiFetch(`/orders/admin/${id}/status`, {
    method: "PATCH",
    token: getToken(),
    body: { trackingStep: Number(trackingStep) },
  });

export const adminUpdateOrderApi = (id, payload) =>
  apiFetch(`/orders/admin/${id}`, {
    method: "PATCH",
    token: getToken(),
    body: payload,
  });

export const deleteOrderApi = (id) =>
  apiFetch(`/orders/admin/${id}`, {
    method: "DELETE",
    token: getToken(),
  });

export const createRatingApi = (payload) =>
  apiFetch("/ratings", {
    method: "POST",
    token: getToken(),
    body: payload,
  });

export const getAdminRatingsApi = () =>
  apiFetch("/ratings/admin/all", {
    token: getToken(),
  });

export const deleteRatingApi = (id) =>
  apiFetch(`/ratings/admin/${id}`, {
    method: "DELETE",
    token: getToken(),
  });

export const getAdminCustomersApi = () =>
  apiFetch("/customers", {
    token: getToken(),
  });

export const createContactApi = (payload) =>
  apiFetch("/contact", {
    method: "POST",
    body: payload,
  });

export const getAdminContactsApi = () =>
  apiFetch("/contact", {
    token: getToken(),
  });

export const updateContactStatusApi = (id, status) =>
  apiFetch(`/contact/${id}`, {
    method: "PATCH",
    token: getToken(),
    body: { status },
  });

export const replyToContactApi = (id, replyMessage) =>
  apiFetch(`/contact/${id}/reply`, {
    method: "POST",
    token: getToken(),
    body: { replyMessage },
  });
