import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { adminPageService } from '../../services/adminService';
import toast from 'react-hot-toast';

const PAGE_SLUGS = [
  { slug: 'about', label: 'About Us' },
  { slug: 'faqs', label: 'FAQs' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms & Conditions' },
  { slug: 'refund', label: 'Refund Policy' },
  { slug: 'contact', label: 'Contact Us' },
];

export default function AdminPages() {
  const [pages, setPages] = useState({});
  const [activeSlug, setActiveSlug] = useState('about');
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    const page = pages[activeSlug];
    if (page) {
      setForm({ title: page.title, content: page.content || '' });
    } else {
      const defaultLabel = PAGE_SLUGS.find((p) => p.slug === activeSlug)?.label || '';
      setForm({ title: defaultLabel, content: '' });
    }
  }, [activeSlug, pages]);

  const loadPages = async () => {
    setLoading(true);
    try {
      const data = await adminPageService.getPages();
      const map = {};
      data.forEach((p) => { map[p.slug] = p; });
      setPages(map);
    } catch {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminPageService.upsertPage(activeSlug, form.title, form.content);
      setPages((p) => ({ ...p, [activeSlug]: updated }));
      toast.success('Page saved!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-icod-id="src_pages_admin_adminpages_jsx_ae8d">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_adminpages_jsx_87a4">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_adminpages_jsx_7967">Pages</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
          data-icod-id="src_pages_admin_adminpages_jsx_b8d1">
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        data-icod-id="src_pages_admin_adminpages_jsx_09ca">
        {/* Page list */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit"
          data-icod-id="src_pages_admin_adminpages_jsx_8572">
          {PAGE_SLUGS.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActiveSlug(p.slug)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                activeSlug === p.slug ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-icod-id={`src_pages_admin_adminpages_jsx_62dd_${p.slug}`}>
              {p.label}
              {pages[p.slug] && <span
                className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full"
                data-icod-id={`src_pages_admin_adminpages_jsx_aea8_${p.slug}`}>Saved</span>}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div
          className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          data-icod-id="src_pages_admin_adminpages_jsx_b4ca">
          {loading ? (
            <div
              className="flex items-center justify-center h-32"
              data-icod-id="src_pages_admin_adminpages_jsx_ba96">
              <div
                className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
                data-icod-id="src_pages_admin_adminpages_jsx_81a7" />
            </div>
          ) : (
            <div className="space-y-4" data-icod-id="src_pages_admin_adminpages_jsx_a394">
              <div data-icod-id="src_pages_admin_adminpages_jsx_5144">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminpages_jsx_9e00">Page Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_adminpages_jsx_f52e" />
              </div>
              <div data-icod-id="src_pages_admin_adminpages_jsx_de1a">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminpages_jsx_8658">Content (HTML)</label>
                <p
                  className="text-xs text-gray-400 mb-2"
                  data-icod-id="src_pages_admin_adminpages_jsx_fc30">You can use basic HTML tags: h2, h3, p, ul, li, strong, a, etc.</p>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  rows={20}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="<h2>Page Title</h2><p>Your content here...</p>"
                  data-icod-id="src_pages_admin_adminpages_jsx_36af" />
              </div>

              {form.content && (
                <div data-icod-id="src_pages_admin_adminpages_jsx_5de2">
                  <p
                    className="text-sm font-medium text-gray-700 mb-2"
                    data-icod-id="src_pages_admin_adminpages_jsx_f441">Preview</p>
                  <div
                    className="border border-gray-200 rounded-xl p-4 prose prose-sm max-w-none text-gray-700 prose-headings:font-bold"
                    dangerouslySetInnerHTML={{ __html: form.content }}
                    data-icod-id="src_pages_admin_adminpages_jsx_82e8" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
