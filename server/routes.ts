import { Router } from 'express';
import { db } from './db';
import { MealPeriod, PaymentMethod } from '../src/types';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'TiffinHub',
    timestamp: new Date().toISOString(),
  });
});

// 1. MENU ENDPOINTS
apiRouter.get('/menu', (req, res) => {
  try {
    const mealPeriod = req.query.mealPeriod as MealPeriod | undefined;
    const foodType = req.query.foodType as string | undefined;
    const items = db.getMenu(mealPeriod, foodType);

    // Also send helper for current suggested meal period based on server time
    const currentHour = new Date().getHours();
    let currentPeriod: MealPeriod = 'morning';
    if (currentHour >= 6 && currentHour < 11.5) {
      currentPeriod = 'morning';
    } else if (currentHour >= 11.5 && currentHour < 16.5) {
      currentPeriod = 'afternoon';
    } else {
      currentPeriod = 'evening';
    }

    res.json({
      items,
      count: items.length,
      currentServerTime: new Date().toLocaleTimeString(),
      suggestedMealPeriod: currentPeriod,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch menu' });
  }
});

// 3. AUTHENTICATION & CUSTOMER REGISTRATION
apiRouter.post('/auth/register', (req, res) => {
  try {
    const { mobile, name } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const customer = db.registerCustomer(mobile, name);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Customer token generated.',
      customer,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req, res) => {
  try {
    const { identifier } = req.body; // Can be mobile or token
    if (!identifier) {
      return res.status(400).json({ error: 'Mobile number or Customer Token is required' });
    }

    let customer = db.getCustomerByToken(identifier);
    if (!customer) {
      customer = db.getCustomerByMobile(identifier);
    }

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found. Please register first.' });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

apiRouter.get('/customers/:token', (req, res) => {
  const customer = db.getCustomerByToken(req.params.token);
  if (!customer) {
    return res.status(404).json({ error: 'Customer profile not found' });
  }
  const orders = db.getOrdersByCustomer(customer.customerToken);
  res.json({
    customer,
    orders,
  });
});

// 4. ORDERS
apiRouter.get('/orders', (req, res) => {
  const customerToken = req.query.customerToken as string | undefined;
  if (!customerToken) {
    return res.status(400).json({ error: 'customerToken query parameter is required' });
  }
  const orders = db.getOrdersByCustomer(customerToken);
  res.json({ orders });
});

apiRouter.post('/orders', (req, res) => {
  try {
    const { customerToken, items, paymentMethod, mealPeriod, notes } = req.body;

    if (!customerToken) {
      return res.status(400).json({ error: 'Customer token is required to place an order' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one menu item must be ordered' });
    }

    const order = db.createOrder({
      customerToken,
      items,
      paymentMethod: paymentMethod || 'COUNTER_PAY',
      mealPeriod: mealPeriod || 'morning',
      notes,
    });

    res.status(201).json({
      success: true,
      message: `Order placed successfully! Your token is ${order.orderToken}`,
      order,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create order' });
  }
});

apiRouter.get('/orders/:idOrToken', (req, res) => {
  const param = req.params.idOrToken;
  let order = db.getOrderById(param);
  if (!order) {
    order = db.getOrderByToken(param);
  }
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

// Advance order status for testing / live demo (Received -> Preparing -> Ready -> Completed)
apiRouter.post('/orders/:id/advance', (req, res) => {
  try {
    const order = db.advanceOrderStatus(req.params.id);
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Failed to advance status' });
  }
});

apiRouter.patch('/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const order = db.updateOrderStatus(req.params.id, status);
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(404).json({ error: error.message || 'Failed to update status' });
  }
});
