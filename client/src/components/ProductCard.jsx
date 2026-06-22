import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Tag } from 'lucide-react';
import { formatPrice, getImageUrl, truncate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

function StarRating({ rating }) {
  if (!rating) return null;
  return (
    <div
      className="flex items-center gap-0.5 mb-2"
      data-icod-id="src_components_productcard_jsx_61e2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
      <span
        className="text-xs text-gray-400 ml-1"
        data-icod-id="src_components_productcard_jsx_67e7">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product, dark = false }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.basePrice;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.basePrice;
  const discount = hasDiscount
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, null, 1, product);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  const cardBg = dark
    ? 'bg-gray-900 border border-gray-700 hover:border-indigo-500/50'
    : 'bg-white border border-gray-100';

  return (
    <Link to={`/products/${product.slug}`} className="group block h-full">
      <div
        className={`${cardBg} rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col`}
        data-icod-id="src_components_productcard_jsx_b589">
        {/* Image */}
        <div
          className="relative overflow-hidden bg-gray-100 aspect-video"
          data-icod-id="src_components_productcard_jsx_695e">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = 'https://placehold.co/400x250/6366F1/white?text=Product'; }}
            data-icod-id="src_components_productcard_jsx_14b9" />
          {hasDiscount && (
            <span
              className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
              data-icod-id="src_components_productcard_jsx_edda">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span
              className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
              data-icod-id="src_components_productcard_jsx_c6c3">
              <Star size={10} /> Featured
            </span>
          )}
          {!product.inStock && (
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
              data-icod-id="src_components_productcard_jsx_beee">
              <span
                className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full"
                data-icod-id="src_components_productcard_jsx_463d">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="p-4 flex flex-col flex-1"
          data-icod-id="src_components_productcard_jsx_6055">
          {/* Category badge */}
          {product.category && (
            <span
              className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full self-start mb-2 flex items-center gap-1"
              data-icod-id="src_components_productcard_jsx_290c">
              <Tag size={10} />
              {product.category.name}
            </span>
          )}

          <h3
            className={`font-semibold text-sm leading-snug mb-1 group-hover:text-indigo-500 transition-colors line-clamp-2 ${dark ? 'text-white' : 'text-gray-800'}`}
            data-icod-id="src_components_productcard_jsx_9430">
            {product.name}
          </h3>

          {/* Star rating */}
          {product.rating > 0 && <StarRating rating={product.rating} />}

          <p
            className={`text-xs mb-3 flex-1 line-clamp-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
            data-icod-id="src_components_productcard_jsx_495f">
            {truncate(product.description, 70)}
          </p>

          {/* Price row */}
          <div
            className="flex items-center justify-between mt-auto gap-2"
            data-icod-id="src_components_productcard_jsx_4d77">
            <div
              className="flex items-baseline gap-1.5 flex-wrap"
              data-icod-id="src_components_productcard_jsx_a690">
              <span
                className="text-lg font-bold"
                style={{ color: '#22c55e' }}
                data-icod-id="src_components_productcard_jsx_3bcd">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span
                  className={`text-xs line-through ${dark ? 'text-gray-500' : 'text-gray-400'}`}
                  data-icod-id="src_components_productcard_jsx_cb4c">
                  {formatPrice(product.basePrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white p-2 rounded-lg transition-all hover:scale-110 shrink-0"
              title="Add to cart"
              data-icod-id="src_components_productcard_jsx_9c50">
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
