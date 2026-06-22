import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { adminProductService, adminCategoryService } from '../../services/adminService';
import { getImageUrl, slugify, formatPrice } from '../../utils/helpers';
import toast from 'react-hot-toast';

const emptyProduct = { name: '', slug: '', description: '', longDescription: '', category: '', basePrice: '', discountPrice: '', isActive: true, inStock: true, isFeatured: false, isTopSelling: false, tags: '' };
const emptyVariant = { label: '', duration: '', type: 'shared', users: 1, screens: 1, region: '', planType: '', price: '', discountPrice: '', isActive: true, stock: -1 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedVariants, setExpandedVariants] = useState({});
  const [variantModal, setVariantModal] = useState(null);
  const [variantForm, setVariantForm] = useState(emptyVariant);
  const [editVariant, setEditVariant] = useState(null);
  const [savingVariant, setSavingVariant] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadCategories = async () => {
    try {
      const data = await adminCategoryService.getCategories();
      setCategories(data);
    } catch {}
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminProductService.getProducts({ page, limit: 10 });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyProduct);
    setImageFiles([]);
    setModalOpen(true);
  };

  const openEdit = (prod) => {
    setEditItem(prod);
    setForm({
      name: prod.name, slug: prod.slug, description: prod.description, longDescription: prod.longDescription || '',
      category: prod.category?._id || '', basePrice: prod.basePrice, discountPrice: prod.discountPrice || '',
      isActive: prod.isActive, inStock: prod.inStock, isFeatured: prod.isFeatured, isTopSelling: prod.isTopSelling,
      tags: prod.tags?.join(', ') || '',
    });
    setImageFiles([]);
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
      Object.entries(form).forEach(([k, v]) => {
        if (typeof v === 'boolean') fd.append(k, v.toString());
        else fd.append(k, v);
      });
      imageFiles.forEach((f) => fd.append('images', f));

      if (editItem) {
        await adminProductService.updateProduct(editItem._id, fd);
        toast.success('Product updated!');
      } else {
        await adminProductService.createProduct(fd);
        toast.success('Product created!');
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product and all its variants?')) return;
    try {
      await adminProductService.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openVariantCreate = (productId) => {
    setVariantModal(productId);
    setEditVariant(null);
    setVariantForm(emptyVariant);
  };

  const openVariantEdit = (variant) => {
    setVariantModal(variant.product);
    setEditVariant(variant);
    setVariantForm({
      label: variant.label, duration: variant.duration, type: variant.type, users: variant.users,
      screens: variant.screens, region: variant.region, planType: variant.planType,
      price: variant.price, discountPrice: variant.discountPrice || '', isActive: variant.isActive, stock: variant.stock,
    });
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    setSavingVariant(true);
    try {
      if (editVariant) {
        await adminProductService.updateVariant(editVariant._id, variantForm);
        toast.success('Variant updated!');
      } else {
        await adminProductService.createVariant(variantModal, variantForm);
        toast.success('Variant created!');
      }
      setVariantModal(null);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save variant');
    } finally {
      setSavingVariant(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm('Delete this variant?')) return;
    try {
      await adminProductService.deleteVariant(variantId);
      toast.success('Variant deleted');
      loadProducts();
    } catch {
      toast.error('Failed to delete variant');
    }
  };

  return (
    <div data-icod-id="src_pages_admin_adminproducts_jsx_1d7a">
      <div
        className="flex items-center justify-between mb-6"
        data-icod-id="src_pages_admin_adminproducts_jsx_e11c">
        <h1
          className="text-2xl font-bold text-gray-900"
          data-icod-id="src_pages_admin_adminproducts_jsx_ae0b">Products <span
          className="text-gray-400 text-lg font-normal"
          data-icod-id="src_pages_admin_adminproducts_jsx_48f2">({total})</span></h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          data-icod-id="src_pages_admin_adminproducts_jsx_c7df">
          <Plus size={16} /> Add Product
        </button>
      </div>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        data-icod-id="src_pages_admin_adminproducts_jsx_dde1">
        {loading ? (
          <div
            className="p-8 text-center"
            data-icod-id="src_pages_admin_adminproducts_jsx_ca65"><div
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"
            data-icod-id="src_pages_admin_adminproducts_jsx_3fe2" /></div>
        ) : (
          <>
            <table className="w-full" data-icod-id="src_pages_admin_adminproducts_jsx_d73f">
              <thead data-icod-id="src_pages_admin_adminproducts_jsx_0cc5">
                <tr
                  className="text-xs text-gray-500 border-b border-gray-100"
                  data-icod-id="src_pages_admin_adminproducts_jsx_e0ba">
                  <th
                    className="text-left px-5 py-3 font-semibold"
                    data-icod-id="src_pages_admin_adminproducts_jsx_2c82">Product</th>
                  <th
                    className="text-left px-5 py-3 font-semibold hidden md:table-cell"
                    data-icod-id="src_pages_admin_adminproducts_jsx_2153">Category</th>
                  <th
                    className="text-left px-5 py-3 font-semibold"
                    data-icod-id="src_pages_admin_adminproducts_jsx_b818">Price</th>
                  <th
                    className="text-left px-5 py-3 font-semibold hidden sm:table-cell"
                    data-icod-id="src_pages_admin_adminproducts_jsx_c821">Status</th>
                  <th
                    className="text-right px-5 py-3 font-semibold"
                    data-icod-id="src_pages_admin_adminproducts_jsx_0cb4">Actions</th>
                </tr>
              </thead>
              <tbody data-icod-id="src_pages_admin_adminproducts_jsx_86fa">
                {products.map((prod) => (
                  <React.Fragment key={prod._id}>
                    <tr
                      className="border-b border-gray-50 hover:bg-gray-50/50"
                      data-icod-id={`src_pages_admin_adminproducts_jsx_4f0b_${prod._id}`}>
                      <td
                        className="px-5 py-3"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_a8a8_${prod._id}`}>
                        <div
                          className="flex items-center gap-3"
                          data-icod-id={`src_pages_admin_adminproducts_jsx_669d_${prod._id}`}>
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_5752_${prod._id}`}>
                            <img
                              src={getImageUrl(prod.images?.[0])}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://placehold.co/40x40/6366F1/white?text=P'; }}
                              data-icod-id={`src_pages_admin_adminproducts_jsx_8463_${prod._id}`} />
                          </div>
                          <div data-icod-id={`src_pages_admin_adminproducts_jsx_7f4d_${prod._id}`}>
                            <p
                              className="font-semibold text-gray-800 text-sm line-clamp-1"
                              data-icod-id={`src_pages_admin_adminproducts_jsx_ba3f_${prod._id}`}>{prod.name}</p>
                            <button
                              onClick={() => setExpandedVariants((p) => ({ ...p, [prod._id]: !p[prod._id] }))}
                              className="text-xs text-indigo-600 flex items-center gap-0.5 hover:underline"
                              data-icod-id={`src_pages_admin_adminproducts_jsx_ee0e_${prod._id}`}>
                              {prod.variants?.length || 0} variants
                              {expandedVariants[prod._id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-5 py-3 text-sm text-gray-500 hidden md:table-cell"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_c586_${prod._id}`}>{prod.category?.name}</td>
                      <td
                        className="px-5 py-3 text-sm font-bold text-gray-800"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_aa98_${prod._id}`}>{formatPrice(prod.discountPrice || prod.basePrice)}</td>
                      <td
                        className="px-5 py-3 hidden sm:table-cell"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_bd3b_${prod._id}`}>
                        <div
                          className="flex flex-col gap-0.5"
                          data-icod-id={`src_pages_admin_adminproducts_jsx_65ef_${prod._id}`}>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium self-start ${prod.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                            data-icod-id={`src_pages_admin_adminproducts_jsx_d805_${prod._id}`}>
                            {prod.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {prod.isFeatured && <span
                            className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium self-start"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_bd0b_${prod._id}`}>Featured</span>}
                        </div>
                      </td>
                      <td
                        className="px-5 py-3"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_f8eb_${prod._id}`}>
                        <div
                          className="flex items-center justify-end gap-2"
                          data-icod-id={`src_pages_admin_adminproducts_jsx_e125_${prod._id}`}>
                          <button
                            onClick={() => openVariantCreate(prod._id)}
                            title="Add Variant"
                            className="p-1.5 text-green-400 hover:text-green-600 transition-colors"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_0182_${prod._id}`}>
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={() => openEdit(prod)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_9004_${prod._id}`}>
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_048d_${prod._id}`}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Variants expanded */}
                    {expandedVariants[prod._id] && prod.variants?.map((v) => (
                      <tr
                        key={v._id}
                        className="bg-indigo-50/30 border-b border-gray-50"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_021f_${prod._id}_${v._id}`}>
                        <td
                          className="pl-16 pr-5 py-2"
                          colSpan={2}
                          data-icod-id={`src_pages_admin_adminproducts_jsx_afa0_${prod._id}_${v._id}`}>
                          <span
                            className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_c866_${prod._id}_${v._id}`}>{v.label}</span>
                          {v.duration && <span
                            className="text-xs text-gray-500 ml-2"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_8a10_${prod._id}_${v._id}`}>{v.duration}</span>}
                          <span
                            className="text-xs text-gray-400 ml-2 capitalize"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_4525_${prod._id}_${v._id}`}>{v.type}</span>
                        </td>
                        <td
                          className="px-5 py-2 text-xs font-bold text-gray-700"
                          data-icod-id={`src_pages_admin_adminproducts_jsx_91d5_${prod._id}_${v._id}`}>{formatPrice(v.discountPrice || v.price)}</td>
                        <td
                          className="px-5 py-2 hidden sm:table-cell"
                          data-icod-id={`src_pages_admin_adminproducts_jsx_5d29_${prod._id}_${v._id}`}>
                          <span
                            className={`text-xs ${v.isActive ? 'text-green-600' : 'text-gray-400'}`}
                            data-icod-id={`src_pages_admin_adminproducts_jsx_9fee_${prod._id}_${v._id}`}>{v.isActive ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td
                          className="px-5 py-2"
                          data-icod-id={`src_pages_admin_adminproducts_jsx_b1dd_${prod._id}_${v._id}`}>
                          <div
                            className="flex items-center justify-end gap-2"
                            data-icod-id={`src_pages_admin_adminproducts_jsx_2e0d_${prod._id}_${v._id}`}>
                            <button
                              onClick={() => openVariantEdit(v)}
                              className="p-1 text-gray-400 hover:text-indigo-600"
                              data-icod-id={`src_pages_admin_adminproducts_jsx_27d3_${prod._id}_${v._id}`}><Pencil size={14} /></button>
                            <button
                              onClick={() => handleDeleteVariant(v._id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              data-icod-id={`src_pages_admin_adminproducts_jsx_b375_${prod._id}_${v._id}`}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div
              className="flex items-center justify-between p-4 border-t border-gray-100"
              data-icod-id="src_pages_admin_adminproducts_jsx_2507">
              <p
                className="text-sm text-gray-500"
                data-icod-id="src_pages_admin_adminproducts_jsx_6b64">{total} total products</p>
              <div
                className="flex gap-2"
                data-icod-id="src_pages_admin_adminproducts_jsx_d469">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminproducts_jsx_d78b">Prev</button>
                <button
                  disabled={page * 10 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminproducts_jsx_8132">Next</button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Product Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          data-icod-id="src_pages_admin_adminproducts_jsx_0a31">
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col"
            data-icod-id="src_pages_admin_adminproducts_jsx_b233">
            <div
              className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0"
              data-icod-id="src_pages_admin_adminproducts_jsx_9c1c">
              <h2
                className="font-bold text-gray-800"
                data-icod-id="src_pages_admin_adminproducts_jsx_f787">{editItem ? 'Edit Product' : 'New Product'}</h2>
              <button
                onClick={() => setModalOpen(false)}
                data-icod-id="src_pages_admin_adminproducts_jsx_90de"><X size={20} /></button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-4 overflow-y-auto"
              data-icod-id="src_pages_admin_adminproducts_jsx_c8dc">
              <div
                className="grid grid-cols-2 gap-4"
                data-icod-id="src_pages_admin_adminproducts_jsx_0803">
                <div
                  className="col-span-2"
                  data-icod-id="src_pages_admin_adminproducts_jsx_173c">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_989c">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleNameChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_e882" />
                </div>
                <div
                  className="col-span-2 sm:col-span-1"
                  data-icod-id="src_pages_admin_adminproducts_jsx_fdf6">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_01c7">Slug *</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_a4fd" />
                </div>
                <div
                  className="col-span-2 sm:col-span-1"
                  data-icod-id="src_pages_admin_adminproducts_jsx_8285">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_2c47">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_f37b">
                    <option value="" data-icod-id="src_pages_admin_adminproducts_jsx_5439">Select category</option>
                    {categories.map((c) => <option
                      key={c._id}
                      value={c._id}
                      data-icod-id={`src_pages_admin_adminproducts_jsx_0830_${c._id}`}>{c.name}</option>)}
                  </select>
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_4a1f">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_dd52">Base Price *</label>
                  <input
                    type="number"
                    value={form.basePrice}
                    onChange={(e) => setForm((p) => ({ ...p, basePrice: e.target.value }))}
                    required
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_63af" />
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_b86b">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_625c">Discount Price</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm((p) => ({ ...p, discountPrice: e.target.value }))}
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_679f" />
                </div>
                <div
                  className="col-span-2"
                  data-icod-id="src_pages_admin_adminproducts_jsx_9108">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_196f">Short Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    data-icod-id="src_pages_admin_adminproducts_jsx_7264" />
                </div>
                <div
                  className="col-span-2"
                  data-icod-id="src_pages_admin_adminproducts_jsx_904c">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_6a4e">Long Description (HTML)</label>
                  <textarea
                    value={form.longDescription}
                    onChange={(e) => setForm((p) => ({ ...p, longDescription: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
                    data-icod-id="src_pages_admin_adminproducts_jsx_d7b2" />
                </div>
                <div
                  className="col-span-2"
                  data-icod-id="src_pages_admin_adminproducts_jsx_1169">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_7914">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="streaming, vpn, ai"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_c8ab" />
                </div>
                <div
                  className="col-span-2"
                  data-icod-id="src_pages_admin_adminproducts_jsx_1168">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_7d97">Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="text-sm"
                    data-icod-id="src_pages_admin_adminproducts_jsx_1d8a" />
                  {imageFiles.length > 0 && <p
                    className="text-xs text-gray-500 mt-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_8430">{imageFiles.length} file(s) selected</p>}
                </div>
                <div
                  className="col-span-2 flex flex-wrap gap-4"
                  data-icod-id="src_pages_admin_adminproducts_jsx_ea59">
                  {[['isActive', 'Active'], ['inStock', 'In Stock'], ['isFeatured', 'Featured'], ['isTopSelling', 'Top Selling']].map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                      data-icod-id={`src_pages_admin_adminproducts_jsx_3d8a_${key}`}>
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                        className="rounded"
                        data-icod-id={`src_pages_admin_adminproducts_jsx_3c62_${key}`} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <div
                className="flex gap-3 pt-2"
                data-icod-id="src_pages_admin_adminproducts_jsx_fc20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50"
                  data-icod-id="src_pages_admin_adminproducts_jsx_9c81">Cancel</button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:bg-indigo-400"
                  data-icod-id="src_pages_admin_adminproducts_jsx_928e">
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Variant Modal */}
      {variantModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          data-icod-id="src_pages_admin_adminproducts_jsx_da70">
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
            data-icod-id="src_pages_admin_adminproducts_jsx_12a3">
            <div
              className="flex items-center justify-between p-5 border-b border-gray-100"
              data-icod-id="src_pages_admin_adminproducts_jsx_1e0e">
              <h2
                className="font-bold text-gray-800"
                data-icod-id="src_pages_admin_adminproducts_jsx_af87">{editVariant ? 'Edit Variant' : 'New Variant'}</h2>
              <button
                onClick={() => setVariantModal(null)}
                data-icod-id="src_pages_admin_adminproducts_jsx_548a"><X size={20} /></button>
            </div>
            <form
              onSubmit={handleVariantSubmit}
              className="p-5 space-y-3"
              data-icod-id="src_pages_admin_adminproducts_jsx_e324">
              <div data-icod-id="src_pages_admin_adminproducts_jsx_588b">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  data-icod-id="src_pages_admin_adminproducts_jsx_7c9e">Label *</label>
                <input
                  type="text"
                  value={variantForm.label}
                  onChange={(e) => setVariantForm((p) => ({ ...p, label: e.target.value }))}
                  required
                  placeholder="e.g. 1 Month Premium"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  data-icod-id="src_pages_admin_adminproducts_jsx_bdc5" />
              </div>
              <div
                className="grid grid-cols-2 gap-3"
                data-icod-id="src_pages_admin_adminproducts_jsx_d024">
                <div data-icod-id="src_pages_admin_adminproducts_jsx_534d">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_d1cf">Duration</label>
                  <input
                    type="text"
                    value={variantForm.duration}
                    onChange={(e) => setVariantForm((p) => ({ ...p, duration: e.target.value }))}
                    placeholder="1 Month"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_5a0f" />
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_06c1">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_4a14">Type</label>
                  <select
                    value={variantForm.type}
                    onChange={(e) => setVariantForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_132e">
                    <option value="shared" data-icod-id="src_pages_admin_adminproducts_jsx_e163">Shared</option>
                    <option value="private" data-icod-id="src_pages_admin_adminproducts_jsx_bda6">Private</option>
                  </select>
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_06ef">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_da30">Price (PKR) *</label>
                  <input
                    type="number"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm((p) => ({ ...p, price: e.target.value }))}
                    required
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_db4c" />
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_7840">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_1375">Discount Price</label>
                  <input
                    type="number"
                    value={variantForm.discountPrice}
                    onChange={(e) => setVariantForm((p) => ({ ...p, discountPrice: e.target.value }))}
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_eb0e" />
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_2d8d">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_b98b">Region</label>
                  <input
                    type="text"
                    value={variantForm.region}
                    onChange={(e) => setVariantForm((p) => ({ ...p, region: e.target.value }))}
                    placeholder="Global"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_e4b8" />
                </div>
                <div data-icod-id="src_pages_admin_adminproducts_jsx_5e8b">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    data-icod-id="src_pages_admin_adminproducts_jsx_3983">Screens</label>
                  <input
                    type="number"
                    value={variantForm.screens}
                    onChange={(e) => setVariantForm((p) => ({ ...p, screens: e.target.value }))}
                    min="1"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    data-icod-id="src_pages_admin_adminproducts_jsx_3e04" />
                </div>
              </div>
              <label
                className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
                data-icod-id="src_pages_admin_adminproducts_jsx_828d">
                <input
                  type="checkbox"
                  checked={variantForm.isActive}
                  onChange={(e) => setVariantForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="rounded"
                  data-icod-id="src_pages_admin_adminproducts_jsx_3703" />
                Active
              </label>
              <div
                className="flex gap-3 pt-2"
                data-icod-id="src_pages_admin_adminproducts_jsx_9575">
                <button
                  type="button"
                  onClick={() => setVariantModal(null)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold"
                  data-icod-id="src_pages_admin_adminproducts_jsx_439d">Cancel</button>
                <button
                  type="submit"
                  disabled={savingVariant}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:bg-indigo-400"
                  data-icod-id="src_pages_admin_adminproducts_jsx_aab5">
                  {savingVariant ? 'Saving...' : 'Save Variant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
