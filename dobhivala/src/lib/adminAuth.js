export const ADMIN_SESSION_KEY = "dobhivala_admin_session";
export const ADMIN_DEFAULT_EMAIL = "admin@dhobi.in";
export const ADMIN_DEFAULT_PASSWORD = "admin123";

export const isAdminLoggedIn = () => localStorage.getItem(ADMIN_SESSION_KEY) === "1";

export const loginAdmin = (email, password) => {
  const isValid =
    email.trim().toLowerCase() === ADMIN_DEFAULT_EMAIL &&
    password === ADMIN_DEFAULT_PASSWORD;
  if (isValid) localStorage.setItem(ADMIN_SESSION_KEY, "1");
  return isValid;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};
