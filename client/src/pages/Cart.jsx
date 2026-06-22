import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, localItems, cartItems, cartTotal, cartLoading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const handleUpdate = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    try {
      await updateItem(itemId, newQty);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (cartLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-icod-id="src_pages_cart_jsx_cd74">
        <div
          className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          data-icod-id="src_pages_cart_jsx_801d" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div
        className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4"
        data-icod-id="src_pages_cart_jsx_e586">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h2
          className="text-2xl font-bold text-gray-700 mb-2"
          data-icod-id="src_pages_cart_jsx_7284">Your cart is empty</h2>
        <p className="text-gray-500 mb-8" data-icod-id="src_pages_cart_jsx_4d7d">Start shopping to add products to your cart</p>
        <Link
          to="/shop"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-8"
      data-icod-id="src_pages_cart_jsx_8bb6">
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_cart_jsx_bea2">
        <h1
          className="text-3xl font-bold text-gray-900 mb-8"
          data-icod-id="src_pages_cart_jsx_29fe">Shopping Cart</h1>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          data-icod-id="src_pages_cart_jsx_17ec">
          {/* Cart Items */}
          <div
            className="lg:col-span-2 space-y-4"
            data-icod-id="src_pages_cart_jsx_a914">
            {cartItems.map((item, index) => {
              const product = item.product || item.productData;
              const variant = item.variant;
              const price = item.price || product?.discountPrice || product?.basePrice || 0;
              const itemId = item._id || index;

              return (
                <div
                  key={itemId}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4"
                  data-icod-id={`src_pages_cart_jsx_6807_${itemId}`}>
                  {/* Image */}
                  <div
                    className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100"
                    data-icod-id={`src_pages_cart_jsx_b9e5_${itemId}`}>
                    <img
                      src={getImageUrl(product?.images?.[0])}
                      alt={item.productName || product?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/80x80/6366F1/white?text=P'; }}
                      data-icod-id={`src_pages_cart_jsx_9797_${itemId}`} />
                  </div>
                  {/* Info */}
                  <div
                    className="flex-1 min-w-0"
                    data-icod-id={`src_pages_cart_jsx_b783_${itemId}`}>
                    <h3
                      className="font-semibold text-gray-800 text-sm line-clamp-2"
                      data-icod-id={`src_pages_cart_jsx_63b6_${itemId}`}>
                      {item.productName || product?.name}
                    </h3>
                    {(variant || item.variantLabel) && (
                      <p
                        className="text-xs text-gray-500 mt-0.5"
                        data-icod-id={`src_pages_cart_jsx_d1f3_${itemId}`}>
                        {variant?.label || item.variantLabel}
                      </p>
                    )}
                    <p
                      className="text-indigo-600 font-bold mt-1"
                      data-icod-id={`src_pages_cart_jsx_7430_${itemId}`}>{formatPrice(price)}</p>

                    <div
                      className="flex items-center gap-3 mt-2"
                      data-icod-id={`src_pages_cart_jsx_cb0d_${itemId}`}>
                      <div
                        className="flex items-center border border-gray-200 rounded-lg overflow-hidden"
                        data-icod-id={`src_pages_cart_jsx_be5a_${itemId}`}>
                        <button
                          onClick={() => handleUpdate(item._id, item.qty, -1)}
                          className="px-2.5 py-1 hover:bg-gray-50 transition-colors text-gray-600"
                          data-icod-id={`src_pages_cart_jsx_2e7a_${itemId}`}>
                          <Minus size={14} />
                        </button>
                        <span
                          className="px-3 py-1 text-sm font-medium border-x border-gray-200"
                          data-icod-id={`src_pages_cart_jsx_a452_${itemId}`}>{item.qty}</span>
                        <button
                          onClick={() => handleUpdate(item._id, item.qty, 1)}
                          className="px-2.5 py-1 hover:bg-gray-50 transition-colors text-gray-600"
                          data-icod-id={`src_pages_cart_jsx_69f5_${itemId}`}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item._id || index)}
                        className="text-red-400 hover:text-red-600 transition-colors"
                        data-icod-id={`src_pages_cart_jsx_f029_${itemId}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {/* Line Total */}
                  <div
                    className="text-right shrink-0"
                    data-icod-id={`src_pages_cart_jsx_f77d_${itemId}`}>
                    <p
                      className="font-bold text-gray-900"
                      data-icod-id={`src_pages_cart_jsx_47ef_${itemId}`}>{formatPrice(price * item.qty)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1" data-icod-id="src_pages_cart_jsx_eee5">
            <div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-20"
              data-icod-id="src_pages_cart_jsx_87e6">
              <h2
                className="text-lg font-bold text-gray-900 mb-4"
                data-icod-id="src_pages_cart_jsx_8cad">Order Summary</h2>

              <div className="space-y-2 text-sm mb-4" data-icod-id="src_pages_cart_jsx_0da5">
                <div
                  className="flex justify-between text-gray-600"
                  data-icod-id="src_pages_cart_jsx_14ba">
                  <span data-icod-id="src_pages_cart_jsx_3d70">Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span data-icod-id="src_pages_cart_jsx_f55f">{formatPrice(cartTotal)}</span>
                </div>
                <div
                  className="flex justify-between text-gray-600"
                  data-icod-id="src_pages_cart_jsx_5f92">
                  <span data-icod-id="src_pages_cart_jsx_1938">Delivery</span>
                  <span
                    className="text-green-600 font-medium"
                    data-icod-id="src_pages_cart_jsx_414b">Digital (Free)</span>
                </div>
              </div>

              <div
                className="border-t border-gray-100 pt-4 mb-6"
                data-icod-id="src_pages_cart_jsx_8493">
                <div
                  className="flex justify-between font-bold text-lg"
                  data-icod-id="src_pages_cart_jsx_5a1c">
                  <span data-icod-id="src_pages_cart_jsx_70e3">Total</span>
                  <span className="text-indigo-600" data-icod-id="src_pages_cart_jsx_5353">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
                data-icod-id="src_pages_cart_jsx_d679">
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <Link
                to="/shop"
                className="block text-center text-indigo-600 hover:text-indigo-700 text-sm mt-3 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
