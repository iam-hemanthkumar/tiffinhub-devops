import { CustomerProfile, MenuItem, Order, OrderStatus, PaymentMethod, MealPeriod, SystemMetrics } from '../types';

const API_BASE = '/api';

export async function fetchMenu(mealPeriod?: MealPeriod, foodType?: string): Promise<{ items: MenuItem[]; suggestedMealPeriod: MealPeriod }> {
  const params = new URLSearchParams();
  if (mealPeriod) params.append('mealPeriod', mealPeriod);
  if (foodType && foodType !== 'all') params.append('foodType', foodType);

  const res = await fetch(`${API_BASE}/menu?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch menu items');
  }
  return res.json();
}

export async function registerCustomer(mobile: string, name?: string): Promise<{ customer: CustomerProfile; message: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, name }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to register');
  }
  return data;
}

export async function loginCustomer(identifier: string): Promise<{ customer: CustomerProfile }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Customer not found');
  }
  return data;
}

export async function fetchCustomerProfile(token: string): Promise<{ customer: CustomerProfile; orders: Order[] }> {
  const res = await fetch(`${API_BASE}/customers/${encodeURIComponent(token)}`);
  if (!res.ok) {
    throw new Error('Failed to fetch customer profile');
  }
  return res.json();
}

export async function placeOrder(orderData: {
  customerToken: string;
  items: { menuItemId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  mealPeriod: MealPeriod;
  notes?: string;
}): Promise<{ order: Order; message: string }> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to place order');
  }
  return data;
}

export async function fetchOrderDetails(idOrToken: string): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(idOrToken)}`);
  if (!res.ok) {
    throw new Error('Order not found');
  }
  return res.json();
}

export async function advanceOrderStatus(orderId: string): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/advance`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to advance status');
  }
  return data;
}

export function maskMobile(mobile: string): string {
  if (!mobile || mobile.length < 10) return mobile || '';
  const clean = mobile.replace(/\D/g, '').slice(-10);
  return `+91 ${clean.slice(0, 2)}*** ***${clean.slice(7)}`;
}
