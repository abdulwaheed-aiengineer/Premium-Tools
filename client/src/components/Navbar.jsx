import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Zap, ChevronDown, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Track Order', to: '/track' },
  ];

  return (
    <nav
      className="bg-[#0F172A] text-white sticky top-0 z-50 shadow-lg"
      data-icod-id="src_components_navbar_jsx_2550">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_components_navbar_jsx_c57f">
        <div
          className="flex items-center justify-between h-16"
          data-icod-id="src_components_navbar_jsx_72fe">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div
              className="bg-indigo-500 p-1.5 rounded-lg"
              data-icod-id="src_components_navbar_jsx_127c">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white" data-icod-id="src_components_navbar_jsx_20c8">Premium <span className="text-indigo-400" data-icod-id="src_components_navbar_jsx_1137">Tools</span></span>
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex items-center gap-6"
            data-icod-id="src_components_navbar_jsx_a356">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div
            className="flex items-center gap-3"
            data-icod-id="src_components_navbar_jsx_d9ae">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                  data-icod-id="src_components_navbar_jsx_2bec">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" data-icod-id="src_components_navbar_jsx_8ed6">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  data-icod-id="src_components_navbar_jsx_c6fd">
                  <User size={16} />
                  <span className="hidden sm:block" data-icod-id="src_components_navbar_jsx_d490">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50"
                    data-icod-id="src_components_navbar_jsx_9a3d">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm w-full"
                      data-icod-id="src_components_navbar_jsx_0843">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-icod-id="src_components_navbar_jsx_6b56">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden bg-[#1E293B] border-t border-gray-700"
          data-icod-id="src_components_navbar_jsx_6e71">
          <div
            className="px-4 py-3 space-y-1"
            data-icod-id="src_components_navbar_jsx_2063">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-gray-300 hover:text-white text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* Overlay for user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
          data-icod-id="src_components_navbar_jsx_5a5d" />
      )}
    </nav>
  );
}
