/**
 * API service layer
 *
 * Currently backed by localStorage (mock).
 * Swap the implementation of each function to call your real backend
 * (Supabase, Express, etc.) without changing any call sites.
 */

import type { Order, CartItem, GymInstructor, TrainingSession } from "@/types";

const STORAGE_KEYS = {
  ORDERS: "fitmeal_orders",
  SESSIONS: "fitmeal_sessions",
  USER: "fitmeal_user",
  ADMIN_RESTAURANT: "fitmeal_admin_restaurant",
  ADMIN_INSTRUCTOR: "fitmeal_admin_instructor",
} as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Orders API ───────────────────────────────────────────────────────────────

export const ordersApi = {
  list(): Order[] {
    return readStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  create(params: {
    restaurantId: string;
    restaurantName: string;
    items: CartItem[];
    totalAmount: number;
    paymentId: string;
    paymentMethod: string;
  }): Order {
    const order: Order = {
      id: generateId(),
      restaurantId: params.restaurantId,
      restaurantName: params.restaurantName,
      items: params.items,
      totalAmount: params.totalAmount,
      status: "confirmed",
      placedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
      paymentMethod: params.paymentMethod,
      paymentId: params.paymentId,
    };

    const existing = this.list();
    writeStorage(STORAGE_KEYS.ORDERS, [order, ...existing]);
    return order;
  },

  updateStatus(orderId: string, status: Order["status"]): boolean {
    const orders = this.list();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx === -1) return false;
    orders[idx] = { ...orders[idx], status };
    writeStorage(STORAGE_KEYS.ORDERS, orders);
    return true;
  },
};

// ── Training sessions API ─────────────────────────────────────────────────────

export const sessionsApi = {
  list(): TrainingSession[] {
    return readStorage<TrainingSession[]>(STORAGE_KEYS.SESSIONS, []);
  },

  book(params: {
    instructorId: string;
    date: string;
    type: TrainingSession["type"];
    price: number;
  }): TrainingSession {
    const session: TrainingSession = {
      id: generateId(),
      instructorId: params.instructorId,
      userId: "current-user",
      date: params.date,
      duration: 60,
      type: params.type,
      status: "upcoming",
      price: params.price,
    };
    const existing = this.list();
    writeStorage(STORAGE_KEYS.SESSIONS, [session, ...existing]);
    return session;
  },
};

// ── Admin — Restaurant owner API ──────────────────────────────────────────────

export interface RestaurantAdminProfile {
  restaurantName: string;
  cuisine: string;
  address: string;
  deliveryTime: string;
  priceRange: string;
  specialties: string[];
  isCloudKitchen: boolean;
  menu: Array<{
    id: string;
    name: string;
    price: number;
    calories: number;
    category: string;
    isAvailable: boolean;
  }>;
}

const DEFAULT_RESTAURANT_PROFILE: RestaurantAdminProfile = {
  restaurantName: "",
  cuisine: "",
  address: "",
  deliveryTime: "30-40 min",
  priceRange: "₹₹",
  specialties: [],
  isCloudKitchen: false,
  menu: [],
};

export const restaurantAdminApi = {
  getProfile(): RestaurantAdminProfile {
    return readStorage<RestaurantAdminProfile>(
      STORAGE_KEYS.ADMIN_RESTAURANT,
      DEFAULT_RESTAURANT_PROFILE
    );
  },

  saveProfile(profile: RestaurantAdminProfile): void {
    writeStorage(STORAGE_KEYS.ADMIN_RESTAURANT, profile);
  },
};

// ── Admin — Gym instructor API ─────────────────────────────────────────────────

export interface InstructorAdminProfile {
  name: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  pricePerSession: number;
  priceMonthly: number;
  availability: string[];
  gymName: string;
  location: string;
  languages: string[];
  offerOnline: boolean;
  offerInPerson: boolean;
}

const DEFAULT_INSTRUCTOR_PROFILE: InstructorAdminProfile = {
  name: "",
  bio: "",
  specialties: [],
  certifications: [],
  pricePerSession: 500,
  priceMonthly: 3000,
  availability: [],
  gymName: "",
  location: "",
  languages: ["English", "Hindi"],
  offerOnline: true,
  offerInPerson: true,
};

export const instructorAdminApi = {
  getProfile(): InstructorAdminProfile {
    return readStorage<InstructorAdminProfile>(
      STORAGE_KEYS.ADMIN_INSTRUCTOR,
      DEFAULT_INSTRUCTOR_PROFILE
    );
  },

  saveProfile(profile: InstructorAdminProfile): void {
    writeStorage(STORAGE_KEYS.ADMIN_INSTRUCTOR, profile);
  },
};

// ── Razorpay helpers ──────────────────────────────────────────────────────────

/**
 * Load the Razorpay checkout script (only once).
 */
export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Open Razorpay checkout in test mode.
 * Replace `key` with your live key_id when you go to production.
 */
export async function openRazorpayCheckout(params: {
  amount: number;
  description: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}): Promise<void> {
  const loaded = await loadRazorpay();
  if (!loaded) {
    alert("Payment gateway failed to load. Please check your internet connection.");
    return;
  }

  const options = {
    // ⚠️  TEST KEY — replace with live key_id before production
    key: "rzp_test_placeholder_key",
    amount: params.amount * 100,          // Razorpay expects paise
    currency: "INR",
    name: "FitMeal",
    description: params.description,
    image: "/favicon.ico",
    prefill: {
      name: params.userName ?? "",
      email: params.userEmail ?? "",
      contact: params.userPhone ?? "",
    },
    theme: { color: "hsl(142, 76%, 36%)" },
    handler: (response: { razorpay_payment_id: string }) => {
      params.onSuccess(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: () => {
        params.onDismiss?.();
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
