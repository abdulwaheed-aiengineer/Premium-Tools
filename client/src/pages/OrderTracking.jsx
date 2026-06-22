import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Copy, Check, Lock, Unlock } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice, getImageUrl, ORDER_STATUS_MAP } from '../utils/helpers';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import toast from 'react-hot-toast';

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (searchParams.get('order')) {
      handleSearch(searchParams.get('order'));
    }
  }, []);

  const handleSearch = async (num = orderNumber) => {
    if (!num.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await orderService.trackOrder(num.trim());
      setOrder(data);
    } catch {
      setOrder(null);
      toast.error('Order not found. Please check the order number.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (order?.credentials) {
      navigator.clipboard.writeText(order.credentials);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Credentials copied!');
    }
  };

  const statusInfo = order ? ORDER_STATUS_MAP[order.status] : null;

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-12"
      data-icod-id="src_pages_ordertracking_jsx_fee6">
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_ordertracking_jsx_ce41">
        <div
          className="text-center mb-10"
          data-icod-id="src_pages_ordertracking_jsx_323e">
          <h1
            className="text-3xl font-bold text-gray-900 mb-2"
            data-icod-id="src_pages_ordertracking_jsx_f7de">Track Your Order</h1>
          <p className="text-gray-500" data-icod-id="src_pages_ordertracking_jsx_fee9">Enter your order number to get the latest status</p>
        </div>

        {/* Search Box */}
        <div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
          data-icod-id="src_pages_ordertracking_jsx_5f41">
          <div className="flex gap-3" data-icod-id="src_pages_ordertracking_jsx_d09a">
            <div
              className="relative flex-1"
              data-icod-id="src_pages_ordertracking_jsx_d37b">
              <Package size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. PT-ABC123-XY45"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-icod-id="src_pages_ordertracking_jsx_b2ef" />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              data-icod-id="src_pages_ordertracking_jsx_0d6b">
              {loading ? (
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  data-icod-id="src_pages_ordertracking_jsx_45da" />
              ) : (
                <><Search size={18} /> Track</>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        {searched && !loading && !order && (
          <div
            className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100"
            data-icod-id="src_pages_ordertracking_jsx_8741">
            <div className="text-5xl mb-4" data-icod-id="src_pages_ordertracking_jsx_e5eb">😕</div>
            <h3
              className="text-xl font-semibold text-gray-700 mb-2"
              data-icod-id="src_pages_ordertracking_jsx_a074">Order Not Found</h3>
            <p className="text-gray-500" data-icod-id="src_pages_ordertracking_jsx_21e8">Please double-check your order number and try again.</p>
          </div>
        )}

        {order && (
          <div className="space-y-5" data-icod-id="src_pages_ordertracking_jsx_7ff3">
            {/* Status Card */}
            <div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              data-icod-id="src_pages_ordertracking_jsx_408a">
              <div
                className="flex items-start justify-between mb-4 flex-wrap gap-3"
                data-icod-id="src_pages_ordertracking_jsx_b055">
                <div data-icod-id="src_pages_ordertracking_jsx_9670">
                  <p
                    className="text-sm text-gray-500 mb-0.5"
                    data-icod-id="src_pages_ordertracking_jsx_7725">Order Number</p>
                  <p
                    className="font-bold text-gray-900 font-mono text-lg"
                    data-icod-id="src_pages_ordertracking_jsx_8cb2">{order.orderNumber}</p>
                </div>
                {statusInfo && (
                  <span
                    className={`text-sm font-semibold px-3 py-1.5 rounded-full ${statusInfo.color}`}
                    data-icod-id="src_pages_ordertracking_jsx_aea1">
                    {statusInfo.label}
                  </span>
                )}
              </div>

              <OrderStatusTimeline status={order.status} />

              <div
                className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm"
                data-icod-id="src_pages_ordertracking_jsx_988c">
                <div data-icod-id="src_pages_ordertracking_jsx_c21f">
                  <p
                    className="text-gray-500 text-xs mb-0.5"
                    data-icod-id="src_pages_ordertracking_jsx_92cb">Customer</p>
                  <p
                    className="font-semibold text-gray-800"
                    data-icod-id="src_pages_ordertracking_jsx_e8f0">{order.customerInfo?.name}</p>
                </div>
                <div data-icod-id="src_pages_ordertracking_jsx_8cc7">
                  <p
                    className="text-gray-500 text-xs mb-0.5"
                    data-icod-id="src_pages_ordertracking_jsx_321f">Payment</p>
                  <p
                    className="font-semibold text-gray-800 capitalize"
                    data-icod-id="src_pages_ordertracking_jsx_d527">{order.paymentMethod?.replace('_', ' ')}</p>
                </div>
                <div data-icod-id="src_pages_ordertracking_jsx_5de2">
                  <p
                    className="text-gray-500 text-xs mb-0.5"
                    data-icod-id="src_pages_ordertracking_jsx_cb10">Total</p>
                  <p
                    className="font-bold text-indigo-600"
                    data-icod-id="src_pages_ordertracking_jsx_7aee">{formatPrice(order.totalAmount)}</p>
                </div>
                <div data-icod-id="src_pages_ordertracking_jsx_570f">
                  <p
                    className="text-gray-500 text-xs mb-0.5"
                    data-icod-id="src_pages_ordertracking_jsx_a1c9">Placed on</p>
                  <p
                    className="font-semibold text-gray-800"
                    data-icod-id="src_pages_ordertracking_jsx_25ec">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                {order.transactionId && (
                  <div data-icod-id="src_pages_ordertracking_jsx_782d">
                    <p
                      className="text-gray-500 text-xs mb-0.5"
                      data-icod-id="src_pages_ordertracking_jsx_e35e">Transaction ID</p>
                    <p
                      className="font-mono text-xs text-gray-700"
                      data-icod-id="src_pages_ordertracking_jsx_1211">{order.transactionId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              data-icod-id="src_pages_ordertracking_jsx_8792">
              <h3
                className="font-bold text-gray-800 mb-4"
                data-icod-id="src_pages_ordertracking_jsx_5bb4">Ordered Items</h3>
              <div className="space-y-3" data-icod-id="src_pages_ordertracking_jsx_8925">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-center"
                    data-icod-id={`src_pages_ordertracking_jsx_6444_${i}`}>
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0"
                      data-icod-id={`src_pages_ordertracking_jsx_a96d_${i}`}>
                      <img
                        src={getImageUrl(item.productImage)}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://placehold.co/48x48/6366F1/white?text=P'; }}
                        data-icod-id={`src_pages_ordertracking_jsx_ad8d_${i}`} />
                    </div>
                    <div
                      className="flex-1 min-w-0"
                      data-icod-id={`src_pages_ordertracking_jsx_80c1_${i}`}>
                      <p
                        className="font-medium text-gray-800 text-sm line-clamp-1"
                        data-icod-id={`src_pages_ordertracking_jsx_a970_${i}`}>{item.productName}</p>
                      {item.variantLabel && (
                        <p
                          className="text-xs text-gray-500"
                          data-icod-id={`src_pages_ordertracking_jsx_2dcb_${i}`}>{item.variantLabel}</p>
                      )}
                    </div>
                    <div
                      className="text-right shrink-0 text-sm"
                      data-icod-id={`src_pages_ordertracking_jsx_3371_${i}`}>
                      <p
                        className="text-gray-500"
                        data-icod-id={`src_pages_ordertracking_jsx_e686_${i}`}>x{item.qty}</p>
                      <p
                        className="font-bold text-gray-800"
                        data-icod-id={`src_pages_ordertracking_jsx_b87e_${i}`}>{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold"
                data-icod-id="src_pages_ordertracking_jsx_4e76">
                <span data-icod-id="src_pages_ordertracking_jsx_9f69">Total</span>
                <span
                  className="text-indigo-600"
                  data-icod-id="src_pages_ordertracking_jsx_a53e">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            {/* Credentials Section */}
            <div
              className={`rounded-2xl p-6 shadow-sm border ${order.status === 'completed' && order.credentials ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
              data-icod-id="src_pages_ordertracking_jsx_de94">
              <div
                className="flex items-center gap-2 mb-3"
                data-icod-id="src_pages_ordertracking_jsx_2fa0">
                {order.status === 'completed' && order.credentials ? (
                  <Unlock size={20} className="text-green-600" />
                ) : (
                  <Lock size={20} className="text-gray-400" />
                )}
                <h3
                  className="font-bold text-gray-800"
                  data-icod-id="src_pages_ordertracking_jsx_7d1f">Digital Credentials</h3>
              </div>

              {order.status === 'completed' && order.credentials ? (
                <div data-icod-id="src_pages_ordertracking_jsx_f622">
                  <p
                    className="text-sm text-green-700 mb-3"
                    data-icod-id="src_pages_ordertracking_jsx_b2c0">Your credentials are ready! Please save them securely.</p>
                  <div
                    className="bg-white rounded-xl p-4 font-mono text-sm border border-green-200 whitespace-pre-wrap break-all"
                    data-icod-id="src_pages_ordertracking_jsx_921f">
                    {order.credentials}
                  </div>
                  <button
                    onClick={copyCredentials}
                    className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      copied ? 'bg-green-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    data-icod-id="src_pages_ordertracking_jsx_9acc">
                    {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Credentials</>}
                  </button>
                </div>
              ) : (
                <p
                  className="text-sm text-gray-500"
                  data-icod-id="src_pages_ordertracking_jsx_b9fb">
                  {order.status === 'pending_payment'
                    ? 'Please complete payment to proceed.'
                    : 'Your credentials will be delivered once payment is verified and processed.'}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
