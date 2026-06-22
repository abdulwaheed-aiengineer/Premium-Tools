import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminCategoryService } from '../../services/adminService';
import { getImageUrl, slugify } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '', order: 0, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminCategoryService.getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: '', slug: '', description: '', icon: '', order: 0, isActive: true });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditItem(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon || '', order: cat.order, isActive: cat.isActive });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((p) => ({ ...p, name, ...(!editItem ? { slug: slugify(name) } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editItem) {
        await adminCategoryService.updateCategory(editItem._id, fd);
        toast.success('Category updated!');
      } else {
        await adminCategoryService.createCategory(fd);
        toast.success('Category created!');
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await adminCategoryService.deleteCategory(id);
      toast.success('Category deleted');
      loadCategories();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      const fd = new FormData();
      fd.append('isActive', !cat.isActive);
      await adminCategoryService.updateCategory(cat._id, fd);
      loadCategories();
    } catch {
      toast.error('Failed to update');
    }
  };

  return (
    <div data-icod-id="src_pages_admin_admincategories_jsx_5860">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_admincategories_jsx_4bc7">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_admincategories_jsx_e09b">Categories</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
          data-icod-id="src_pages_admin_admincategories_jsx_3d15">
          <Plus size={16} /> Add Category
        </button>
      </div>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        data-icod-id="src_pages_admin_admincategories_jsx_c2ca">
        {loading ? (
          <div
            className="p-8 text-center"
            data-icod-id="src_pages_admin_admincategories_jsx_ad0d">
            <div
              className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
              data-icod-id="src_pages_admin_admincategories_jsx_7895" />
          </div>
        ) : (
          <table
            className="w-full"
            data-icod-id="src_pages_admin_admincategories_jsx_4bba">
            <thead data-icod-id="src_pages_admin_admincategories_jsx_fd49">
              <tr
                className="text-xs text-gray-500 border-b border-gray-100"
                data-icod-id="src_pages_admin_admincategories_jsx_ef99">
                <th
                  className="text-left px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_admincategories_jsx_2f69">Category</th>
                <th
                  className="text-left px-5 py-3 font-semibold hidden sm:table-cell"
                  data-icod-id="src_pages_admin_admincategories_jsx_ed64">Slug</th>
                <th
                  className="text-left px-5 py-3 font-semibold hidden md:table-cell"
                  data-icod-id="src_pages_admin_admincategories_jsx_4034">Order</th>
                <th
                  className="text-left px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_admincategories_jsx_0899">Status</th>
                <th
                  className="text-right px-5 py-3 font-semibold"
                  data-icod-id="src_pages_admin_admincategories_jsx_6c34">Actions</th>
              </tr>
            </thead>
            <tbody data-icod-id="src_pages_admin_admincategories_jsx_77e9">
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                  data-icod-id={`src_pages_admin_admincategories_jsx_e873_${cat._id}`}>
                  <td
                    className="px-5 py-3"
                    data-icod-id={`src_pages_admin_admincategories_jsx_4602_${cat._id}`}>
                    <div
                      className="flex items-center gap-3"
                      data-icod-id={`src_pages_admin_admincategories_jsx_dfec_${cat._id}`}>
                      <div
                        className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                        data-icod-id={`src_pages_admin_admincategories_jsx_a6a4_${cat._id}`}>
                        {cat.image ? (
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            data-icod-id={`src_pages_admin_admincategories_jsx_8656_${cat._id}`} />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-lg"
                            data-icod-id={`src_pages_admin_admincategories_jsx_7ecb_${cat._id}`}>{cat.icon || '📦'}</div>
                        )}
                      </div>
                      <div data-icod-id={`src_pages_admin_admincategories_jsx_8d26_${cat._id}`}>
                        <p
                          className="font-semibold text-gray-800 text-sm"
                          data-icod-id={`src_pages_admin_admincategories_jsx_b02c_${cat._id}`}>{cat.name}</p>
                        <p
                          className="text-xs text-gray-500 line-clamp-1"
                          data-icod-id={`src_pages_admin_admincategories_jsx_7e61_${cat._id}`}>{cat.description}</p>
                      </div>
                    </div>
                  </td>
                  <td
                    className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell font-mono"
                    data-icod-id={`src_pages_admin_admincategories_jsx_0a04_${cat._id}`}>{cat.slug}</td>
                  <td
                    className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell"
                    data-icod-id={`src_pages_admin_admincategories_jsx_36d2_${cat._id}`}>{cat.order}</td>
                  <td
                    className="px-5 py-3"
                    data-icod-id={`src_pages_admin_admincategories_jsx_4270_${cat._id}`}>
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`text-sm font-medium flex items-center gap-1 ${cat.isActive ? 'text-green-600' : 'text-gray-400'}`}
                      data-icod-id={`src_pages_admin_admincategories_jsx_1e99_${cat._id}`}>
                      {cat.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td
                    className="px-5 py-3"
                    data-icod-id={`src_pages_admin_admincategories_jsx_0ae3_${cat._id}`}>
                    <div
                      className="flex items-center justify-end gap-2"
                      data-icod-id={`src_pages_admin_admincategories_jsx_4de8_${cat._id}`}>
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                        data-icod-id={`src_pages_admin_admincategories_jsx_47cb_${cat._id}`}>
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        data-icod-id={`src_pages_admin_admincategories_jsx_ae54_${cat._id}`}>
                        <Trash2 size={16} />
                      </button>
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
          data-icod-id="src_pages_admin_admincategories_jsx_0ef1">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            data-icod-id="src_pages_admin_admincategories_jsx_7996">
            <div
              className="flex items-center justify-between p-5 border-b border-gray-100"
              data-icod-id="src_pages_admin_admincategories_jsx_a05b">
              <h2
                className="font-bold text-gray-800"
                data-icod-id="src_pages_admin_admincategories_jsx_3dce">{editItem ? 'Edit Category' : 'New Category'}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                data-icod-id="src_pages_admin_admincategories_jsx_9947"><X size={20} /></button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4"
              data-icod-id="src_pages_admin_admincategories_jsx_29cd">
              <div data-icod-id="src_pages_admin_admincategories_jsx_690d">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_admincategories_jsx_0c79">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleNameChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_admincategories_jsx_634b" />
              </div>
              <div data-icod-id="src_pages_admin_admincategories_jsx_6f2a">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_admincategories_jsx_8c6e">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  data-icod-id="src_pages_admin_admincategories_jsx_e5d9" />
              </div>
              <div data-icod-id="src_pages_admin_admincategories_jsx_ecb0">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_admincategories_jsx_89db">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  data-icod-id="src_pages_admin_admincategories_jsx_b445" />
              </div>
              <div
                className="grid grid-cols-2 gap-3"
                data-icod-id="src_pages_admin_admincategories_jsx_71cc">
                <div data-icod-id="src_pages_admin_admincategories_jsx_ad31">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_admincategories_jsx_f5b3">Icon (emoji)</label>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
                    placeholder="🤖"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_admincategories_jsx_7e08" />
                </div>
                <div data-icod-id="src_pages_admin_admincategories_jsx_249d">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_admincategories_jsx_ac07">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_admincategories_jsx_76d9" />
                </div>
              </div>
              <div data-icod-id="src_pages_admin_admincategories_jsx_30be">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_admincategories_jsx_4860">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                  className="text-sm text-gray-600"
                  data-icod-id="src_pages_admin_admincategories_jsx_f944" />
              </div>
              <div
                className="flex items-center gap-2"
                data-icod-id="src_pages_admin_admincategories_jsx_2b75">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded"
                  data-icod-id="src_pages_admin_admincategories_jsx_d5e2" />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                  data-icod-id="src_pages_admin_admincategories_jsx_d2a0">Active</label>
              </div>
              <div
                className="flex gap-3 pt-2"
                data-icod-id="src_pages_admin_admincategories_jsx_e1c2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50"
                  data-icod-id="src_pages_admin_admincategories_jsx_da6c">Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:bg-indigo-400"
                  data-icod-id="src_pages_admin_admincategories_jsx_0e8b">
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
