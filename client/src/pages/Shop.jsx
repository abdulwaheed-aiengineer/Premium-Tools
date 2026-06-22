import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter state
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [minRating, setMinRating] = useState(0);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1');
  const featured = searchParams.get('featured') || '';
  const topSelling = searchParams.get('topSelling') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [selectedCategories, setSelectedCategories] = useState(category ? [category] : []);

  useEffect(() => {
    productService.getActiveCategories().then(setCategories).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 48,
        sort: sort === 'rating' ? 'latest' : sort,
        ...(selectedCategories[0] && { category: selectedCategories[0] }),
        ...(search && { search }),
        ...(featured && { featured }),
        ...(topSelling && { topSelling }),
      };
      const data = await productService.getProducts(params);
      setAllProducts(data.products || []);
    } catch {
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, selectedCategories, search, featured, topSelling]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side filter + sort
  useEffect(() => {
    let filtered = [...allProducts];

    if (priceMin !== '') {
      filtered = filtered.filter((p) => (p.discountPrice > 0 ? p.discountPrice : p.basePrice) >= Number(priceMin));
    }
    if (priceMax !== '') {
      filtered = filtered.filter((p) => (p.discountPrice > 0 ? p.discountPrice : p.basePrice) <= Number(priceMax));
    }
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => {
        const pa = a.discountPrice > 0 ? a.discountPrice : a.basePrice;
        const pb = b.discountPrice > 0 ? b.discountPrice : b.basePrice;
        return pa - pb;
      });
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => {
        const pa = a.discountPrice > 0 ? a.discountPrice : a.basePrice;
        const pb = b.discountPrice > 0 ? b.discountPrice : b.basePrice;
        return pb - pa;
      });
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const pageSize = 12;
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    setProducts(paginated);
    setTotal(totalCount);
    setPages(totalPages || 1);
  }, [allProducts, priceMin, priceMax, minRating, sort, page]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) {
      params[key] = value;
    } else {
      delete params[key];
    }
    params.page = '1';
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const handleCategoryToggle = (slug) => {
    const newCats = selectedCategories.includes(slug) ? [] : [slug];
    setSelectedCategories(newCats);
    const params = Object.fromEntries(searchParams);
    if (newCats[0]) {
      params.category = newCats[0];
    } else {
      delete params.category;
    }
    params.page = '1';
    setSearchParams(params);
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setMinRating(0);
  };

  const hasActiveFilters = priceMin !== '' || priceMax !== '' || minRating > 0;

  const Sidebar = () => (
    <div className="w-full space-y-4" data-icod-id="src_pages_shop_jsx_016f">
      {/* Categories */}
      <div
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        data-icod-id="src_pages_shop_jsx_1f59">
        <h3
          className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider"
          data-icod-id="src_pages_shop_jsx_a1dd">Categories</h3>
        <ul className="space-y-1" data-icod-id="src_pages_shop_jsx_b547">
          <li data-icod-id="src_pages_shop_jsx_4068">
            <button
              onClick={() => handleCategoryToggle('')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategories.length === 0
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-icod-id="src_pages_shop_jsx_6e51">
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat._id} data-icod-id={`src_pages_shop_jsx_2e4c_${cat._id}`}>
              <button
                onClick={() => handleCategoryToggle(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  selectedCategories.includes(cat.slug)
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                data-icod-id={`src_pages_shop_jsx_98cf_${cat._id}`}>
                {cat.name}
                {selectedCategories.includes(cat.slug) && <X size={14} className="text-indigo-400" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        data-icod-id="src_pages_shop_jsx_4f14">
        <h3
          className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider"
          data-icod-id="src_pages_shop_jsx_ebe3">Price Range</h3>
        <div
          className="flex gap-2 items-center"
          data-icod-id="src_pages_shop_jsx_842d">
          <input
            type="number"
            placeholder="Min $"
            min="0"
            value={priceMin}
            onChange={(e) => { setPriceMin(e.target.value); updateParam('page', '1'); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            data-icod-id="src_pages_shop_jsx_90c6" />
          <span className="text-gray-400 text-sm" data-icod-id="src_pages_shop_jsx_563e">–</span>
          <input
            type="number"
            placeholder="Max $"
            min="0"
            value={priceMax}
            onChange={(e) => { setPriceMax(e.target.value); updateParam('page', '1'); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            data-icod-id="src_pages_shop_jsx_3f9c" />
        </div>
      </div>

      {/* Star Rating Filter */}
      <div
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        data-icod-id="src_pages_shop_jsx_98c1">
        <h3
          className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider"
          data-icod-id="src_pages_shop_jsx_fecb">Min Rating</h3>
        <div className="space-y-2" data-icod-id="src_pages_shop_jsx_f3f6">
          {[4.5, 4, 3.5, 3].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                minRating === r ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
              data-icod-id={`src_pages_shop_jsx_458a_${r}`}>
              <div className="flex" data-icod-id={`src_pages_shop_jsx_8db0_${r}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={star <= r ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span data-icod-id={`src_pages_shop_jsx_6d58_${r}`}>{r}+ stars</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          data-icod-id="src_pages_shop_jsx_e428">
          <X size={14} /> Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#F8FAFC]"
      data-icod-id="src_pages_shop_jsx_6b6e">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-icod-id="src_pages_shop_jsx_e9e6">
        {/* Header */}
        <div className="mb-6" data-icod-id="src_pages_shop_jsx_03c7">
          <h1
            className="text-3xl font-bold text-gray-900 mb-1"
            data-icod-id="src_pages_shop_jsx_e0cf">Shop</h1>
          <p className="text-gray-500" data-icod-id="src_pages_shop_jsx_e8c6">
            {loading ? 'Loading...' : `${total} products available`}
            {hasActiveFilters && <span
              className="ml-2 text-indigo-600 text-sm font-medium"
              data-icod-id="src_pages_shop_jsx_35cf">(filtered)</span>}
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-6"
          data-icod-id="src_pages_shop_jsx_3e3c">
          <form
            onSubmit={handleSearch}
            className="flex-1 flex gap-2"
            data-icod-id="src_pages_shop_jsx_c30c">
            <div className="relative flex-1" data-icod-id="src_pages_shop_jsx_914d">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                data-icod-id="src_pages_shop_jsx_638f" />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
              data-icod-id="src_pages_shop_jsx_058d">
              Search
            </button>
          </form>

          <div className="flex gap-2" data-icod-id="src_pages_shop_jsx_c856">
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-icod-id="src_pages_shop_jsx_f5f7">
              <option value="latest" data-icod-id="src_pages_shop_jsx_44ec">Latest</option>
              <option value="price_asc" data-icod-id="src_pages_shop_jsx_cfad">Price: Low to High</option>
              <option value="price_desc" data-icod-id="src_pages_shop_jsx_095f">Price: High to Low</option>
              <option value="rating" data-icod-id="src_pages_shop_jsx_9af9">Top Rated</option>
            </select>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50"
              data-icod-id="src_pages_shop_jsx_9034">
              <Filter size={16} />
              Filters
              {hasActiveFilters && (
                <span
                  className="bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                  data-icod-id="src_pages_shop_jsx_90de">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6" data-icod-id="src_pages_shop_jsx_56bf">
          {/* Sidebar desktop */}
          <div
            className="hidden lg:block w-60 shrink-0"
            data-icod-id="src_pages_shop_jsx_8dee">
            <Sidebar />
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
              data-icod-id="src_pages_shop_jsx_e289">
              <div
                className="bg-white w-72 h-full p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                data-icod-id="src_pages_shop_jsx_104e">
                <div
                  className="flex items-center justify-between mb-4"
                  data-icod-id="src_pages_shop_jsx_cf4c">
                  <h2
                    className="font-bold text-gray-800"
                    data-icod-id="src_pages_shop_jsx_2f7b">Filters</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    data-icod-id="src_pages_shop_jsx_82af"><X size={20} /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1" data-icod-id="src_pages_shop_jsx_501e">
            {loading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                data-icod-id="src_pages_shop_jsx_9f50">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl h-72 animate-pulse"
                    data-icod-id={`src_pages_shop_jsx_c894_${i}`} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16" data-icod-id="src_pages_shop_jsx_6f66">
                <div className="text-5xl mb-4" data-icod-id="src_pages_shop_jsx_dcdc">🔍</div>
                <h3
                  className="text-xl font-semibold text-gray-700 mb-2"
                  data-icod-id="src_pages_shop_jsx_3355">No products found</h3>
                <p className="text-gray-500 mb-4" data-icod-id="src_pages_shop_jsx_a05d">Try adjusting your search or filter criteria</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    data-icod-id="src_pages_shop_jsx_b033">
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  data-icod-id="src_pages_shop_jsx_789b">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div
                    className="flex items-center justify-center gap-2 mt-8"
                    data-icod-id="src_pages_shop_jsx_c04a">
                    <button
                      onClick={() => updateParam('page', String(page - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                      data-icod-id="src_pages_shop_jsx_3862">
                      <ChevronLeft size={18} />
                    </button>
                    {[...Array(Math.min(pages, 7))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={i}
                          onClick={() => updateParam('page', String(pageNum))}
                          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNum
                              ? 'bg-indigo-600 text-white'
                              : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                          data-icod-id={`src_pages_shop_jsx_a787_${i}`}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => updateParam('page', String(page + 1))}
                      disabled={page === pages}
                      className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                      data-icod-id="src_pages_shop_jsx_d994">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
