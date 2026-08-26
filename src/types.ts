export type MealPeriod = 'morning' | 'afternoon' | 'evening';

export type FoodType = 'veg' | 'non-veg';

export type OrderStatus = 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'ONLINE_SIMULATED' | 'COUNTER_PAY';

export interface MenuItem {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  foodType: FoodType;
  mealPeriod: MealPeriod; // morning, afternoon, evening
  isUnlimited: boolean; // For unlimited meals/tiffins indicator
  category: string; // e.g. "Dosas", "Thalis", "Combos", "Beverages"
  imageUrl?: string;
  prepTimeMinutes: number;
  calories?: number;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  itemTotal: number;
}

export interface CustomerProfile {
  customerToken: string; // e.g., "CUST-4821"
  mobile: string; // 10-digit number
  name: string;
  createdAt: string;
  totalOrders: number;
}

export interface Order {
  id: string;
  orderToken: string; // e.g., "TK-104"
  customerToken: string;
  customerName: string;
  customerMobile: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PAY_AT_COUNTER';
  status: OrderStatus;
  mealPeriod: MealPeriod;
  createdAt: string;
  estimatedReadyTime: string;
  notes?: string;
}

export interface SystemMetrics {
  status: 'UP' | 'DEGRADED';
  uptimeSeconds: number;
  totalOrders: number;
  activeOrders: number;
  registeredCustomers: number;
  serverTime: string;
  environment: string;
  version: string;
}
