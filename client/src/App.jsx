import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Auth from './pages/Auth';
import StaticPage from './pages/StaticPage';

// User Dashboard
import Dashboard from './pages/Dashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanners from './pages/admin/AdminBanners';
import AdminPages from './pages/admin/AdminPages';
import AdminUsers from './pages/admin/AdminUsers';

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen" data-icod-id="src_app_jsx_e900">
      <Navbar />
      <main className="flex-1" data-icod-id="src_app_jsx_cf5f">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                },
              }}
            />
            <Routes>
              {/* Public routes with Navbar + Footer */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <Home />
                  </PublicLayout>
                }
              />
              <Route
                path="/shop"
                element={
                  <PublicLayout>
                    <Shop />
                  </PublicLayout>
                }
              />
              <Route
                path="/products/:slug"
                element={
                  <PublicLayout>
                    <ProductDetail />
                  </PublicLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <PublicLayout>
                    <Cart />
                  </PublicLayout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PublicLayout>
                    <Checkout />
                  </PublicLayout>
                }
              />
              <Route
                path="/track"
                element={
                  <PublicLayout>
                    <OrderTracking />
                  </PublicLayout>
                }
              />
              <Route path="/auth" element={<Auth />} />

              {/* Static pages */}
              <Route
                path="/about"
                element={
                  <PublicLayout>
                    <StaticPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/faqs"
                element={
                  <PublicLayout>
                    <StaticPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PublicLayout>
                    <StaticPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/terms"
                element={
                  <PublicLayout>
                    <StaticPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/refund"
                element={
                  <PublicLayout>
                    <StaticPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <PublicLayout>
                    <StaticPage />
                  </PublicLayout>
                }
              />

              {/* Protected User Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PublicLayout>
                      <Dashboard />
                    </PublicLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Panel (protected) */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminCategories />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminProducts />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminOrders />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders/:id"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminOrders />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/banners"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminBanners />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/pages"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminPages />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />

              {/* 404 catch-all */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <div
                      className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]"
                      data-icod-id="src_app_jsx_b56d">
                      <div className="text-6xl mb-4" data-icod-id="src_app_jsx_5c54">404</div>
                      <h1
                        className="text-2xl font-bold text-gray-800 mb-2"
                        data-icod-id="src_app_jsx_f899">Page Not Found</h1>
                      <a
                        href="/"
                        className="text-indigo-600 hover:underline mt-2"
                        data-icod-id="src_app_jsx_dec2">Go Home</a>
                    </div>
                  </PublicLayout>
                }
              />
            </Routes>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
