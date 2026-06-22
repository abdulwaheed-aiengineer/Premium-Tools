import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, X, Check, Send, ChevronLeft, ExternalLink } from 'lucide-react';
import { adminOrderService } from '../../services/adminService';
import { formatPrice, ORDER_STATUS_MAP, getImageUrl } from '../../utils/helpers';
import OrderStatusTimeline from '../../components/OrderStatusTimeline';
import toast from 'react-hot-toast';

const ALL_STATUSES = [
  'pending_payment', 'payment_submitted', 'under_verification', 'paid_processing',
  'completed', 'rejected', 'cancelled', 'refunded',
];

export default function AdminOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [credentials, setCredentials] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingCreds, setSavingCreds] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  useEffect(() => {
    if (id) {
      loadOrderDetail(id);
    } else {
      setSelectedOrder(null);
    }
  }, [id]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminOrderService.getOrders({ page, limit: 15, status: filterStatus, search });
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDetail = async (orderId) => {
    try {
      const data = await adminOrderService.getOrderById(orderId);
      setSelectedOrder(data);
      setCredentials(data.credentials || '');
    } catch {
      toast.error('Order not found');
      navigate('/admin/orders');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;
    setSavingStatus(true);
    try {
      const updated = await adminOrderService.updateStatus(selectedOrder._id, newStatus);
      setSelectedOrder((p) => ({ ...p, status: updated.status }));
      toast.success(`Status updated to: ${ORDER_STATUS_MAP[newStatus]?.label}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeliverCredentials = async () => {
    if (!credentials.trim()) {
      toast.error('Please enter credentials');
      return;
    }
    setSavingCreds(true);
    try {
      const productId = selectedOrder.items?.[0]?.productId;
      await adminOrderService.deliverCredentials(selectedOrder._id, credentials, productId);
      setSelectedOrder((p) => ({ ...p, status: 'completed', credentialsDelivered: true, credentials }));
      toast.success('Credentials delivered! Order marked as completed.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to deliver credentials');
    } finally {
      setSavingCreds(false);
    }
  };

  if (selectedOrder) {
    return (
      <div data-icod-id="src_pages_admin_adminorders_jsx_0ced">
        <button
          onClick={() => { setSelectedOrder(null); navigate('/admin/orders'); }}
          className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-4 hover:underline"
          data-icod-id="src_pages_admin_adminorders_jsx_34d2">
          <ChevronLeft size={16} /> Back to Orders
        </button>
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-icod-id="src_pages_admin_adminorders_jsx_addc">
          {/* Order Details */}
          <div
            className="lg:col-span-2 space-y-4"
            data-icod-id="src_pages_admin_adminorders_jsx_4c70">
            {/* Status */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              data-icod-id="src_pages_admin_adminorders_jsx_b4e8">
              <div
                className="flex items-center justify-between mb-4 flex-wrap gap-2"
                data-icod-id="src_pages_admin_adminorders_jsx_ffe9">
                <div data-icod-id="src_pages_admin_adminorders_jsx_15f1">
                  <p
                    className="text-sm text-gray-500"
                    data-icod-id="src_pages_admin_adminorders_jsx_582d">Order Number</p>
                  <p
                    className="font-mono font-bold text-gray-900 text-lg"
                    data-icod-id="src_pages_admin_adminorders_jsx_4f59">{selectedOrder.orderNumber}</p>
                </div>
                <span
                  className={`text-sm px-3 py-1.5 rounded-full font-medium ${ORDER_STATUS_MAP[selectedOrder.status]?.color}`}
                  data-icod-id="src_pages_admin_adminorders_jsx_7c80">
                  {ORDER_STATUS_MAP[selectedOrder.status]?.label}
                </span>
              </div>
              <OrderStatusTimeline status={selectedOrder.status} />
            </div>

            {/* Customer Info */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              data-icod-id="src_pages_admin_adminorders_jsx_b0a1">
              <h3
                className="font-bold text-gray-800 mb-3"
                data-icod-id="src_pages_admin_adminorders_jsx_ea7e">Customer Information</h3>
              <div
                className="grid grid-cols-2 gap-4 text-sm"
                data-icod-id="src_pages_admin_adminorders_jsx_7d0a">
                {[['Name', selectedOrder.customerInfo?.name], ['Email', selectedOrder.customerInfo?.email], ['Phone', selectedOrder.customerInfo?.phone], ['Payment', selectedOrder.paymentMethod?.replace('_', ' ')], ['Transaction ID', selectedOrder.transactionId || '—'], ['Placed', new Date(selectedOrder.createdAt).toLocaleString()]].map(([label, value]) => (
                  <div
                    key={label}
                    data-icod-id={`src_pages_admin_adminorders_jsx_dd65_${label}`}>
                    <p
                      className="text-gray-400 text-xs"
                      data-icod-id={`src_pages_admin_adminorders_jsx_a587_${label}`}>{label}</p>
                    <p
                      className="font-medium text-gray-800 capitalize"
                      data-icod-id={`src_pages_admin_adminorders_jsx_a302_${label}`}>{value}</p>
                  </div>
                ))}
                {selectedOrder.customerInfo?.notes && (
                  <div
                    className="col-span-2"
                    data-icod-id="src_pages_admin_adminorders_jsx_7f8d">
                    <p
                      className="text-gray-400 text-xs"
                      data-icod-id="src_pages_admin_adminorders_jsx_e6ef">Notes</p>
                    <p
                      className="text-gray-800"
                      data-icod-id="src_pages_admin_adminorders_jsx_b821">{selectedOrder.customerInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Screenshot */}
            {selectedOrder.paymentScreenshot && (
              <div
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                data-icod-id="src_pages_admin_adminorders_jsx_287f">
                <h3
                  className="font-bold text-gray-800 mb-3"
                  data-icod-id="src_pages_admin_adminorders_jsx_7c3c">Payment Screenshot</h3>
                <img
                  src={getImageUrl(selectedOrder.paymentScreenshot)}
                  alt="Payment screenshot"
                  className="max-h-72 rounded-xl object-contain border border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  data-icod-id="src_pages_admin_adminorders_jsx_b05a" />
                <a
                  href={getImageUrl(selectedOrder.paymentScreenshot)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 text-sm flex items-center gap-1 mt-2 hover:underline"
                  data-icod-id="src_pages_admin_adminorders_jsx_51ae">
                  <ExternalLink size={14} /> View Full Size
                </a>
              </div>
            )}

            {/* Order Items */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              data-icod-id="src_pages_admin_adminorders_jsx_77dc">
              <h3
                className="font-bold text-gray-800 mb-3"
                data-icod-id="src_pages_admin_adminorders_jsx_54b7">Order Items</h3>
              <div className="space-y-3" data-icod-id="src_pages_admin_adminorders_jsx_512a">
                {selectedOrder.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3"
                    data-icod-id={`src_pages_admin_adminorders_jsx_f582_${i}`}>
                    <div
                      className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden"
                      data-icod-id={`src_pages_admin_adminorders_jsx_24ce_${i}`}>
                      <img
                        src={getImageUrl(item.productImage)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/40x40/6366F1/white?text=P'; }}
                        data-icod-id={`src_pages_admin_adminorders_jsx_c989_${i}`} />
                    </div>
                    <div
                      className="flex-1"
                      data-icod-id={`src_pages_admin_adminorders_jsx_cbca_${i}`}>
                      <p
                        className="text-sm font-medium text-gray-800"
                        data-icod-id={`src_pages_admin_adminorders_jsx_629f_${i}`}>{item.productName}</p>
                      {item.variantLabel && <p
                        className="text-xs text-gray-500"
                        data-icod-id={`src_pages_admin_adminorders_jsx_c619_${i}`}>{item.variantLabel}</p>}
                    </div>
                    <div
                      className="text-right text-sm"
                      data-icod-id={`src_pages_admin_adminorders_jsx_1a81_${i}`}>
                      <p
                        className="text-gray-500"
                        data-icod-id={`src_pages_admin_adminorders_jsx_2f2d_${i}`}>x{item.qty}</p>
                      <p
                        className="font-bold"
                        data-icod-id={`src_pages_admin_adminorders_jsx_1e0c_${i}`}>{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
                <div
                  className="border-t border-gray-100 pt-2 flex justify-between font-bold"
                  data-icod-id="src_pages_admin_adminorders_jsx_5d54">
                  <span data-icod-id="src_pages_admin_adminorders_jsx_d733">Total</span>
                  <span
                    className="text-indigo-600"
                    data-icod-id="src_pages_admin_adminorders_jsx_39b0">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="space-y-4" data-icod-id="src_pages_admin_adminorders_jsx_6af4">
            {/* Status Control */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              data-icod-id="src_pages_admin_adminorders_jsx_27c7">
              <h3
                className="font-bold text-gray-800 mb-3"
                data-icod-id="src_pages_admin_adminorders_jsx_0777">Update Status</h3>
              <div className="space-y-2" data-icod-id="src_pages_admin_adminorders_jsx_f7e1">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(s)}
                    disabled={savingStatus || selectedOrder.status === s}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                      selectedOrder.status === s
                        ? `${ORDER_STATUS_MAP[s]?.color} border-current`
                        : 'border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                    data-icod-id={`src_pages_admin_adminorders_jsx_e838_${s}`}>
                    {selectedOrder.status === s && <Check size={14} className="inline mr-1.5" />}
                    {ORDER_STATUS_MAP[s]?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              data-icod-id="src_pages_admin_adminorders_jsx_85b9">
              <h3
                className="font-bold text-gray-800 mb-3"
                data-icod-id="src_pages_admin_adminorders_jsx_a584">Deliver Credentials</h3>
              {selectedOrder.credentialsDelivered && (
                <div
                  className="mb-3 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg"
                  data-icod-id="src_pages_admin_adminorders_jsx_951d">
                  ✓ Credentials already delivered
                </div>
              )}
              <textarea
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                placeholder="Enter login credentials, keys, or JSON..."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                data-icod-id="src_pages_admin_adminorders_jsx_aed7" />
              <button
                onClick={handleDeliverCredentials}
                disabled={savingCreds}
                className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                data-icod-id="src_pages_admin_adminorders_jsx_1945">
                {savingCreds ? (
                  <div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    data-icod-id="src_pages_admin_adminorders_jsx_bd14" />
                ) : (
                  <><Send size={16} /> Deliver & Complete Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-icod-id="src_pages_admin_adminorders_jsx_5c81">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_adminorders_jsx_9e82">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_adminorders_jsx_8c55">Orders <span
          className="text-gray-400 text-lg font-normal"
          data-icod-id="src_pages_admin_adminorders_jsx_d8c6">({total})</span></h1>
      </div>
      {/* Filters */}
      <div
        className="flex flex-col sm:flex-row gap-3 mb-5"
        data-icod-id="src_pages_admin_adminorders_jsx_9e3c">
        <form
          onSubmit={handleSearch}
          className="flex gap-2 flex-1"
          data-icod-id="src_pages_admin_adminorders_jsx_870f">
          <div
            className="relative flex-1"
            data-icod-id="src_pages_admin_adminorders_jsx_ebff">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order # or customer..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              data-icod-id="src_pages_admin_adminorders_jsx_0190" />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700"
            data-icod-id="src_pages_admin_adminorders_jsx_1246">Search</button>
        </form>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-icod-id="src_pages_admin_adminorders_jsx_30a6">
          <option value="" data-icod-id="src_pages_admin_adminorders_jsx_dce3">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option
              key={s}
              value={s}
              data-icod-id={`src_pages_admin_adminorders_jsx_43d8_${s}`}>{ORDER_STATUS_MAP[s]?.label}</option>
          ))}
        </select>
      </div>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        data-icod-id="src_pages_admin_adminorders_jsx_a938">
        {loading ? (
          <div
            className="p-8 text-center"
            data-icod-id="src_pages_admin_adminorders_jsx_1fcd"><div
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
            data-icod-id="src_pages_admin_adminorders_jsx_28a3" /></div>
        ) : (
          <>
            <div
              className="overflow-x-auto"
              data-icod-id="src_pages_admin_adminorders_jsx_10cb">
              <table className="w-full" data-icod-id="src_pages_admin_adminorders_jsx_009e">
                <thead data-icod-id="src_pages_admin_adminorders_jsx_2e43">
                  <tr
                    className="text-xs text-gray-500 border-b border-gray-100"
                    data-icod-id="src_pages_admin_adminorders_jsx_b88f">
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_adminorders_jsx_97eb">Order</th>
                    <th
                      className="text-left px-5 py-3 font-semibold hidden sm:table-cell"
                      data-icod-id="src_pages_admin_adminorders_jsx_6b39">Customer</th>
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_adminorders_jsx_5af0">Total</th>
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_adminorders_jsx_ed3a">Status</th>
                    <th
                      className="text-left px-5 py-3 font-semibold hidden md:table-cell"
                      data-icod-id="src_pages_admin_adminorders_jsx_7f4d">Date</th>
                  </tr>
                </thead>
                <tbody data-icod-id="src_pages_admin_adminorders_jsx_6c22">
                  {orders.length === 0 ? (
                    <tr data-icod-id="src_pages_admin_adminorders_jsx_1029"><td
                      colSpan={5}
                      className="text-center text-gray-400 py-8"
                      data-icod-id="src_pages_admin_adminorders_jsx_39f2">No orders found</td></tr>
                  ) : orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                      data-icod-id={`src_pages_admin_adminorders_jsx_c32f_${order._id}`}>
                      <td
                        className="px-5 py-3"
                        data-icod-id={`src_pages_admin_adminorders_jsx_aa7a_${order._id}`}>
                        <p
                          className="font-mono text-sm font-bold text-indigo-600"
                          data-icod-id={`src_pages_admin_adminorders_jsx_9c05_${order._id}`}>{order.orderNumber}</p>
                        <p
                          className="text-xs text-gray-500 capitalize"
                          data-icod-id={`src_pages_admin_adminorders_jsx_46ac_${order._id}`}>{order.paymentMethod?.replace('_', ' ')}</p>
                      </td>
                      <td
                        className="px-5 py-3 hidden sm:table-cell"
                        data-icod-id={`src_pages_admin_adminorders_jsx_5ee1_${order._id}`}>
                        <p
                          className="text-sm font-medium text-gray-800"
                          data-icod-id={`src_pages_admin_adminorders_jsx_413e_${order._id}`}>{order.customerInfo?.name}</p>
                        <p
                          className="text-xs text-gray-500"
                          data-icod-id={`src_pages_admin_adminorders_jsx_a968_${order._id}`}>{order.customerInfo?.email}</p>
                      </td>
                      <td
                        className="px-5 py-3 font-bold text-gray-800 text-sm"
                        data-icod-id={`src_pages_admin_adminorders_jsx_80b4_${order._id}`}>{formatPrice(order.totalAmount)}</td>
                      <td
                        className="px-5 py-3"
                        data-icod-id={`src_pages_admin_adminorders_jsx_01f6_${order._id}`}>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${ORDER_STATUS_MAP[order.status]?.color}`}
                          data-icod-id={`src_pages_admin_adminorders_jsx_4cc5_${order._id}`}>
                          {ORDER_STATUS_MAP[order.status]?.label}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell"
                        data-icod-id={`src_pages_admin_adminorders_jsx_e74b_${order._id}`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="flex items-center justify-between p-4 border-t border-gray-100"
              data-icod-id="src_pages_admin_adminorders_jsx_c652">
              <p
                className="text-sm text-gray-500"
                data-icod-id="src_pages_admin_adminorders_jsx_e37c">{total} total</p>
              <div
                className="flex gap-2"
                data-icod-id="src_pages_admin_adminorders_jsx_2af8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminorders_jsx_90ad">Prev</button>
                <button
                  disabled={page * 15 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminorders_jsx_2f1c">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
