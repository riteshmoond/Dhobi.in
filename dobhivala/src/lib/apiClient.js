const DEFAULT_PROD_API = "https://dhobi-in.onrender.com/api";
const DEFAULT_DEV_API = "http://localhost:5000/api";

const normalizeApiBaseUrl = (url) => {
  const trimmed = String(url || "").replace(/\/+$/, "");
  if (!trimmed) return trimmed;
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const normalizeApiPath = (path) => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

export const API_BASE_URL =
  normalizeApiBaseUrl(
    import.meta.env.VITE_API_URL ||
      (import.meta.env.PROD ? DEFAULT_PROD_API : DEFAULT_DEV_API)
  );

export const apiFetch = async (path, options = {}) => {
  const { method = "GET", body, token, headers = {} } = options;
  const requestPath = normalizeApiPath(path);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${requestPath}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return {
      success: false,
      message: "Unable to connect to server",
      data: null,
    };
  }

  let parsed = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    return {
      success: false,
      message:
        parsed?.message || `Request failed with status ${response.status}`,
      data: parsed?.data || null,
    };
  }

  return {
    success: parsed?.success !== false,
    message: parsed?.message || "Success",
    data: parsed?.data || null,
  };
};
