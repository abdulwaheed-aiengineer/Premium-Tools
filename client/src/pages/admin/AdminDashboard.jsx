import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { adminOrderService } from '../../services/adminService';
import { formatPrice, ORDER_STATUS_MAP } from '../../utils/helpers';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminOrderService.getDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingCart size={22} />, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-200' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: <Clock size={22} />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
        { label: 'Completed', value: stats.completedOrders, icon: <CheckCircle size={22} />, color: 'bg-green-50 text-green-600', border: 'border-green-200' },
        { label: 'Total Sales', value: formatPrice(stats.totalSales), icon: <DollarSign size={22} />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
      ]
    : [];

  return (
    <div data-icod-id="src_pages_admin_admindashboard_jsx_ffb5">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_admindashboard_jsx_b7cd">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_admindashboard_jsx_6222">Dashboard</h1>
      </div>
      {loading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          data-icod-id="src_pages_admin_admindashboard_jsx_08f0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-28 animate-pulse"
              data-icod-id={`src_pages_admin_admindashboard_jsx_da45_${i}`} />
          ))}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            data-icod-id="src_pages_admin_admindashboard_jsx_db27">
            {kpis.map((kpi, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-5 border ${kpi.border} shadow-sm`}
                data-icod-id={`src_pages_admin_admindashboard_jsx_3bbb_${i}`}>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}
                  data-icod-id={`src_pages_admin_admindashboard_jsx_09cf_${i}`}>
                  {kpi.icon}
                </div>
                <p
                  className="text-2xl font-bold text-gray-900"
                  data-icod-id={`src_pages_admin_admindashboard_jsx_f1e2_${i}`}>{kpi.value}</p>
                <p
                  className="text-sm text-gray-500 mt-0.5"
                  data-icod-id={`src_pages_admin_admindashboard_jsx_f631_${i}`}>{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
            data-icod-id="src_pages_admin_admindashboard_jsx_da3c">
            <div
              className="flex items-center justify-between p-5 border-b border-gray-100"
              data-icod-id="src_pages_admin_admindashboard_jsx_f881">
              <h2
                className="font-bold text-gray-800"
                data-icod-id="src_pages_admin_admindashboard_jsx_b54f">Recent Orders</h2>
              <Link to="/admin/orders" className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div
              className="overflow-x-auto"
              data-icod-id="src_pages_admin_admindashboard_jsx_dcaf">
              <table className="w-full" data-icod-id="src_pages_admin_admindashboard_jsx_9c73">
                <thead data-icod-id="src_pages_admin_admindashboard_jsx_9531">
                  <tr
                    className="text-xs text-gray-500 border-b border-gray-50"
                    data-icod-id="src_pages_admin_admindashboard_jsx_5443">
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_admindashboard_jsx_58bf">Order #</th>
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_admindashboard_jsx_075c">Customer</th>
                    <th
                      className="text-left px-5 py-3 font-semibold hidden sm:table-cell"
                      data-icod-id="src_pages_admin_admindashboard_jsx_4d29">Date</th>
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_admindashboard_jsx_1546">Total</th>
                    <th
                      className="text-left px-5 py-3 font-semibold"
                      data-icod-id="src_pages_admin_admindashboard_jsx_065f">Status</th>
                  </tr>
                </thead>
                <tbody data-icod-id="src_pages_admin_admindashboard_jsx_7050">
                  {stats?.recentOrders?.length === 0 ? (
                    <tr data-icod-id="src_pages_admin_admindashboard_jsx_e96a">
                      <td
                        colSpan={5}
                        className="text-center text-gray-400 py-8"
                        data-icod-id="src_pages_admin_admindashboard_jsx_975a">No orders yet</td>
                    </tr>
                  ) : (
                    stats?.recentOrders?.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        data-icod-id={`src_pages_admin_admindashboard_jsx_ba5b_${order._id}`}>
                        <td
                          className="px-5 py-3"
                          data-icod-id={`src_pages_admin_admindashboard_jsx_2628_${order._id}`}>
                          <Link to={`/admin/orders/${order._id}`} className="font-mono text-sm text-indigo-600 hover:underline">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td
                          className="px-5 py-3"
                          data-icod-id={`src_pages_admin_admindashboard_jsx_7fa9_${order._id}`}>
                          <p
                            className="text-sm font-medium text-gray-800"
                            data-icod-id={`src_pages_admin_admindashboard_jsx_1dc5_${order._id}`}>{order.customerInfo?.name}</p>
                          <p
                            className="text-xs text-gray-500"
                            data-icod-id={`src_pages_admin_admindashboard_jsx_d289_${order._id}`}>{order.customerInfo?.email}</p>
                        </td>
                        <td
                          className="px-5 py-3 text-sm text-gray-600 hidden sm:table-cell"
                          data-icod-id={`src_pages_admin_admindashboard_jsx_2841_${order._id}`}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          className="px-5 py-3 text-sm font-bold text-gray-800"
                          data-icod-id={`src_pages_admin_admindashboard_jsx_4f93_${order._id}`}>
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td
                          className="px-5 py-3"
                          data-icod-id={`src_pages_admin_admindashboard_jsx_22eb_${order._id}`}>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${ORDER_STATUS_MAP[order.status]?.color}`}
                            data-icod-id={`src_pages_admin_admindashboard_jsx_86cd_${order._id}`}>
                            {ORDER_STATUS_MAP[order.status]?.label}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
