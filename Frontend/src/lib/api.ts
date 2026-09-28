/**
 * IHF Luxury E-Commerce Frontend API Client
 * Centralized connector to Express / Node.js Backend API
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ihf_token');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ status: 'success' | 'fail' | 'error'; data?: T; message?: string; token?: string; [key: string]: any }> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getStoredToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: any) {
    console.warn(`[API] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

// ---------------------------------------------
// Authentication Endpoints
// ---------------------------------------------
export const authApi = {
  async register(body: { name: string; email: string; password: string; phone?: string }) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (res.token && typeof window !== 'undefined') {
      localStorage.setItem('ihf_token', res.token);
    }
    return res;
  },

  async login(body: { email: string; password: string }) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    if (res.token && typeof window !== 'undefined') {
      localStorage.setItem('ihf_token', res.token);
    }
    return res;
  },

  async getMe() {
    return apiRequest('/auth/me');
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ihf_token');
      }
    }
  },

  async forgotPassword(email: string) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

// ---------------------------------------------
// Products & Catalog Endpoints
// ---------------------------------------------
export const productsApi = {
  async getAll(params?: Record<string, string | number>) {
    const query = params
      ? '?' +
        Object.entries(params)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')
      : '';
    return apiRequest(`/products${query}`);
  },

  async getFeatured() {
    return apiRequest('/products/featured');
  },

  async getBySlug(slug: string) {
    return apiRequest(`/products/${slug}`);
  }
};

// ---------------------------------------------
// Categories Endpoints
// ---------------------------------------------
export const categoriesApi = {
  async getAll() {
    return apiRequest('/categories');
  },

  async getBySlug(slug: string) {
    return apiRequest(`/categories/${slug}`);
  }
};

// ---------------------------------------------
// Customizer Engine Endpoints
// ---------------------------------------------
export interface CustomizerCalculatePayload {
  productId: string;
  width: string;
  height: string;
  fullnessId?: string;
  liningId?: string;
  pleatId?: string;
  hardwareIds?: string[];
  panelConfiguration?: 'single_panel' | 'pair';
  quantity?: number;
}

export const customizerApi = {
  async getRules() {
    return apiRequest('/customizer/rules');
  },

  async calculatePrice(payload: CustomizerCalculatePayload) {
    return apiRequest('/customizer/calculate-price', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

// ---------------------------------------------
// Fabric Swatches Endpoints
// ---------------------------------------------
export const swatchesApi = {
  async getAll() {
    return apiRequest('/swatches');
  },

  async requestSampleKit(payload: {
    customerInfo: {
      name: string;
      email: string;
      phone?: string;
      shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
      };
    };
    swatchIds: string[];
    notes?: string;
  }) {
    return apiRequest('/swatches/request', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

// ---------------------------------------------
// Orders & Checkout Endpoints
// ---------------------------------------------
export const ordersApi = {
  async createPaymentIntent(items: any[]) {
    return apiRequest('/orders/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ items })
    });
  },

  async placeOrder(payload: {
    items: any[];
    shippingAddress: {
      fullName: string;
      street: string;
      apartment?: string;
      city: string;
      state: string;
      zipCode: string;
      country?: string;
    };
    paymentIntentId?: string;
    notes?: string;
  }) {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getMyOrders() {
    return apiRequest('/orders/my-orders');
  }
};

// ---------------------------------------------
// Navigation & Filters Endpoints
// ---------------------------------------------
export const navigationApi = {
  async getTree() {
    return apiRequest('/navigation');
  }
};

export const filtersApi = {
  async getAll() {
    return apiRequest('/filters');
  }
};
