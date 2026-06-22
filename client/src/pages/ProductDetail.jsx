import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Tag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { formatPrice, getImageUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await productService.getProductBySlug(slug);
        setProduct(p);
        if (p.variants?.length > 0) {
          setSelectedVariant(p.variants[0]);
        }
        if (p._id && p.category?._id) {
          const rel = await productService.getRelatedProducts(p._id, p.category._id).catch(() => []);
          setRelated(rel);
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
    setActiveImage(0);
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product._id, selectedVariant?._id || null, 1, product);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-icod-id="src_pages_productdetail_jsx_0322">
        <div
          className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          data-icod-id="src_pages_productdetail_jsx_489e" />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        data-icod-id="src_pages_productdetail_jsx_30b6">
        <div className="text-5xl mb-4" data-icod-id="src_pages_productdetail_jsx_b690">😕</div>
        <h2
          className="text-2xl font-bold text-gray-800 mb-2"
          data-icod-id="src_pages_productdetail_jsx_22b4">Product Not Found</h2>
        <Link to="/shop" className="text-indigo-600 hover:underline">Back to Shop</Link>
      </div>
    );
  }

  const displayPrice = selectedVariant
    ? (selectedVariant.discountPrice > 0 ? selectedVariant.discountPrice : selectedVariant.price)
    : (product.discountPrice > 0 ? product.discountPrice : product.basePrice);

  const originalPrice = selectedVariant
    ? selectedVariant.price
    : product.basePrice;

  const hasDiscount = displayPrice < originalPrice;
  const savingsPercent = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const images = product.images?.length > 0 ? product.images : [];

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] py-8"
      data-icod-id="src_pages_productdetail_jsx_6219">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_productdetail_jsx_bab4">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-gray-500 mb-6"
          data-icod-id="src_pages_productdetail_jsx_114e">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span data-icod-id="src_pages_productdetail_jsx_0edf">/</span>
          <Link to="/shop" className="hover:text-indigo-600">Shop</Link>
          {product.category && (
            <>
              <span data-icod-id="src_pages_productdetail_jsx_52a8">/</span>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-indigo-600">
                {product.category.name}
              </Link>
            </>
          )}
          <span data-icod-id="src_pages_productdetail_jsx_fe59">/</span>
          <span
            className="text-gray-700 font-medium truncate max-w-[200px]"
            data-icod-id="src_pages_productdetail_jsx_3d07">{product.name}</span>
        </nav>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          data-icod-id="src_pages_productdetail_jsx_8461">
          {/* Image Gallery */}
          <div data-icod-id="src_pages_productdetail_jsx_7c46">
            <div
              className="bg-white rounded-2xl overflow-hidden shadow-md aspect-video relative group"
              data-icod-id="src_pages_productdetail_jsx_77a2">
              {images.length > 0 ? (
                <img
                  src={getImageUrl(images[activeImage])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400/6366F1/white?text=Product'; }}
                  data-icod-id="src_pages_productdetail_jsx_69ea" />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
                  data-icod-id="src_pages_productdetail_jsx_c29a">
                  <span className="text-6xl" data-icod-id="src_pages_productdetail_jsx_4068">📦</span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
                    data-icod-id="src_pages_productdetail_jsx_633e">
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-all opacity-0 group-hover:opacity-100"
                    data-icod-id="src_pages_productdetail_jsx_df0a">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div
                className="flex gap-2 mt-3 overflow-x-auto pb-1"
                data-icod-id="src_pages_productdetail_jsx_5787">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-indigo-500' : 'border-gray-200'
                    }`}
                    data-icod-id={`src_pages_productdetail_jsx_f0d3_${i}`}>
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/64x64/6366F1/white?text='; }}
                      data-icod-id={`src_pages_productdetail_jsx_cf8d_${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div data-icod-id="src_pages_productdetail_jsx_0419">
            {/* Category & Status */}
            <div
              className="flex items-center gap-2 mb-3 flex-wrap"
              data-icod-id="src_pages_productdetail_jsx_7dc6">
              {product.category && (
                <Link
                  to={`/shop?category=${product.category.slug}`}
                  className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full hover:bg-indigo-100"
                >
                  <Tag size={11} />
                  {product.category.name}
                </Link>
              )}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${product.inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}
                data-icod-id="src_pages_productdetail_jsx_fcac">
                {product.inStock ? '✓ In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h1
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
              data-icod-id="src_pages_productdetail_jsx_2c8f">{product.name}</h1>
            <p
              className="text-gray-600 mb-5 leading-relaxed"
              data-icod-id="src_pages_productdetail_jsx_2876">{product.description}</p>

            {/* Price */}
            <div
              className="bg-gray-50 rounded-xl p-4 mb-5"
              data-icod-id="src_pages_productdetail_jsx_0001">
              <div
                className="flex items-baseline gap-3"
                data-icod-id="src_pages_productdetail_jsx_06a1">
                <span
                  className="text-3xl font-extrabold text-gray-900"
                  data-icod-id="src_pages_productdetail_jsx_211e">{formatPrice(displayPrice)}</span>
                {hasDiscount && (
                  <>
                    <span
                      className="text-lg text-gray-400 line-through"
                      data-icod-id="src_pages_productdetail_jsx_646a">{formatPrice(originalPrice)}</span>
                    <span
                      className="bg-green-100 text-green-600 text-sm font-bold px-2 py-0.5 rounded-full"
                      data-icod-id="src_pages_productdetail_jsx_2193">
                      Save {savingsPercent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-5" data-icod-id="src_pages_productdetail_jsx_e691">
                <p
                  className="text-sm font-semibold text-gray-700 mb-2"
                  data-icod-id="src_pages_productdetail_jsx_2d7a">Select Plan / Variant</p>
                <div
                  className="flex flex-wrap gap-2"
                  data-icod-id="src_pages_productdetail_jsx_e97b">
                  {product.variants.map((v) => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedVariant?._id === v._id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}
                      data-icod-id={`src_pages_productdetail_jsx_c379_${v._id}`}>
                      <span data-icod-id={`src_pages_productdetail_jsx_e350_${v._id}`}>{v.label}</span>
                      {v.duration && <span
                        className="text-xs ml-1 opacity-70"
                        data-icod-id={`src_pages_productdetail_jsx_472b_${v._id}`}>({v.duration})</span>}
                      <div
                        className="text-xs font-bold mt-0.5 text-indigo-600"
                        data-icod-id={`src_pages_productdetail_jsx_bdaa_${v._id}`}>
                        {formatPrice(v.discountPrice > 0 ? v.discountPrice : v.price)}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <div
                    className="mt-3 text-xs text-gray-500 space-y-1"
                    data-icod-id="src_pages_productdetail_jsx_736a">
                    {selectedVariant.type && <span
                      className="bg-gray-100 px-2 py-0.5 rounded-full mr-2 capitalize"
                      data-icod-id="src_pages_productdetail_jsx_bc39">{selectedVariant.type}</span>}
                    {selectedVariant.region && <span
                      className="bg-gray-100 px-2 py-0.5 rounded-full mr-2"
                      data-icod-id="src_pages_productdetail_jsx_2335">{selectedVariant.region}</span>}
                    {selectedVariant.users > 1 && <span
                      className="bg-gray-100 px-2 py-0.5 rounded-full mr-2"
                      data-icod-id="src_pages_productdetail_jsx_a2bb">{selectedVariant.users} Users</span>}
                    {selectedVariant.screens > 1 && <span
                      className="bg-gray-100 px-2 py-0.5 rounded-full"
                      data-icod-id="src_pages_productdetail_jsx_218c">{selectedVariant.screens} Screens</span>}
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
              data-icod-id="src_pages_productdetail_jsx_0b3c">
              {adding ? (
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  data-icod-id="src_pages_productdetail_jsx_2d8d" />
              ) : (
                <>
                  <ShoppingCart size={20} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div
                className="flex flex-wrap gap-2 mt-4"
                data-icod-id="src_pages_productdetail_jsx_e178">
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    data-icod-id={`src_pages_productdetail_jsx_8b07_${i}`}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div
          className="mt-10 bg-white rounded-2xl shadow-sm"
          data-icod-id="src_pages_productdetail_jsx_bf50">
          <div
            className="flex border-b border-gray-100"
            data-icod-id="src_pages_productdetail_jsx_296a">
            {['description', 'features'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                data-icod-id={`src_pages_productdetail_jsx_5578_${tab}`}>
                {tab === 'description' ? 'Full Description' : 'Features & Benefits'}
              </button>
            ))}
          </div>
          <div className="p-6" data-icod-id="src_pages_productdetail_jsx_1140">
            {activeTab === 'description' ? (
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.longDescription || product.description || 'No description available.' }}
                data-icod-id="src_pages_productdetail_jsx_9293" />
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-icod-id="src_pages_productdetail_jsx_63b9">
                {['Instant Delivery after payment', 'Secure & Encrypted', '24/7 Customer Support', 'Money-Back Guarantee', 'Original & Licensed', 'Easy to Use'].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                    data-icod-id={`src_pages_productdetail_jsx_7164_${i}`}>
                    <Check size={16} className="text-green-500 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12" data-icod-id="src_pages_productdetail_jsx_fa76">
            <h2
              className="text-2xl font-bold text-gray-900 mb-6"
              data-icod-id="src_pages_productdetail_jsx_4fd1">Related Products</h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-icod-id="src_pages_productdetail_jsx_e78f">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
