import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminBannerService } from '../../services/adminService';
import { getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', link: '', order: 0, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBanners(); }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await adminBannerService.getBanners();
      setBanners(data);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', subtitle: '', link: '', order: 0, isActive: true });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditItem(banner);
    setForm({ title: banner.title, subtitle: banner.subtitle || '', link: banner.link || '', order: banner.order, isActive: banner.isActive });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await adminBannerService.updateBanner(editItem._id, fd);
        toast.success('Banner updated!');
      } else {
        await adminBannerService.createBanner(fd);
        toast.success('Banner created!');
      }
      setModalOpen(false);
      loadBanners();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await adminBannerService.deleteBanner(id);
      toast.success('Banner deleted');
      loadBanners();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (banner) => {
    try {
      const fd = new FormData();
      fd.append('isActive', !banner.isActive);
      await adminBannerService.updateBanner(banner._id, fd);
      loadBanners();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div data-icod-id="src_pages_admin_adminbanners_jsx_d392">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_adminbanners_jsx_61e4">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_adminbanners_jsx_0e69">Banners</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          data-icod-id="src_pages_admin_adminbanners_jsx_049f">
          <Plus size={16} /> Add Banner
        </button>
      </div>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        data-icod-id="src_pages_admin_adminbanners_jsx_c488">
        {loading ? (
          <div
            className="p-8 text-center"
            data-icod-id="src_pages_admin_adminbanners_jsx_de48"><div
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
            data-icod-id="src_pages_admin_adminbanners_jsx_3a47" /></div>
        ) : (
          <table className="w-full" data-icod-id="src_pages_admin_adminbanners_jsx_0e8f">
            <thead data-icod-id="src_pages_admin_adminbanners_jsx_b98b">
              <tr
                className="text-xs text-gray-500 border-b border-gray-100"
                data-icod-id="src_pages_admin_adminbanners_jsx_b1bd">
                <th
                  className="text-left px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_adminbanners_jsx_937d">Banner</th>
                <th
                  className="text-left px-5 py-3 font-semibold hidden sm:table-cell"
                  data-icod-id="src_pages_admin_adminbanners_jsx_20a3">Link</th>
                <th
                  className="text-left px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_adminbanners_jsx_12d0">Order</th>
                <th
                  className="text-left px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_adminbanners_jsx_b41c">Status</th>
                <th
                  className="text-right px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_adminbanners_jsx_cacf">Actions</th>
              </tr>
            </thead>
            <tbody data-icod-id="src_pages_admin_adminbanners_jsx_c1cd">
              {banners.length === 0 ? (
                <tr data-icod-id="src_pages_admin_adminbanners_jsx_4899"><td
                  colSpan={5}
                  className="text-center text-gray-400 py-8"
                  data-icod-id="src_pages_admin_adminbanners_jsx_170c">No banners yet</td></tr>
              ) : banners.map((banner) => (
                <tr
                  key={banner._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                  data-icod-id={`src_pages_admin_adminbanners_jsx_fb52_${banner._id}`}>
                  <td
                    className="px-5 py-3"
                    data-icod-id={`src_pages_admin_adminbanners_jsx_af21_${banner._id}`}>
                    <div
                      className="flex items-center gap-3"
                      data-icod-id={`src_pages_admin_adminbanners_jsx_ee56_${banner._id}`}>
                      <div
                        className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                        data-icod-id={`src_pages_admin_adminbanners_jsx_616d_${banner._id}`}>
                        {banner.image ? (
                          <img
                            src={getImageUrl(banner.image)}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                            data-icod-id={`src_pages_admin_adminbanners_jsx_5f2c_${banner._id}`} />
                        ) : (
                          <div
                            className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-400 text-xs"
                            data-icod-id={`src_pages_admin_adminbanners_jsx_02fc_${banner._id}`}>No img</div>
                        )}
                      </div>
                      <div data-icod-id={`src_pages_admin_adminbanners_jsx_1bc0_${banner._id}`}>
                        <p
                          className="font-semibold text-gray-800 text-sm"
                          data-icod-id={`src_pages_admin_adminbanners_jsx_fcda_${banner._id}`}>{banner.title}</p>
                        <p
                          className="text-xs text-gray-500 line-clamp-1"
                          data-icod-id={`src_pages_admin_adminbanners_jsx_be8e_${banner._id}`}>{banner.subtitle}</p>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3 text-xs text-gray-500 hidden sm:table-cell max-w-[120px] truncate"
                    data-icod-id={`src_pages_admin_adminbanners_jsx_b8d5_${banner._id}`}>{banner.link || '—'}</td>
                  <td
                    className="px-5 py-3 text-sm text-gray-600"
                    data-icod-id={`src_pages_admin_adminbanners_jsx_6602_${banner._id}`}>{banner.order}</td>
                  <td
                    className="px-5 py-3"
                    data-icod-id={`src_pages_admin_adminbanners_jsx_53d7_${banner._id}`}>
                    <button
                      onClick={() => handleToggle(banner)}
                      className={`text-sm flex items-center gap-1 font-medium ${banner.isActive ? 'text-green-600' : 'text-gray-400'}`}
                      data-icod-id={`src_pages_admin_adminbanners_jsx_9e7f_${banner._id}`}>
                      {banner.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td
                    className="px-5 py-3"
                    data-icod-id={`src_pages_admin_adminbanners_jsx_60e5_${banner._id}`}>
                    <div
                      className="flex items-center justify-end gap-2"
                      data-icod-id={`src_pages_admin_adminbanners_jsx_b26f_${banner._id}`}>
                      <button
                        onClick={() => openEdit(banner)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600"
                        data-icod-id={`src_pages_admin_adminbanners_jsx_ec47_${banner._id}`}><Pencil size={16} /></button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                        data-icod-id={`src_pages_admin_adminbanners_jsx_81a0_${banner._id}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          data-icod-id="src_pages_admin_adminbanners_jsx_4107">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            data-icod-id="src_pages_admin_adminbanners_jsx_93ea">
            <div
              className="flex items-center justify-between p-5 border-b border-gray-100"
              data-icod-id="src_pages_admin_adminbanners_jsx_316c">
              <h2
                className="font-bold text-gray-800"
                data-icod-id="src_pages_admin_adminbanners_jsx_cb31">{editItem ? 'Edit Banner' : 'New Banner'}</h2>
              <button
                onClick={() => setModalOpen(false)}
                data-icod-id="src_pages_admin_adminbanners_jsx_71f4"><X size={20} /></button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4"
              data-icod-id="src_pages_admin_adminbanners_jsx_2020">
              <div data-icod-id="src_pages_admin_adminbanners_jsx_7aeb">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminbanners_jsx_a7c8">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_adminbanners_jsx_d3bd" />
              </div>
              <div data-icod-id="src_pages_admin_adminbanners_jsx_be65">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminbanners_jsx_32e7">Subtitle</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_adminbanners_jsx_4493" />
              </div>
              <div data-icod-id="src_pages_admin_adminbanners_jsx_0aa0">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminbanners_jsx_c55e">Link URL</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder="/shop"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_adminbanners_jsx_deba" />
              </div>
              <div data-icod-id="src_pages_admin_adminbanners_jsx_e609">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminbanners_jsx_c27c">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_adminbanners_jsx_9f78" />
              </div>
              <div data-icod-id="src_pages_admin_adminbanners_jsx_6e37">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminbanners_jsx_9553">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                  className="text-sm"
                  data-icod-id="src_pages_admin_adminbanners_jsx_403f" />
                {editItem?.image && !imageFile && (
                  <div className="mt-2" data-icod-id="src_pages_admin_adminbanners_jsx_5eb2">
                    <img
                      src={getImageUrl(editItem.image)}
                      alt=""
                      className="h-16 rounded-lg object-cover"
                      data-icod-id="src_pages_admin_adminbanners_jsx_ea49" />
                  </div>
                )}
              </div>
              <label
                className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                data-icod-id="src_pages_admin_adminbanners_jsx_b43e">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded"
                  data-icod-id="src_pages_admin_adminbanners_jsx_edaf" />
                Active
              </label>
              <div
                className="flex gap-3 pt-2"
                data-icod-id="src_pages_admin_adminbanners_jsx_e03d">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold"
                  data-icod-id="src_pages_admin_adminbanners_jsx_45fa">Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:bg-indigo-400"
                  data-icod-id="src_pages_admin_adminbanners_jsx_d6c2">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
