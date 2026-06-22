import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Image, FileText, Users, LogOut, Menu, X, Zap, ChevronRight
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { to: '/admin/categories', label: 'Categories', icon: <FolderOpen size={18} /> },
  { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
  { to: '/admin/banners', label: 'Banners', icon: <Image size={18} /> },
  { to: '/admin/pages', label: 'Pages', icon: <FileText size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
];

export default function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const SidebarContent = () => (
    <>
      <div
        className="flex items-center gap-2 px-5 py-4 border-b border-gray-700"
        data-icod-id="src_components_adminlayout_jsx_00b1">
        <div
          className="bg-indigo-500 p-1.5 rounded-lg"
          data-icod-id="src_components_adminlayout_jsx_3444">
          <Zap size={18} className="text-white" />
        </div>
        <span
          className="text-white font-bold"
          data-icod-id="src_components_adminlayout_jsx_2e7f">Admin Panel</span>
      </div>

      <nav
        className="flex-1 py-4 overflow-y-auto"
        data-icod-id="src_components_adminlayout_jsx_e3c0">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
              isActive(item.to, item.exact)
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            {item.icon}
            {item.label}
            {isActive(item.to, item.exact) && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        ))}
      </nav>

      <div
        className="border-t border-gray-700 p-4"
        data-icod-id="src_components_adminlayout_jsx_3ed5">
        <div className="mb-3" data-icod-id="src_components_adminlayout_jsx_6050">
          <p
            className="text-white text-sm font-medium"
            data-icod-id="src_components_adminlayout_jsx_08bf">{admin?.name}</p>
          <p
            className="text-gray-400 text-xs capitalize"
            data-icod-id="src_components_adminlayout_jsx_2426">{admin?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors w-full"
          data-icod-id="src_components_adminlayout_jsx_526d">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div
      className="flex h-screen bg-[#F8FAFC] overflow-hidden"
      data-icod-id="src_components_adminlayout_jsx_4ea1">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-56 bg-[#0F172A] shrink-0"
        data-icod-id="src_components_adminlayout_jsx_b5d3">
        <SidebarContent />
      </aside>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          data-icod-id="src_components_adminlayout_jsx_1c47">
          <div
            className="bg-black/50 absolute inset-0"
            onClick={() => setSidebarOpen(false)}
            data-icod-id="src_components_adminlayout_jsx_a0c5" />
          <aside
            className="relative w-56 bg-[#0F172A] flex flex-col z-50"
            data-icod-id="src_components_adminlayout_jsx_d38c">
            <SidebarContent />
          </aside>
        </div>
      )}
      {/* Main Area */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        data-icod-id="src_components_adminlayout_jsx_3831">
        {/* Top Bar */}
        <header
          className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0"
          data-icod-id="src_components_adminlayout_jsx_42c4">
          <div
            className="flex items-center gap-3"
            data-icod-id="src_components_adminlayout_jsx_2eff">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
              data-icod-id="src_components_adminlayout_jsx_f73f">
              <Menu size={22} />
            </button>
            <h1
              className="font-semibold text-gray-800 text-sm hidden sm:block"
              data-icod-id="src_components_adminlayout_jsx_4d7b">
              Premium Tools — Admin
            </h1>
          </div>
          <div
            className="flex items-center gap-3"
            data-icod-id="src_components_adminlayout_jsx_5fdc">
            <Link to="/" target="_blank" className="text-sm text-indigo-600 hover:underline">
              View Store
            </Link>
            <div
              className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm"
              data-icod-id="src_components_adminlayout_jsx_8668">
              {admin?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          data-icod-id="src_components_adminlayout_jsx_d055">
          {children}
        </main>
      </div>
    </div>
  );
}
