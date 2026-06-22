import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Zap } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { loginAdmin, admin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (admin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(form.email, form.password);
      toast.success('Welcome to Admin Panel!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4"
      data-icod-id="src_pages_admin_adminlogin_jsx_b1b4">
      <div
        className="w-full max-w-md"
        data-icod-id="src_pages_admin_adminlogin_jsx_7506">
        <div
          className="text-center mb-8"
          data-icod-id="src_pages_admin_adminlogin_jsx_2175">
          <div
            className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full mb-4"
            data-icod-id="src_pages_admin_adminlogin_jsx_05a4">
            <Shield size={18} />
            Admin Access
          </div>
          <div
            className="flex items-center justify-center gap-2 mb-2"
            data-icod-id="src_pages_admin_adminlogin_jsx_c674">
            <div
              className="bg-indigo-500 p-2 rounded-xl"
              data-icod-id="src_pages_admin_adminlogin_jsx_ce8a">
              <Zap size={24} className="text-white" />
            </div>
            <span
              className="text-white font-bold text-2xl"
              data-icod-id="src_pages_admin_adminlogin_jsx_39ef">Premium <span
              className="text-indigo-400"
              data-icod-id="src_pages_admin_adminlogin_jsx_2d71">Tools</span></span>
          </div>
          <p
            className="text-gray-400 text-sm"
            data-icod-id="src_pages_admin_adminlogin_jsx_fd98">Sign in to access the admin panel</p>
        </div>

        <div
          className="bg-[#1E293B] rounded-2xl p-6 border border-gray-700"
          data-icod-id="src_pages_admin_adminlogin_jsx_b697">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-icod-id="src_pages_admin_adminlogin_jsx_28a9">
            <div data-icod-id="src_pages_admin_adminlogin_jsx_d4ad">
              <label
                className="block text-sm font-medium text-gray-300 mb-1"
                data-icod-id="src_pages_admin_adminlogin_jsx_e9e9">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@premiumtools.com"
                required
                className="w-full bg-[#0F172A] border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                data-icod-id="src_pages_admin_adminlogin_jsx_df43" />
            </div>
            <div data-icod-id="src_pages_admin_adminlogin_jsx_ce89">
              <label
                className="block text-sm font-medium text-gray-300 mb-1"
                data-icod-id="src_pages_admin_adminlogin_jsx_1464">Password</label>
              <div className="relative" data-icod-id="src_pages_admin_adminlogin_jsx_88ea">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Your password"
                  required
                  className="w-full bg-[#0F172A] border border-gray-600 rounded-xl px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
                  data-icod-id="src_pages_admin_adminlogin_jsx_9b47" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  data-icod-id="src_pages_admin_adminlogin_jsx_54d8">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div
              className="text-xs text-gray-500 bg-[#0F172A] rounded-lg p-3"
              data-icod-id="src_pages_admin_adminlogin_jsx_a53a">
              Demo: admin@premiumtools.com / Admin@1234
            </div>

            <button
              type="button"
              onClick={() => setForm({ email: 'admin@premiumtools.com', password: 'Admin@1234' })}
              className="w-full text-xs text-indigo-400 hover:text-indigo-300 underline text-left mt-1"
              data-icod-id="src_pages_admin_adminlogin_jsx_a05a">
              Fill demo credentials
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white py-3 rounded-xl font-semibold transition-colors"
              data-icod-id="src_pages_admin_adminlogin_jsx_a05a">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
