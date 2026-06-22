import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Auth() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(registerForm.name, registerForm.email, registerForm.password, registerForm.phone);
      toast.success('Account created! Welcome aboard!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12"
      data-icod-id="src_pages_auth_jsx_c06d">
      <div className="w-full max-w-md" data-icod-id="src_pages_auth_jsx_15c5">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div
            className="bg-indigo-500 p-2 rounded-xl"
            data-icod-id="src_pages_auth_jsx_da35">
            <Zap size={24} className="text-white" />
          </div>
          <span
            className="font-bold text-2xl text-gray-900"
            data-icod-id="src_pages_auth_jsx_63df">Premium <span className="text-indigo-600" data-icod-id="src_pages_auth_jsx_aa8b">Tools</span></span>
        </Link>

        <div
          className="bg-white rounded-2xl shadow-md overflow-hidden"
          data-icod-id="src_pages_auth_jsx_c604">
          {/* Tabs */}
          <div
            className="flex border-b border-gray-100"
            data-icod-id="src_pages_auth_jsx_8261">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              data-icod-id="src_pages_auth_jsx_bd49">
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              data-icod-id="src_pages_auth_jsx_fbef">
              Register
            </button>
          </div>

          <div className="p-6" data-icod-id="src_pages_auth_jsx_87e2">
            {tab === 'login' ? (
              <form
                onSubmit={handleLogin}
                className="space-y-4"
                data-icod-id="src_pages_auth_jsx_301c">
                <h2
                  className="text-xl font-bold text-gray-800 mb-1"
                  data-icod-id="src_pages_auth_jsx_42cd">Welcome back!</h2>
                <p
                  className="text-gray-500 text-sm mb-4"
                  data-icod-id="src_pages_auth_jsx_7e74">Sign in to your account</p>

                <div data-icod-id="src_pages_auth_jsx_f27c">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_d15f">Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_auth_jsx_3ced" />
                </div>

                <div data-icod-id="src_pages_auth_jsx_3ab5">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_7906">Password</label>
                  <div className="relative" data-icod-id="src_pages_auth_jsx_57e4">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Your password"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-icod-id="src_pages_auth_jsx_a104" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-icod-id="src_pages_auth_jsx_0d4b">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-semibold transition-colors"
                  data-icod-id="src_pages_auth_jsx_0977">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div
                  className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 text-center"
                  data-icod-id="src_pages_auth_jsx_e124">
                  Demo: user@premiumtools.com / User@1234
                </div>
                <button
                  type="button"
                  onClick={() => setLoginForm({ email: 'user@premiumtools.com', password: 'User@1234' })}
                  className="w-full text-xs text-indigo-500 hover:text-indigo-600 underline"
                  data-icod-id="src_pages_auth_jsx_884d">
                  Fill demo credentials
                </button>

                <p
                  className="text-center text-sm text-gray-500"
                  data-icod-id="src_pages_auth_jsx_c464">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className="text-indigo-600 hover:underline font-medium"
                    data-icod-id="src_pages_auth_jsx_d18e">
                    Register
                  </button>
                </p>
              </form>
            ) : (
              <form
                onSubmit={handleRegister}
                className="space-y-4"
                data-icod-id="src_pages_auth_jsx_045b">
                <h2
                  className="text-xl font-bold text-gray-800 mb-1"
                  data-icod-id="src_pages_auth_jsx_84db">Create Account</h2>
                <p
                  className="text-gray-500 text-sm mb-4"
                  data-icod-id="src_pages_auth_jsx_fb3e">Join Premium Tools today</p>

                <div data-icod-id="src_pages_auth_jsx_b0fb">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_2ee3">Full Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_auth_jsx_400b" />
                </div>

                <div data-icod-id="src_pages_auth_jsx_6bc8">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_76a0">Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_auth_jsx_f531" />
                </div>

                <div data-icod-id="src_pages_auth_jsx_f9e8">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_3bfb">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="03XXXXXXXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_auth_jsx_ca2d" />
                </div>

                <div data-icod-id="src_pages_auth_jsx_fad1">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_fcc5">Password</label>
                  <div className="relative" data-icod-id="src_pages_auth_jsx_22d6">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      data-icod-id="src_pages_auth_jsx_a1da" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      data-icod-id="src_pages_auth_jsx_c940">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div data-icod-id="src_pages_auth_jsx_9ac0">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_auth_jsx_7d1d">Confirm Password</label>
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat your password"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_auth_jsx_3cc8" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-semibold transition-colors"
                  data-icod-id="src_pages_auth_jsx_693f">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p
                  className="text-center text-sm text-gray-500"
                  data-icod-id="src_pages_auth_jsx_ae7f">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-indigo-600 hover:underline font-medium"
                    data-icod-id="src_pages_auth_jsx_e139">
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 text-center" data-icod-id="src_pages_auth_jsx_admin_link">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            data-icod-id="src_pages_auth_jsx_admin_link_a">
            <Shield size={12} />
            Admin panel access
          </Link>
        </div>
      </div>
    </div>
  );
}
