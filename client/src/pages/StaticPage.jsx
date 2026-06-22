import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';

const DEFAULT_CONTENT = {
  about: {
    title: 'About Premium Tools',
    content: `<h2>Welcome to Premium Tools</h2>
<p>Premium Tools is Pakistan's leading digital marketplace for premium subscriptions, software licenses, AI tools, and streaming services. We offer genuine, verified digital products at competitive prices.</p>
<h3>Our Mission</h3>
<p>To provide affordable access to premium digital tools and services for individuals and businesses across Pakistan and beyond.</p>
<h3>Why Choose Us?</h3>
<ul>
  <li>Instant delivery after payment verification</li>
  <li>Verified and genuine products</li>
  <li>24/7 customer support</li>
  <li>Competitive pricing</li>
  <li>Secure payment handling</li>
</ul>`,
  },
  faqs: {
    title: 'Frequently Asked Questions',
    content: `<h2>FAQs</h2>
<h3>How long does delivery take?</h3>
<p>Most orders are delivered within 1-6 hours after payment verification. During peak hours, it may take slightly longer.</p>
<h3>What payment methods do you accept?</h3>
<p>We accept Easypaisa, JazzCash, and Bank Transfer. All payments are manual screenshot-based.</p>
<h3>How do I track my order?</h3>
<p>Visit the <a href="/track">Track Order</a> page and enter your order number. You'll see the real-time status of your order.</p>
<h3>What if I don't receive my credentials?</h3>
<p>Contact us via WhatsApp with your order number. Our team responds within 30 minutes.</p>
<h3>Do you offer refunds?</h3>
<p>Yes, we offer refunds in case of delivery issues. See our Refund Policy for details.</p>`,
  },
  privacy: {
    title: 'Privacy Policy',
    content: `<h2>Privacy Policy</h2>
<p>Last updated: ${new Date().getFullYear()}</p>
<p>Premium Tools ("we", "our", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
<h3>Information We Collect</h3>
<p>We collect name, email, phone number, and order information when you make a purchase.</p>
<h3>How We Use Your Information</h3>
<p>Your information is used solely to process orders and provide customer support. We never sell your data to third parties.</p>`,
  },
  terms: {
    title: 'Terms & Conditions',
    content: `<h2>Terms & Conditions</h2>
<p>By using Premium Tools, you agree to these terms.</p>
<h3>Products</h3>
<p>All products are digital and non-transferable. Credentials are for personal use only.</p>
<h3>Payments</h3>
<p>All payments are final after order completion. Refund requests must be made within 24 hours.</p>`,
  },
  refund: {
    title: 'Refund Policy',
    content: `<h2>Refund Policy</h2>
<p>We offer refunds in the following circumstances:</p>
<ul>
  <li>Credentials not delivered within 24 hours</li>
  <li>Product not as described</li>
  <li>Technical issues that cannot be resolved</li>
</ul>
<h3>How to Request a Refund</h3>
<p>Contact us via WhatsApp with your order number and reason for refund. Refunds are processed within 3-5 business days.</p>`,
  },
  contact: {
    title: 'Contact Us',
    content: `<h2>Contact Us</h2>
<p>We're here to help! Reach us through any of the following channels:</p>
<ul>
  <li><strong>WhatsApp:</strong> +92 300 1234567 (Fastest response)</li>
  <li><strong>Email:</strong> support@premiumtools.pk</li>
  <li><strong>Hours:</strong> 9 AM – 11 PM PKT, 7 days a week</li>
</ul>`,
  },
};

export default function StaticPage() {
  const params = useParams();
  const location = useLocation();
  // Support both :slug param and direct path-based routing (/about, /faqs, etc.)
  const slug = params.slug || location.pathname.replace('/', '');
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await productService.getPage(slug);
        setPage(data);
      } catch {
        setPage(DEFAULT_CONTENT[slug] || { title: 'Page Not Found', content: '<p>This page does not exist.</p>' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-icod-id="src_pages_staticpage_jsx_27d4">
        <div
          className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          data-icod-id="src_pages_staticpage_jsx_2752" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-12"
      data-icod-id="src_pages_staticpage_jsx_8739">
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_staticpage_jsx_c43e">
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          data-icod-id="src_pages_staticpage_jsx_aefa">
          <div
            className="bg-gradient-to-br from-indigo-600 to-purple-700 px-8 py-10"
            data-icod-id="src_pages_staticpage_jsx_8883">
            <h1
              className="text-3xl font-bold text-white"
              data-icod-id="src_pages_staticpage_jsx_4db6">{page?.title}</h1>
          </div>
          <div
            className="p-8 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-indigo-600"
            dangerouslySetInnerHTML={{ __html: page?.content || '' }}
            data-icod-id="src_pages_staticpage_jsx_6d6a" />
        </div>
      </div>
    </div>
  );
}
