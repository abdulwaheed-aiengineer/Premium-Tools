import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Mail, Phone, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="bg-[#0F172A] text-gray-400"
      data-icod-id="src_components_footer_jsx_89bd">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        data-icod-id="src_components_footer_jsx_f8a3">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          data-icod-id="src_components_footer_jsx_5b91">
          {/* Brand */}
          <div
            className="col-span-1 md:col-span-2"
            data-icod-id="src_components_footer_jsx_e147">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div
                className="bg-indigo-500 p-1.5 rounded-lg"
                data-icod-id="src_components_footer_jsx_a024">
                <Zap size={18} className="text-white" />
              </div>
              <span
                className="text-white font-bold text-lg"
                data-icod-id="src_components_footer_jsx_6aeb">Premium <span className="text-indigo-400" data-icod-id="src_components_footer_jsx_2d4a">Tools</span></span>
            </Link>
            <p
              className="text-sm leading-relaxed mb-4 max-w-xs"
              data-icod-id="src_components_footer_jsx_17dd">
              Your trusted marketplace for digital products — AI tools, streaming subscriptions, VPNs, software keys, and more. Instant delivery, secure payments.
            </p>
            <div
              className="flex items-center gap-3"
              data-icod-id="src_components_footer_jsx_df95">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-green-400 hover:text-green-300 text-sm transition-colors"
                data-icod-id="src_components_footer_jsx_6fef">
                <MessageCircle size={16} />
                WhatsApp Support
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div data-icod-id="src_components_footer_jsx_c507">
            <h3
              className="text-white font-semibold mb-4 text-sm uppercase tracking-wider"
              data-icod-id="src_components_footer_jsx_849b">Quick Links</h3>
            <ul
              className="space-y-2 text-sm"
              data-icod-id="src_components_footer_jsx_b972">
              <li data-icod-id="src_components_footer_jsx_0bbc"><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li data-icod-id="src_components_footer_jsx_e705"><Link to="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li data-icod-id="src_components_footer_jsx_73e8"><Link to="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li data-icod-id="src_components_footer_jsx_1a3a"><Link to="/auth" className="hover:text-white transition-colors">Login / Register</Link></li>
              <li data-icod-id="src_components_footer_jsx_ce87"><Link to="/dashboard" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div data-icod-id="src_components_footer_jsx_e02a">
            <h3
              className="text-white font-semibold mb-4 text-sm uppercase tracking-wider"
              data-icod-id="src_components_footer_jsx_6204">Policies</h3>
            <ul
              className="space-y-2 text-sm"
              data-icod-id="src_components_footer_jsx_e89b">
              <li data-icod-id="src_components_footer_jsx_0b36"><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li data-icod-id="src_components_footer_jsx_8c5b"><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li data-icod-id="src_components_footer_jsx_4ac8"><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li data-icod-id="src_components_footer_jsx_9dd4"><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li data-icod-id="src_components_footer_jsx_c4c6"><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li data-icod-id="src_components_footer_jsx_28ae"><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div
          className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          data-icod-id="src_components_footer_jsx_d5c9">
          <p className="text-xs" data-icod-id="src_components_footer_jsx_352c">© {new Date().getFullYear()} Premium Tools. All rights reserved.</p>
          <div
            className="flex items-center gap-4 text-xs"
            data-icod-id="src_components_footer_jsx_4347">
            <span
              className="flex items-center gap-1"
              data-icod-id="src_components_footer_jsx_b59e"><Mail size={12} /> support@premiumtools.pk</span>
            <span
              className="flex items-center gap-1"
              data-icod-id="src_components_footer_jsx_8afa"><Phone size={12} /> +92 300 1234567</span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors"
              data-icod-id="src_components_footer_jsx_admin">
              <Shield size={12} /> Admin
            </Link>
          </div>
        </div>
      </div>
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923001234567"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-3.5 rounded-full shadow-xl z-50 transition-transform hover:scale-110"
        title="Chat on WhatsApp"
        data-icod-id="src_components_footer_jsx_5570">
        <MessageCircle size={24} />
      </a>
    </footer>
  );
}
