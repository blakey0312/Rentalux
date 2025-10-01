// API Configuration for Rentalux
// Automatically uses Next.js API routes (serverless)

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export const API_ENDPOINTS = {
  // Vehicle endpoints
  vehicles: {
    getAll: () => `${API_BASE_URL}/api/vehicles`,
    getById: (id: string) => `${API_BASE_URL}/api/vehicles/${id}`,
    create: () => `${API_BASE_URL}/api/vehicles`,
    update: (id: string) => `${API_BASE_URL}/api/vehicles/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/vehicles/${id}`,
  },

  // Reservation endpoints
  reservations: {
    getAll: () => `${API_BASE_URL}/api/reservations`,
    getByCustomer: (customerId: string) => `${API_BASE_URL}/api/reservations?customerId=${customerId}`,
    getById: (id: string) => `${API_BASE_URL}/api/reservations/${id}`,
    create: () => `${API_BASE_URL}/api/reservations`,
    update: (id: string) => `${API_BASE_URL}/api/reservations/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/reservations/${id}`,
  },

  // Stripe endpoints
  stripe: {
    createCheckoutSession: () => `${API_BASE_URL}/api/checkout_sessions`,
  },
};

// Helper function for API calls
export const apiCall = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};
