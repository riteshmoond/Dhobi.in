export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiFetch = async (path, options = {}) => {
  const { method = "GET", body, token, headers = {} } = options;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
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
