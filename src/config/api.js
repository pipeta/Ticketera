
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, 
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

if (import.meta.env.DEV) {
  console.log('🌐 API Config:', API_CONFIG);
}