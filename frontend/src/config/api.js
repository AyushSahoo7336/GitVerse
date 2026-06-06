const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export const apiUrl = (path) => {
  if (!path) {
    return apiBaseUrl;
  }

  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};