import {
  createOrder,
  getOrderByNumber,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deliverCredentials,
  getDashboardStats,
} from '../services/orderService.js';
import { submitPayment } from '../services/orderService.js';

export async function placeOrder(req, res, next) {
  try {
    const { items, customerInfo, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order', statusCode: 400 });
    }
    const userId = req.user ? req.user._id : null;
    const order = await createOrder({ userId, items, customerInfo, paymentMethod });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function trackOrder(req, res, next) {
  try {
    const order = await getOrderByNumber(req.params.orderNumber);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function myOrders(req, res, next) {
  try {
    const orders = await getUserOrders(req.user._id);
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

export async function orderDetail(req, res, next) {
  try {
    const userId = req.user ? req.user._id : null;
    const order = await getOrderById(req.params.id, userId);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function submitOrderPayment(req, res, next) {
  try {
    const { orderId, transactionId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, error: 'orderId is required', statusCode: 400 });

    let screenshotUrl = '';
    if (req.file) screenshotUrl = `/uploads/${req.file.filename}`;

    const order = await submitPayment(orderId, { transactionId, screenshotUrl });
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminGetOrders(req, res, next) {
  try {
    const { status, page, limit, search } = req.query;
    const result = await getAllOrders({ status, page, limit, search });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function adminGetOrderById(req, res, next) {
  try {
    const order = await getOrderById(req.params.id, null);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status, req.admin._id);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminDeliverCredentials(req, res, next) {
  try {
    const { credentials, productId } = req.body;
    if (!credentials) return res.status(400).json({ success: false, error: 'credentials is required', statusCode: 400 });
    const order = await deliverCredentials(req.params.id, credentials, productId);
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function adminDashboard(req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}
