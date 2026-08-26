import { CustomerProfile, MenuItem, Order, OrderStatus, PaymentMethod, MealPeriod, SystemMetrics } from '../src/types';
import { INITIAL_MENU_ITEMS } from './data/menu';

// In-Memory Database for TiffinHub
class TiffinDatabase {
  private menu: MenuItem[] = [...INITIAL_MENU_ITEMS];
  private customers: Map<string, CustomerProfile> = new Map(); // key: customerToken
  private mobileIndex: Map<string, string> = new Map(); // key: mobile, value: customerToken
  private orders: Map<string, Order> = new Map(); // key: orderId
  
  // Daily reset trackers
  private currentDateStr: string = this.getTodayDateString();
  private dailyCustomerCounter = 0;
  private dailyOrderCounter = 0;

  constructor() {
    this.seedDemoData();
  }

  private getTodayDateString(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private checkAndResetDailyTokens() {
    const today = this.getTodayDateString();
    if (this.currentDateStr !== today) {
      this.currentDateStr = today;
      this.dailyCustomerCounter = 0;
      this.dailyOrderCounter = 0;
    }
  }

  private seedDemoData() {
    this.dailyCustomerCounter = 1;
    this.dailyOrderCounter = 1;

    // Seed a demo customer with single-digit token '1'
    const demoCustToken = '1';
    const demoCustomer: CustomerProfile = {
      customerToken: demoCustToken,
      mobile: '9876543210',
      name: 'Rahul Sharma',
      createdAt: new Date().toISOString(),
      totalOrders: 1,
    };
    this.customers.set(demoCustToken, demoCustomer);
    this.mobileIndex.set('9876543210', demoCustToken);

    // Seed a demo order with token '1'
    const demoOrderId = 'ord-demo-01';
    const demoOrder: Order = {
      id: demoOrderId,
      orderToken: '1',
      customerToken: demoCustToken,
      customerName: 'Rahul Sharma',
      customerMobile: '9876543210',
      items: [
        {
          menuItem: this.menu[0], // Unlimited Morning Tiffin Platter
          quantity: 1,
          itemTotal: 120,
        },
        {
          menuItem: this.menu[6], // Filter Coffee
          quantity: 1,
          itemTotal: 30,
        },
      ],
      totalAmount: 150,
      paymentMethod: 'ONLINE_SIMULATED',
      paymentStatus: 'PAID',
      status: 'COMPLETED',
      mealPeriod: 'morning',
      createdAt: new Date().toISOString(),
      estimatedReadyTime: '10-15 mins',
      notes: 'Less spicy sambar please',
    };
    this.orders.set(demoOrderId, demoOrder);
  }

  // --- MENU ---
  public getMenu(mealPeriod?: MealPeriod, foodType?: string): MenuItem[] {
    let list = this.menu;
    if (mealPeriod) {
      list = list.filter((item) => item.mealPeriod === mealPeriod);
    }
    if (foodType && (foodType === 'veg' || foodType === 'non-veg')) {
      list = list.filter((item) => item.foodType === foodType);
    }
    return list;
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.menu.find((item) => item.id === id);
  }

  // --- CUSTOMER PROFILE & AUTH ---
  public registerCustomer(mobile: string, name?: string): CustomerProfile {
    this.checkAndResetDailyTokens();

    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length < 10) {
      throw new Error('Please enter a valid 10-digit mobile number');
    }

    // Name validation: only letters and spaces allowed (no symbols or numbers)
    let validatedName = '';
    if (name && name.trim()) {
      const trimmedName = name.trim();
      const letterRegex = /^[A-Za-z\s]+$/;
      if (!letterRegex.test(trimmedName)) {
        throw new Error('Name must contain letters only (no numbers or special characters)');
      }
      validatedName = trimmedName;
    }

    // Check if already registered today/previously
    const existingToken = this.mobileIndex.get(cleanMobile);
    if (existingToken && this.customers.has(existingToken)) {
      const existing = this.customers.get(existingToken)!;
      if (validatedName) {
        existing.name = validatedName;
      }
      return existing;
    }

    // Create new customer token: 1, 2, 3 ... (1 to 4 digits based on daily customers count)
    this.dailyCustomerCounter++;
    const customerToken = String(this.dailyCustomerCounter);
    const newCustomer: CustomerProfile = {
      customerToken,
      mobile: cleanMobile,
      name: validatedName || `Customer ${customerToken}`,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
    };

    this.customers.set(customerToken, newCustomer);
    this.mobileIndex.set(cleanMobile, customerToken);
    return newCustomer;
  }

  public getCustomerByToken(token: string): CustomerProfile | undefined {
    return this.customers.get(token.trim());
  }

  public getCustomerByMobile(mobile: string): CustomerProfile | undefined {
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    const token = this.mobileIndex.get(cleanMobile);
    return token ? this.customers.get(token) : undefined;
  }

  // --- ORDERS ---
  public createOrder(data: {
    customerToken: string;
    items: { menuItemId: string; quantity: number }[];
    paymentMethod: PaymentMethod;
    mealPeriod: MealPeriod;
    notes?: string;
  }): Order {
    this.checkAndResetDailyTokens();

    const customer = this.getCustomerByToken(data.customerToken);
    if (!customer) {
      throw new Error('Customer profile not found. Please register or login first.');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('Your cart is empty. Please select food items.');
    }

    const orderItems = data.items.map((itemReq) => {
      const menuItem = this.getMenuItemById(itemReq.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item with ID ${itemReq.menuItemId} not found.`);
      }
      const qty = Math.max(1, itemReq.quantity || 1);
      return {
        menuItem,
        quantity: qty,
        itemTotal: menuItem.price * qty,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.itemTotal, 0);

    // Order token: 1, 2, 3 ... (single digit to three/four based on daily count)
    this.dailyOrderCounter++;
    const orderToken = String(this.dailyOrderCounter);
    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder: Order = {
      id: orderId,
      orderToken,
      customerToken: customer.customerToken,
      customerName: customer.name,
      customerMobile: customer.mobile,
      items: orderItems,
      totalAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'ONLINE_SIMULATED' ? 'PAID' : 'PAY_AT_COUNTER',
      status: 'RECEIVED',
      mealPeriod: data.mealPeriod,
      createdAt: new Date().toISOString(),
      estimatedReadyTime: '8-12 mins',
      notes: data.notes || '',
    };

    this.orders.set(orderId, newOrder);
    customer.totalOrders = (customer.totalOrders || 0) + 1;

    return newOrder;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  public getOrderByToken(token: string): Order | undefined {
    const cleanToken = token.trim();
    for (const order of this.orders.values()) {
      if (order.orderToken === cleanToken) {
        return order;
      }
    }
    return undefined;
  }

  public getOrdersByCustomer(customerToken: string): Order[] {
    const cleanToken = customerToken.trim();
    const result: Order[] = [];
    for (const order of this.orders.values()) {
      if (order.customerToken === cleanToken) {
        result.push(order);
      }
    }
    // Return newest first
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updateOrderStatus(orderId: string, status: OrderStatus): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    order.status = status;
    return order;
  }

  public advanceOrderStatus(orderId: string): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    const flow: OrderStatus[] = ['RECEIVED', 'PREPARING', 'READY', 'COMPLETED'];
    const currentIndex = flow.indexOf(order.status);
    if (currentIndex !== -1 && currentIndex < flow.length - 1) {
      order.status = flow[currentIndex + 1];
    }
    return order;
  }
}

export const db = new TiffinDatabase();
