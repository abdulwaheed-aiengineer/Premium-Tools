import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Upload, CreditCard, User, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

const PAYMENT_INFO = {
  easypaisa: {
    name: 'Easypaisa',
    icon: '📱',
    accountName: 'Premium Tools Store',
    accountNumber: '03001234567',
    instructions: 'Open your Easypaisa app and send payment to this number. Take a screenshot of the successful transaction.',
  },
  jazzcash: {
    name: 'JazzCash',
    icon: '💳',
    accountName: 'Premium Tools Store',
    accountNumber: '03117654321',
    instructions: 'Open your JazzCash app and send payment to this number. Take a screenshot of the successful transaction.',
  },
  bank_transfer: {
    name: 'Bank Transfer',
    icon: '🏦',
    bankName: 'Meezan Bank',
    accountName: 'Premium Tools Store',
    iban: 'PK12MEZN0001234567890123',
    instructions: 'Transfer the exact amount to this bank account. Upload the bank transfer receipt as a screenshot.',
  },
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('easypaisa');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (cartItems.length === 0 && !placedOrder) {
    navigate('/cart');
    return null;
  }

  const handleInfoChange = (e) => {
    setCustomerInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handlePlaceOrder = async () => {
    if (!transactionId && !screenshot) {
      toast.error('Please provide a transaction ID or upload a screenshot');
      return;
    }
    setLoading(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item.product?._id || item.productId,
        productName: item.product?.name || item.productData?.name || item.productName,
        productSlug: item.product?.slug || item.productData?.slug || '',
        productImage: item.product?.images?.[0] || item.productData?.images?.[0] || '',
        variantId: item.variant?._id || item.variantId || null,
        variantLabel: item.variant?.label || item.variantLabel || '',
        qty: item.qty,
        price: item.price || item.productData?.discountPrice || item.productData?.basePrice || 0,
      }));

      const order = await orderService.createOrder({
        items,
        customerInfo,
        paymentMethod,
      });

      if (screenshot || transactionId) {
        await orderService.submitPayment(order._id, transactionId, screenshot);
      }

      setPlacedOrder(order);
      await clearCart();
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ num, label, active, done }) => (
    <div
      className="flex flex-col items-center"
      data-icod-id="src_pages_checkout_jsx_4d13">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
          done ? 'bg-green-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}
        data-icod-id="src_pages_checkout_jsx_8f38">
        {done ? <Check size={16} /> : num}
      </div>
      <span
        className={`text-xs mt-1 font-medium ${active ? 'text-indigo-600' : 'text-gray-400'}`}
        data-icod-id="src_pages_checkout_jsx_7d99">{label}</span>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-8"
      data-icod-id="src_pages_checkout_jsx_9b19">
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_checkout_jsx_77ec">
        <h1
          className="text-3xl font-bold text-gray-900 mb-8 text-center"
          data-icod-id="src_pages_checkout_jsx_3c66">Checkout</h1>

        {/* Step Indicators */}
        {step < 4 && (
          <div
            className="flex items-center justify-center gap-4 mb-8"
            data-icod-id="src_pages_checkout_jsx_4a7d">
            <StepIndicator num={1} label="Your Info" active={step === 1} done={step > 1} />
            <div
              className={`flex-1 max-w-16 h-0.5 ${step > 1 ? 'bg-green-400' : 'bg-gray-200'}`}
              data-icod-id="src_pages_checkout_jsx_757e" />
            <StepIndicator num={2} label="Payment" active={step === 2} done={step > 2} />
            <div
              className={`flex-1 max-w-16 h-0.5 ${step > 2 ? 'bg-green-400' : 'bg-gray-200'}`}
              data-icod-id="src_pages_checkout_jsx_708f" />
            <StepIndicator num={3} label="Confirm" active={step === 3} done={step > 3} />
          </div>
        )}

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          data-icod-id="src_pages_checkout_jsx_ecb2">
          {/* Main Content */}
          <div className="lg:col-span-2" data-icod-id="src_pages_checkout_jsx_be5e">
            {/* Step 1: Customer Info */}
            {step === 1 && (
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                data-icod-id="src_pages_checkout_jsx_db0d">
                <div
                  className="flex items-center gap-2 mb-5"
                  data-icod-id="src_pages_checkout_jsx_da43">
                  <User size={20} className="text-indigo-500" />
                  <h2
                    className="text-lg font-bold text-gray-800"
                    data-icod-id="src_pages_checkout_jsx_c265">Your Information</h2>
                </div>
                <div className="space-y-4" data-icod-id="src_pages_checkout_jsx_50bf">
                  <div data-icod-id="src_pages_checkout_jsx_f009">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_checkout_jsx_9a00">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInfoChange}
                      placeholder="Enter your full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      data-icod-id="src_pages_checkout_jsx_8edb" />
                  </div>
                  <div data-icod-id="src_pages_checkout_jsx_38a3">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_checkout_jsx_1cc8">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInfoChange}
                      placeholder="your@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      data-icod-id="src_pages_checkout_jsx_8a9c" />
                  </div>
                  <div data-icod-id="src_pages_checkout_jsx_7eb0">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_checkout_jsx_2fba">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInfoChange}
                      placeholder="03XXXXXXXXX"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      data-icod-id="src_pages_checkout_jsx_0e52" />
                  </div>
                  <div data-icod-id="src_pages_checkout_jsx_74ba">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_checkout_jsx_6fc8">Order Notes (Optional)</label>
                    <textarea
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleInfoChange}
                      placeholder="Any special instructions..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      data-icod-id="src_pages_checkout_jsx_17c2" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
                      toast.error('Please fill in all required fields');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  data-icod-id="src_pages_checkout_jsx_d8bd">
                  Continue to Payment <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                data-icod-id="src_pages_checkout_jsx_00e0">
                <div
                  className="flex items-center gap-2 mb-5"
                  data-icod-id="src_pages_checkout_jsx_a89d">
                  <CreditCard size={20} className="text-indigo-500" />
                  <h2
                    className="text-lg font-bold text-gray-800"
                    data-icod-id="src_pages_checkout_jsx_c1ea">Select Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6" data-icod-id="src_pages_checkout_jsx_33a3">
                  {Object.entries(PAYMENT_INFO).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setPaymentMethod(key)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === key
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200'
                      }`}
                      data-icod-id={`src_pages_checkout_jsx_1dbb_${key}`}>
                      <span className="text-2xl" data-icod-id={`src_pages_checkout_jsx_6090_${key}`}>{info.icon}</span>
                      <span
                        className="font-semibold text-gray-800"
                        data-icod-id={`src_pages_checkout_jsx_59eb_${key}`}>{info.name}</span>
                      {paymentMethod === key && (
                        <Check size={18} className="ml-auto text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Payment Instructions */}
                {paymentMethod && (
                  <div
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5"
                    data-icod-id="src_pages_checkout_jsx_6616">
                    <p
                      className="text-sm font-semibold text-amber-800 mb-2"
                      data-icod-id="src_pages_checkout_jsx_db34">Payment Instructions</p>
                    <p
                      className="text-sm text-amber-700 mb-3"
                      data-icod-id="src_pages_checkout_jsx_6f86">{PAYMENT_INFO[paymentMethod].instructions}</p>
                    <div
                      className="space-y-1.5 text-sm"
                      data-icod-id="src_pages_checkout_jsx_fd83">
                      {PAYMENT_INFO[paymentMethod].bankName && (
                        <div
                          className="flex justify-between"
                          data-icod-id="src_pages_checkout_jsx_e8e5">
                          <span className="text-amber-700" data-icod-id="src_pages_checkout_jsx_e9a2">Bank:</span>
                          <span
                            className="font-semibold text-amber-900"
                            data-icod-id="src_pages_checkout_jsx_4b4c">{PAYMENT_INFO[paymentMethod].bankName}</span>
                        </div>
                      )}
                      <div
                        className="flex justify-between"
                        data-icod-id="src_pages_checkout_jsx_ed27">
                        <span className="text-amber-700" data-icod-id="src_pages_checkout_jsx_06fb">Account Name:</span>
                        <span
                          className="font-semibold text-amber-900"
                          data-icod-id="src_pages_checkout_jsx_75c5">{PAYMENT_INFO[paymentMethod].accountName}</span>
                      </div>
                      <div
                        className="flex justify-between"
                        data-icod-id="src_pages_checkout_jsx_500e">
                        <span className="text-amber-700" data-icod-id="src_pages_checkout_jsx_c955">{PAYMENT_INFO[paymentMethod].iban ? 'IBAN:' : 'Account Number:'}</span>
                        <span
                          className="font-semibold text-amber-900 font-mono"
                          data-icod-id="src_pages_checkout_jsx_ad90">
                          {PAYMENT_INFO[paymentMethod].iban || PAYMENT_INFO[paymentMethod].accountNumber}
                        </span>
                      </div>
                      <div
                        className="flex justify-between text-base font-bold pt-1 border-t border-amber-200"
                        data-icod-id="src_pages_checkout_jsx_d008">
                        <span className="text-amber-800" data-icod-id="src_pages_checkout_jsx_5ed7">Amount to Pay:</span>
                        <span className="text-amber-900" data-icod-id="src_pages_checkout_jsx_ade0">{formatPrice(cartTotal)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3" data-icod-id="src_pages_checkout_jsx_be72">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    data-icod-id="src_pages_checkout_jsx_5c8b">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    data-icod-id="src_pages_checkout_jsx_05c2">
                    Continue <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Proof */}
            {step === 3 && (
              <div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                data-icod-id="src_pages_checkout_jsx_7691">
                <div
                  className="flex items-center gap-2 mb-5"
                  data-icod-id="src_pages_checkout_jsx_4677">
                  <Upload size={20} className="text-indigo-500" />
                  <h2
                    className="text-lg font-bold text-gray-800"
                    data-icod-id="src_pages_checkout_jsx_3142">Upload Payment Proof</h2>
                </div>

                <div className="space-y-4 mb-5" data-icod-id="src_pages_checkout_jsx_92b2">
                  <div data-icod-id="src_pages_checkout_jsx_0022">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_checkout_jsx_fc06">Transaction ID</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction/reference ID"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-icod-id="src_pages_checkout_jsx_c6f2" />
                  </div>

                  <div data-icod-id="src_pages_checkout_jsx_e10e">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_checkout_jsx_d0f9">Payment Screenshot</label>
                    <label
                      className="block border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-6 cursor-pointer text-center transition-colors"
                      data-icod-id="src_pages_checkout_jsx_223d">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleScreenshotChange}
                        className="hidden"
                        data-icod-id="src_pages_checkout_jsx_5bec" />
                      {screenshotPreview ? (
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="max-h-40 mx-auto rounded-lg object-contain"
                          data-icod-id="src_pages_checkout_jsx_42ab" />
                      ) : (
                        <div data-icod-id="src_pages_checkout_jsx_40db">
                          <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                          <p
                            className="text-sm text-gray-500"
                            data-icod-id="src_pages_checkout_jsx_5739">Click to upload screenshot</p>
                          <p
                            className="text-xs text-gray-400 mt-1"
                            data-icod-id="src_pages_checkout_jsx_0387">JPG, PNG, WEBP up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3" data-icod-id="src_pages_checkout_jsx_478a">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    data-icod-id="src_pages_checkout_jsx_eb12">
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    data-icod-id="src_pages_checkout_jsx_3693">
                    {loading ? (
                      <div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        data-icod-id="src_pages_checkout_jsx_abf6" />
                    ) : (
                      <>
                        <Check size={18} />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && placedOrder && (
              <div
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center"
                data-icod-id="src_pages_checkout_jsx_0a4d">
                <div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  data-icod-id="src_pages_checkout_jsx_c88a">
                  <Check size={32} className="text-green-500" />
                </div>
                <h2
                  className="text-2xl font-bold text-gray-900 mb-2"
                  data-icod-id="src_pages_checkout_jsx_ae4c">Order Placed!</h2>
                <p className="text-gray-500 mb-4" data-icod-id="src_pages_checkout_jsx_94c9">
                  Your order has been received. We'll verify your payment and deliver your credentials.
                </p>
                <div
                  className="bg-gray-50 rounded-xl p-4 mb-6"
                  data-icod-id="src_pages_checkout_jsx_c413">
                  <p
                    className="text-sm text-gray-500"
                    data-icod-id="src_pages_checkout_jsx_de92">Order Number</p>
                  <p
                    className="text-2xl font-bold text-indigo-600 font-mono"
                    data-icod-id="src_pages_checkout_jsx_ffec">{placedOrder.orderNumber}</p>
                </div>
                <p
                  className="text-sm text-gray-500 mb-6"
                  data-icod-id="src_pages_checkout_jsx_4452">
                  Save this order number to track your order status.
                </p>
                <button
                  onClick={() => navigate(`/track?order=${placedOrder.orderNumber}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  data-icod-id="src_pages_checkout_jsx_74d5">
                  Track Your Order
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step < 4 && (
            <div className="lg:col-span-1" data-icod-id="src_pages_checkout_jsx_a40c">
              <div
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20"
                data-icod-id="src_pages_checkout_jsx_bd95">
                <h3
                  className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider"
                  data-icod-id="src_pages_checkout_jsx_676f">Order Summary</h3>
                <div
                  className="space-y-3 max-h-64 overflow-y-auto mb-4"
                  data-icod-id="src_pages_checkout_jsx_21c3">
                  {cartItems.map((item, i) => {
                    const product = item.product || item.productData;
                    const price = item.price || product?.discountPrice || product?.basePrice || 0;
                    return (
                      <div
                        key={i}
                        className="flex gap-3 text-sm"
                        data-icod-id={`src_pages_checkout_jsx_7cb3_${i}`}>
                        <div
                          className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                          data-icod-id={`src_pages_checkout_jsx_2423_${i}`}>
                          <img
                            src={getImageUrl(product?.images?.[0])}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://placehold.co/40x40/6366F1/white?text=P'; }}
                            data-icod-id={`src_pages_checkout_jsx_dbc4_${i}`} />
                        </div>
                        <div
                          className="flex-1 min-w-0"
                          data-icod-id={`src_pages_checkout_jsx_d399_${i}`}>
                          <p
                            className="font-medium text-gray-800 line-clamp-1"
                            data-icod-id={`src_pages_checkout_jsx_2d5b_${i}`}>{item.productName || product?.name}</p>
                          <p
                            className="text-gray-500 text-xs"
                            data-icod-id={`src_pages_checkout_jsx_f4ce_${i}`}>x{item.qty}</p>
                        </div>
                        <span
                          className="font-semibold text-gray-800 shrink-0"
                          data-icod-id={`src_pages_checkout_jsx_c4a3_${i}`}>{formatPrice(price * item.qty)}</span>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="border-t border-gray-100 pt-3"
                  data-icod-id="src_pages_checkout_jsx_ee72">
                  <div
                    className="flex justify-between font-bold"
                    data-icod-id="src_pages_checkout_jsx_ea2a">
                    <span data-icod-id="src_pages_checkout_jsx_7a88">Total</span>
                    <span className="text-indigo-600" data-icod-id="src_pages_checkout_jsx_8e69">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
