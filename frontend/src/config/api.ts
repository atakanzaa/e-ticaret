export const API_CONFIG = {
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:8080',
  AUTH_SERVICE_URL: (import.meta as any).env?.VITE_AUTH_SERVICE_URL ?? 'http://localhost:8081'
};
