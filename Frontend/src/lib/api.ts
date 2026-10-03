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
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    });
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

  async googleLogin(body: { email: string; name?: string; googleId?: string; photo?: string }) {
    const res = await apiRequest('/auth/google', {
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

export const adminProductsApi = {
  async getAll() { return apiRequest('/admin/products?limit=100'); },
  async create(payload: Record<string, unknown>) { return apiRequest('/admin/products', { method: 'POST', body: JSON.stringify(payload) }); },
  async update(id: string, payload: Record<string, unknown>) { return apiRequest(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async remove(id: string) { return apiRequest(`/admin/products/${id}`, { method: 'DELETE' }); }
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

export type AdminCategoryPayload = {
  name: string; slug?: string; description?: string; parentCategory?: string | { _id?: string; name?: string } | null;
  displayOrder?: number; isActive?: boolean; image?: { url: string; alt?: string };
  storefront?: { eyebrow?: string; headline?: string; heroImage?: string; guideTitle?: string; guideCopy?: string };
};

export const adminCategoriesApi = {
  async getAll() { return apiRequest('/admin/categories'); },
  async create(payload: AdminCategoryPayload) { return apiRequest('/admin/categories', { method: 'POST', body: JSON.stringify(payload) }); },
  async update(id: string, payload: Partial<AdminCategoryPayload>) { return apiRequest(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }); },
  async remove(id: string) { return apiRequest(`/admin/categories/${id}`, { method: 'DELETE' }); }
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

  async getFilters() {
    return apiRequest('/customizer/filters');
  },

  async getFabrics(params?: {
    collection?: string;
    color?: string;
    priceGroup?: string;
    material?: string;
    sort?: string;
    search?: string;
  }) {
    const query = params
      ? '?' +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
          .join('&')
      : '';
    return apiRequest(`/customizer/fabrics${query}`);
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
        apartment?: string;
        city: string;
        state: string;
        zipCode: string;
        country?: string;
      };
    };
    swatchIds?: string[];
    customSwatches?: any[];
    totalCost?: number;
    notes?: string;
  }) {
    return apiRequest('/swatches/request', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async trackOrder(orderNumber: string) {
    return apiRequest(`/swatches/track/${encodeURIComponent(orderNumber)}`);
  },

  async getMySwatchOrders() {
    return apiRequest('/swatches/my-orders');
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

// ---------------------------------------------
// Atelier Consultations Endpoints
// ---------------------------------------------
export interface ConsultationBookingPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  time?: string;
  room?: string;
  notes?: string;
  type?: 'phone';
}

export interface AdminConsultationRecord extends ConsultationBookingPayload {
  _id: string;
  consultationNumber: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  isArchived: boolean;
  internalNotes?: string;
  assignedDesigner?: string;
  createdAt: string;
  updatedAt: string;
}

export const consultationsApi = {
  async create(payload: ConsultationBookingPayload) {
    return apiRequest<{ consultation: AdminConsultationRecord }>('/consultations', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
};

export const adminConsultationsApi = {
  async getAll(params?: { status?: string; search?: string; isArchived?: string }) {
    const query = params
      ? '?' +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
          .join('&')
      : '';
    return apiRequest<{ consultations: AdminConsultationRecord[] }>(`/admin/consultations${query}`);
  },

  async getById(id: string) {
    return apiRequest<{ consultation: AdminConsultationRecord }>(`/admin/consultations/${id}`);
  },

  async update(id: string, payload: Partial<AdminConsultationRecord>) {
    return apiRequest<{ consultation: AdminConsultationRecord }>(`/admin/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async archive(id: string) {
    return apiRequest<{ consultation: AdminConsultationRecord }>(`/admin/consultations/${id}`, {
      method: 'DELETE'
    });
  },

  async restore(id: string) {
    return apiRequest<{ consultation: AdminConsultationRecord }>(`/admin/consultations/${id}/restore`, {
      method: 'PATCH'
    });
  }
};

// ---------------------------------------------
// Admin Orders & Fulfillment Endpoints
// ---------------------------------------------
export interface AdminOrderCustomSpecs {
  width?: { raw: string; decimal: number; formatted: string };
  height?: { raw: string; decimal: number; formatted: string };
  fullness?: { id: string; label: string; factor: number };
  lining?: { id: string; name: string; type: string };
  pleatHeader?: { id: string; name: string };
  hardware?: Array<{ id: string; name: string; price?: number }>;
  color?: { name: string; hexCode: string };
  fabricType?: string;
  fabricName?: string;
  fabricCode?: string;
  roomLabel?: string;
  motorization?: string;
  notes?: string;
  panelConfiguration?: 'single_panel' | 'pair';
  priceBreakdown?: any;
}

export interface AdminOrderItem {
  _id?: string;
  itemType: 'custom_curtain' | 'standard_product' | 'swatch_kit';
  product?: any;
  title: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customCurtainSpecs?: AdminOrderCustomSpecs | null;
  swatchKitDetails?: any[];
}

export interface AdminOrderRecord {
  _id: string;
  orderNumber: string;
  orderType?: string;
  user?: any;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  items: AdminOrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shippingAddress: {
    fullName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone?: string;
  };
  paymentInfo: {
    stripePaymentIntentId?: string;
    paymentStatus: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
    paymentMethod?: string;
    paidAt?: string;
  };
  fulfillmentStatus:
    | 'Pending'
    | 'Payment Pending'
    | 'Sizing Confirmation'
    | 'Awaiting Fabric'
    | 'Production Pending'
    | 'Manufacturing'
    | 'Delayed'
    | 'Quality Check'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled';
  carrier?: string;
  trackingNumber?: string;
  manufacturingNotes?: string;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCreateManualOrderPayload {
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress?: {
    fullName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    phone?: string;
  };
  items: Array<{
    itemType?: string;
    title: string;
    quantity: number;
    unitPrice: number;
    width?: string | number;
    height?: string | number;
    fullnessId?: string;
    fullnessLabel?: string;
    liningId?: string;
    liningName?: string;
    pleatId?: string;
    pleatName?: string;
    fabricType?: string;
    fabricName?: string;
    fabricCode?: string;
    roomLabel?: string;
    motorization?: string;
    colorName?: string;
    panelConfiguration?: string;
    notes?: string;
  }>;
  orderType?: string;
  pricing?: {
    subtotal?: number;
    shipping?: number;
    tax?: number;
    discount?: number;
    total?: number;
  };
  paymentStatus?: string;
  paymentMethod?: string;
  fulfillmentStatus?: string;
  carrier?: string;
  trackingNumber?: string;
  manufacturingNotes?: string;
}

export const adminOrdersApi = {
  async getAll(params?: {
    tab?: string;
    fulfillmentStatus?: string;
    paymentStatus?: string;
    orderType?: string;
    search?: string;
    isArchived?: string;
    page?: number;
    limit?: number;
  }) {
    const query = params
      ? '?' +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
          .join('&')
      : '';
    return apiRequest<{
      orders: AdminOrderRecord[];
      total: number;
      counts: { all: number; active: number; draft: number; archived: number };
    }>(`/admin/orders${query}`);
  },

  async getById(id: string) {
    return apiRequest<{ order: AdminOrderRecord }>(`/admin/orders/${id}`);
  },

  async createManual(payload: AdminCreateManualOrderPayload) {
    return apiRequest<{ order: AdminOrderRecord }>('/admin/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async update(id: string, payload: Partial<AdminOrderRecord>) {
    return apiRequest<{ order: AdminOrderRecord }>(`/admin/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async updateFulfillment(
    id: string,
    payload: {
      fulfillmentStatus?: string;
      trackingNumber?: string;
      carrier?: string;
      manufacturingNotes?: string;
    }
  ) {
    return apiRequest<{ order: AdminOrderRecord }>(`/admin/orders/${id}/fulfillment`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  async archive(id: string) {
    return apiRequest<{ message: string }>(`/admin/orders/${id}`, {
      method: 'DELETE'
    });
  },

  async restore(id: string) {
    return apiRequest<{ order: AdminOrderRecord }>(`/admin/orders/${id}/restore`, {
      method: 'PATCH'
    });
  }
};

