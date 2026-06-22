import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import DigitalCredentials from '../models/DigitalCredentials.js';
import Cart from '../models/Cart.js';

export async function createOrder({ userId, items, customerInfo, paymentMethod }) {
  let totalAmount = 0;
  const orderItems = items.map((item) => {
    totalAmount += item.price * item.qty;
    return {
      productId: item.productId,
      productName: item.productName,
      productSlug: item.productSlug || '',
      productImage: item.productImage || '',
      variantId: item.variantId || null,
      variantLabel: item.variantLabel || '',
      qty: item.qty,
      price: item.price,
    };
  });

  const order = await Order.create({
    user: userId || null,
    items: orderItems,
    totalAmount,
    customerInfo,
    paymentMethod,
    status: 'pending_payment',
  });

  if (userId) {
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
  }

  return order;
}

export async function getOrderByNumber(orderNumber) {
  const order = await Order.findOne({ orderNumber })
    .populate('user', 'name email');

  if (!order) throw new Error('Order not found');

  const result = order.toObject();

  if (order.status === 'completed') {
    const creds = await DigitalCredentials.findOne({ order: order._id });
    if (creds) {
      result.credentials = creds.credentials;
    }
  }

  return result;
}

export async function getUserOrders(userId) {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders;
}

export async function getOrderById(orderId, userId) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  if (userId && order.user && order.user.toString() !== userId.toString()) {
    throw new Error('Access denied');
  }

  const result = order.toObject();

  if (order.status === 'completed') {
    const creds = await DigitalCredentials.findOne({ order: order._id });
    if (creds) {
      result.credentials = creds.credentials;
      if (!creds.revealedAt) {
        await DigitalCredentials.findByIdAndUpdate(creds._id, { revealedAt: new Date() });
      }
    }
  }

  return result;
}

export async function submitPayment(orderId, { transactionId, screenshotUrl }) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  order.paymentScreenshot = screenshotUrl;
  order.transactionId = transactionId || '';
  order.status = 'payment_submitted';
  await order.save();

  await Payment.create({
    order: orderId,
    method: order.paymentMethod,
    transactionId: transactionId || '',
    screenshotUrl,
    status: 'pending',
  });

  return order;
}

export async function getAllOrders({ status, page = 1, limit = 20, search }) {
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'customerInfo.name': { $regex: search, $options: 'i' } },
      { 'customerInfo.email': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
}

export async function updateOrderStatus(orderId, status, adminId) {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true }
  );
  if (!order) throw new Error('Order not found');

  if (status === 'under_verification' || status === 'paid_processing') {
    await Payment.findOneAndUpdate(
      { order: orderId },
      { $set: { status: 'verified', verifiedAt: new Date(), verifiedBy: adminId } }
    );
  }

  return order;
}

export async function deliverCredentials(orderId, credentials, productId) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  await DigitalCredentials.findOneAndUpdate(
    { order: orderId },
    { $set: { order: orderId, product: productId, credentials, revealedAt: null } },
    { upsert: true, new: true }
  );

  order.credentialsDelivered = true;
  order.status = 'completed';
  await order.save();

  return order;
}

export async function getDashboardStats() {
  const [totalOrders, pendingOrders, completedOrders, totalSalesResult, recentOrders] =
    await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['pending_payment', 'payment_submitted', 'under_verification', 'paid_processing'] } }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
    ]);

  const totalSales = totalSalesResult[0]?.total || 0;
  return { totalOrders, pendingOrders, completedOrders, totalSales, recentOrders };
}
