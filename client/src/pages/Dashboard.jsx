import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, User, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import { formatPrice, ORDER_STATUS_MAP } from '../utils/helpers';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (tab === 'orders') {
      loadOrders();
    }
  }, [tab]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadOrderDetail = async (id) => {
    try {
      const data = await orderService.getOrderById(id);
      setSelectedOrder(data);
    } catch {
      toast.error('Failed to load order details');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile(profileForm.name, profileForm.phone);
      updateUser(updated);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: <Package size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'security', label: 'Security', icon: <Lock size={16} /> },
  ];

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-8"
      data-icod-id="src_pages_dashboard_jsx_2b37">
      <div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_dashboard_jsx_7fe1">
        {/* Header */}
        <div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          data-icod-id="src_pages_dashboard_jsx_4838">
          <div
            className="flex items-center gap-4"
            data-icod-id="src_pages_dashboard_jsx_998e">
            <div
              className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl"
              data-icod-id="src_pages_dashboard_jsx_05db">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div data-icod-id="src_pages_dashboard_jsx_fed5">
              <h1
                className="text-xl font-bold text-gray-900"
                data-icod-id="src_pages_dashboard_jsx_82b7">{user?.name}</h1>
              <p
                className="text-gray-500 text-sm"
                data-icod-id="src_pages_dashboard_jsx_6c0c">{user?.email}</p>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          data-icod-id="src_pages_dashboard_jsx_3400">
          {/* Sidebar */}
          <div className="lg:col-span-1" data-icod-id="src_pages_dashboard_jsx_a704">
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              data-icod-id="src_pages_dashboard_jsx_e2e3">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setSelectedOrder(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors text-left ${
                    tab === t.id ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  data-icod-id={`src_pages_dashboard_jsx_2b21_${t.id}`}>
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3" data-icod-id="src_pages_dashboard_jsx_56ee">
            {/* Orders */}
            {tab === 'orders' && (
              <div data-icod-id="src_pages_dashboard_jsx_5784">
                {selectedOrder ? (
                  <div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    data-icod-id="src_pages_dashboard_jsx_729f">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-indigo-600 text-sm font-medium mb-4 flex items-center gap-1 hover:underline"
                      data-icod-id="src_pages_dashboard_jsx_58d7">
                      ← Back to Orders
                    </button>
                    <div
                      className="flex items-center justify-between mb-4 flex-wrap gap-3"
                      data-icod-id="src_pages_dashboard_jsx_9108">
                      <div data-icod-id="src_pages_dashboard_jsx_8909">
                        <p
                          className="text-sm text-gray-500"
                          data-icod-id="src_pages_dashboard_jsx_aff4">Order Number</p>
                        <p
                          className="font-mono font-bold text-gray-900"
                          data-icod-id="src_pages_dashboard_jsx_3f9f">{selectedOrder.orderNumber}</p>
                      </div>
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${ORDER_STATUS_MAP[selectedOrder.status]?.color}`}
                        data-icod-id="src_pages_dashboard_jsx_225d">
                        {ORDER_STATUS_MAP[selectedOrder.status]?.label}
                      </span>
                    </div>

                    <div className="mb-6" data-icod-id="src_pages_dashboard_jsx_96b7">
                      <OrderStatusTimeline status={selectedOrder.status} />
                    </div>

                    {/* Items */}
                    <div className="space-y-3 mb-4" data-icod-id="src_pages_dashboard_jsx_472c">
                      {selectedOrder.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm py-2 border-b border-gray-50"
                          data-icod-id={`src_pages_dashboard_jsx_fcac_${i}`}>
                          <div data-icod-id={`src_pages_dashboard_jsx_aad1_${i}`}>
                            <p
                              className="font-medium text-gray-800"
                              data-icod-id={`src_pages_dashboard_jsx_483a_${i}`}>{item.productName}</p>
                            {item.variantLabel && <p
                              className="text-xs text-gray-500"
                              data-icod-id={`src_pages_dashboard_jsx_85a9_${i}`}>{item.variantLabel}</p>}
                            <p
                              className="text-xs text-gray-500"
                              data-icod-id={`src_pages_dashboard_jsx_ee42_${i}`}>x{item.qty}</p>
                          </div>
                          <p
                            className="font-bold text-gray-800"
                            data-icod-id={`src_pages_dashboard_jsx_6f8b_${i}`}>{formatPrice(item.price * item.qty)}</p>
                        </div>
                      ))}
                      <div
                        className="flex justify-between font-bold pt-1"
                        data-icod-id="src_pages_dashboard_jsx_3f77">
                        <span data-icod-id="src_pages_dashboard_jsx_8bbd">Total</span>
                        <span className="text-indigo-600" data-icod-id="src_pages_dashboard_jsx_ea63">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Credentials */}
                    {selectedOrder.status === 'completed' && selectedOrder.credentials && (
                      <div
                        className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4"
                        data-icod-id="src_pages_dashboard_jsx_657f">
                        <p
                          className="text-sm font-semibold text-green-700 mb-2"
                          data-icod-id="src_pages_dashboard_jsx_5a77">Your Digital Credentials</p>
                        <div
                          className="bg-white rounded-lg p-3 font-mono text-sm whitespace-pre-wrap break-all border border-green-100"
                          data-icod-id="src_pages_dashboard_jsx_565f">
                          {selectedOrder.credentials}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="bg-white rounded-2xl shadow-sm border border-gray-100"
                    data-icod-id="src_pages_dashboard_jsx_6788">
                    <div
                      className="p-4 border-b border-gray-100"
                      data-icod-id="src_pages_dashboard_jsx_e384">
                      <h2
                        className="font-bold text-gray-800"
                        data-icod-id="src_pages_dashboard_jsx_a198">My Orders</h2>
                    </div>
                    {loadingOrders ? (
                      <div className="p-8 text-center" data-icod-id="src_pages_dashboard_jsx_73c9">
                        <div
                          className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
                          data-icod-id="src_pages_dashboard_jsx_5ed3" />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="p-8 text-center" data-icod-id="src_pages_dashboard_jsx_5d59">
                        <Package size={40} className="text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500" data-icod-id="src_pages_dashboard_jsx_83a4">No orders yet</p>
                        <Link to="/shop" className="text-indigo-600 text-sm hover:underline mt-2 block">
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div
                        className="divide-y divide-gray-50"
                        data-icod-id="src_pages_dashboard_jsx_ded2">
                        {orders.map((order) => (
                          <button
                            key={order._id}
                            onClick={() => loadOrderDetail(order._id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                            data-icod-id={`src_pages_dashboard_jsx_5807_${order._id}`}>
                            <div data-icod-id={`src_pages_dashboard_jsx_78bf_${order._id}`}>
                              <p
                                className="font-mono text-sm font-bold text-gray-800"
                                data-icod-id={`src_pages_dashboard_jsx_91fa_${order._id}`}>{order.orderNumber}</p>
                              <p
                                className="text-xs text-gray-500 mt-0.5"
                                data-icod-id={`src_pages_dashboard_jsx_4d04_${order._id}`}>{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length} item(s)</p>
                            </div>
                            <div
                              className="flex items-center gap-3"
                              data-icod-id={`src_pages_dashboard_jsx_163f_${order._id}`}>
                              <div
                                className="text-right"
                                data-icod-id={`src_pages_dashboard_jsx_3063_${order._id}`}>
                                <p
                                  className="font-bold text-gray-900 text-sm"
                                  data-icod-id={`src_pages_dashboard_jsx_699a_${order._id}`}>{formatPrice(order.totalAmount)}</p>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_MAP[order.status]?.color}`}
                                  data-icod-id={`src_pages_dashboard_jsx_d434_${order._id}`}>
                                  {ORDER_STATUS_MAP[order.status]?.label}
                                </span>
                              </div>
                              <ChevronRight size={16} className="text-gray-400" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {tab === 'profile' && (
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                data-icod-id="src_pages_dashboard_jsx_ac9f">
                <h2
                  className="font-bold text-gray-800 mb-5"
                  data-icod-id="src_pages_dashboard_jsx_98e9">Profile Settings</h2>
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-4"
                  data-icod-id="src_pages_dashboard_jsx_380d">
                  <div data-icod-id="src_pages_dashboard_jsx_3a17">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_dashboard_jsx_68a6">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-icod-id="src_pages_dashboard_jsx_7125" />
                  </div>
                  <div data-icod-id="src_pages_dashboard_jsx_aa20">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_dashboard_jsx_0890">Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                      data-icod-id="src_pages_dashboard_jsx_9fb1" />
                  </div>
                  <div data-icod-id="src_pages_dashboard_jsx_06a6">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_dashboard_jsx_9a6c">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-icod-id="src_pages_dashboard_jsx_7706" />
                  </div>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    data-icod-id="src_pages_dashboard_jsx_7d8e">
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security */}
            {tab === 'security' && (
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                data-icod-id="src_pages_dashboard_jsx_2562">
                <h2
                  className="font-bold text-gray-800 mb-5"
                  data-icod-id="src_pages_dashboard_jsx_8ac6">Change Password</h2>
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-4"
                  data-icod-id="src_pages_dashboard_jsx_2a5f">
                  <div data-icod-id="src_pages_dashboard_jsx_a1a1">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_dashboard_jsx_3219">Current Password</label>
                    <div className="relative" data-icod-id="src_pages_dashboard_jsx_b9e8">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        data-icod-id="src_pages_dashboard_jsx_cfef" />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        data-icod-id="src_pages_dashboard_jsx_8532">
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div data-icod-id="src_pages_dashboard_jsx_aa15">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_dashboard_jsx_0754">New Password</label>
                    <div className="relative" data-icod-id="src_pages_dashboard_jsx_a1c5">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        data-icod-id="src_pages_dashboard_jsx_3b6b" />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        data-icod-id="src_pages_dashboard_jsx_af1c">
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div data-icod-id="src_pages_dashboard_jsx_e77a">
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      data-icod-id="src_pages_dashboard_jsx_9d2c">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-icod-id="src_pages_dashboard_jsx_db8a" />
                  </div>
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    data-icod-id="src_pages_dashboard_jsx_5472">
                    {savingPassword ? 'Saving...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
