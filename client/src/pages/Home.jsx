import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Headphones, RefreshCw, Flame, Star } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';

function useCountdown(endDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (!endDate) return;

    function calc() {
      const diff = new Date(endDate) - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, mins, secs });
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [endDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }) {
  return (
    <div
      className="flex flex-col items-center bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 min-w-[56px]"
      data-icod-id="src_pages_home_jsx_6898">
      <span
        className="text-2xl font-bold text-white tabular-nums"
        data-icod-id="src_pages_home_jsx_033f">
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="text-xs text-gray-400 uppercase tracking-wider mt-0.5"
        data-icod-id="src_pages_home_jsx_7910">{label}</span>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      data-icod-id="src_pages_home_jsx_cfae">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={12}
          className={star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
        />
      ))}
      <span
        className="text-xs text-gray-400 ml-1"
        data-icod-id="src_pages_home_jsx_8ae5">{rating?.toFixed(1)}</span>
    </div>
  );
}

function HeroSection({ topDeal }) {
  const endDate = topDeal?.deal?.endDate;
  const countdown = useCountdown(endDate);

  const savings = topDeal
    ? Math.round(((topDeal.basePrice - topDeal.discountPrice) / topDeal.basePrice) * 100)
    : 0;

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950"
      data-icod-id="src_pages_home_jsx_63f8">
      {/* Animated gradient orbs */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        data-icod-id="src_pages_home_jsx_4f66">
        <div
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl animate-float-slow"
          data-icod-id="src_pages_home_jsx_0241" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700/15 blur-3xl animate-float-slower"
          data-icod-id="src_pages_home_jsx_05ec" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-900/10 blur-3xl"
          data-icod-id="src_pages_home_jsx_4c87" />
      </div>
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20"
        data-icod-id="src_pages_home_jsx_b223">
        <div
          className="flex flex-col lg:flex-row items-center gap-12"
          data-icod-id="src_pages_home_jsx_4c67">
          {/* Text side */}
          <div
            className="flex-1 text-center lg:text-left"
            data-icod-id="src_pages_home_jsx_2b28">
            <div
              className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-pulse-slow"
              data-icod-id="src_pages_home_jsx_6ce4">
              <Flame size={14} />
              {topDeal?.deal?.dealLabel || 'Limited Time Offer'}
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4"
              data-icod-id="src_pages_home_jsx_0bf2">
              {topDeal ? (
                <>
                  <span
                    className="block text-gray-300 text-2xl sm:text-3xl font-semibold mb-2"
                    data-icod-id="src_pages_home_jsx_e3c9">Today's Top Deal</span>
                  {topDeal.name}
                </>
              ) : (
                <>
                  Premium Digital
                  <span
                    className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                    data-icod-id="src_pages_home_jsx_b648">
                    Products Store
                  </span>
                </>
              )}
            </h1>

            {topDeal && (
              <div
                className="flex flex-wrap items-center gap-3 justify-center lg:justify-start mb-6"
                data-icod-id="src_pages_home_jsx_4d1a">
                <span
                  className="text-gray-400 line-through text-xl"
                  data-icod-id="src_pages_home_jsx_ba3a">${topDeal.basePrice?.toFixed(2)}</span>
                <span
                  className="text-4xl font-extrabold"
                  style={{ color: '#22c55e' }}
                  data-icod-id="src_pages_home_jsx_4f09">
                  ${topDeal.discountPrice?.toFixed(2)}
                </span>
                <span
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full"
                  data-icod-id="src_pages_home_jsx_edba">
                  Save {savings}%
                </span>
              </div>
            )}

            <p
              className="text-gray-300 text-lg mb-8 max-w-lg mx-auto lg:mx-0"
              data-icod-id="src_pages_home_jsx_d91c">
              {topDeal?.description || 'AI Tools, Streaming, VPNs, Software Keys & More — Delivered Instantly'}
            </p>

            {/* Countdown */}
            {endDate && (
              <div className="mb-8" data-icod-id="src_pages_home_jsx_b336">
                <p
                  className="text-gray-400 text-sm mb-3 uppercase tracking-wider font-medium"
                  data-icod-id="src_pages_home_jsx_61aa">Deal ends in:</p>
                <div
                  className="flex gap-3 justify-center lg:justify-start"
                  data-icod-id="src_pages_home_jsx_d378">
                  <CountdownUnit value={countdown.days} label="Days" />
                  <CountdownUnit value={countdown.hours} label="Hours" />
                  <CountdownUnit value={countdown.mins} label="Mins" />
                  <CountdownUnit value={countdown.secs} label="Secs" />
                </div>
              </div>
            )}

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              data-icod-id="src_pages_home_jsx_8d9f">
              <Link
                to={topDeal ? `/products/${topDeal.slug}` : '/shop'}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
              >
                {topDeal ? 'Grab This Deal' : 'Browse Products'} <ArrowRight size={20} />
              </Link>
              <Link
                to="/shop"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
              >
                View All Deals
              </Link>
            </div>
          </div>

          {/* Product image side */}
          {topDeal?.images?.[0] && (
            <div
              className="flex-shrink-0 w-full max-w-sm lg:max-w-md"
              data-icod-id="src_pages_home_jsx_a4ac">
              <div className="relative" data-icod-id="src_pages_home_jsx_f58a">
                <div
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-3xl blur-xl"
                  data-icod-id="src_pages_home_jsx_0274" />
                <img
                  src={topDeal.images[0]}
                  alt={topDeal.name}
                  className="relative rounded-3xl w-full aspect-video object-cover shadow-2xl border border-white/10"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  data-icod-id="src_pages_home_jsx_7d3e" />
                {topDeal?.deal && (
                  <div
                    className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-2xl shadow-lg"
                    data-icod-id="src_pages_home_jsx_7234">
                    -{topDeal.deal.discountPercent}% OFF
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryShowcase({ categories }) {
  if (!categories.length) return null;

  return (
    <section className="py-16 bg-gray-950" data-icod-id="src_pages_home_jsx_bc56">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_home_jsx_7934">
        <div className="text-center mb-10" data-icod-id="src_pages_home_jsx_9a24">
          <h2
            className="text-3xl font-bold text-white mb-2"
            data-icod-id="src_pages_home_jsx_4583">Shop by Category</h2>
          <p className="text-gray-400" data-icod-id="src_pages_home_jsx_0e22">Find exactly what you're looking for</p>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          data-icod-id="src_pages_home_jsx_9878">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-800"
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  data-icod-id={`src_pages_home_jsx_bbec_${cat._id}`} />
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/60 transition-all duration-500"
                data-icod-id={`src_pages_home_jsx_a860_${cat._id}`} />
              <div
                className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300"
                data-icod-id={`src_pages_home_jsx_8e26_${cat._id}`}>
                <p
                  className="text-white text-sm font-semibold text-center drop-shadow backdrop-blur-sm"
                  data-icod-id={`src_pages_home_jsx_af29_${cat._id}`}>
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopDealsSection({ deals }) {
  if (!deals.length) return null;

  return (
    <section
      className="py-16 bg-gray-950 border-t border-gray-800"
      data-icod-id="src_pages_home_jsx_e853">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-icod-id="src_pages_home_jsx_4913">
        <div
          className="flex items-center gap-3 mb-10"
          data-icod-id="src_pages_home_jsx_793c">
          <div data-icod-id="src_pages_home_jsx_cc6f">
            <h2
              className="text-3xl font-bold text-white flex items-center gap-2"
              data-icod-id="src_pages_home_jsx_b9cf">
              Top Deals <Flame className="text-amber-400" size={28} />
            </h2>
            <div
              className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-2"
              data-icod-id="src_pages_home_jsx_f01c" />
          </div>
          <div className="ml-auto" data-icod-id="src_pages_home_jsx_3aaf">
            <Link to="/shop" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-icod-id="src_pages_home_jsx_fe80">
          {deals.map((product) => (
            <DealCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DealCard({ product }) {
  const deal = product.deal;
  const endDate = deal?.endDate;
  const countdown = useCountdown(endDate);
  const savings = product.basePrice && product.discountPrice
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : deal?.discountPercent || 0;

  const hoursLeft = countdown.days * 24 + countdown.hours;

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div
        className="relative bg-gray-900 border border-gray-700 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10"
        data-icod-id="src_pages_home_jsx_f598">
        {/* Deal ribbon */}
        {deal?.dealLabel && (
          <div
            className="absolute top-0 right-0 z-10"
            data-icod-id="src_pages_home_jsx_1fe8">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl"
              data-icod-id="src_pages_home_jsx_42ab">
              {deal.dealLabel}
            </div>
          </div>
        )}

        {/* Image */}
        {product.images?.[0] && (
          <div
            className="relative overflow-hidden aspect-video bg-gray-800"
            data-icod-id="src_pages_home_jsx_154f">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.src = 'https://placehold.co/400x225/1e293b/6366f1?text=Deal'; }}
              data-icod-id="src_pages_home_jsx_6488" />
            <div
              className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"
              data-icod-id="src_pages_home_jsx_4f9f" />
            <div
              className="absolute bottom-2 left-2 bg-green-500/90 text-white text-sm font-bold px-3 py-1 rounded-full"
              data-icod-id="src_pages_home_jsx_379c">
              Save {savings}%
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4" data-icod-id="src_pages_home_jsx_fc72">
          {product.category && (
            <span
              className="text-xs font-medium text-indigo-400 bg-indigo-900/40 px-2 py-0.5 rounded-full mb-2 inline-block"
              data-icod-id="src_pages_home_jsx_4a83">
              {product.category.name}
            </span>
          )}
          <h3
            className="font-semibold text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors"
            data-icod-id="src_pages_home_jsx_5561">
            {product.name}
          </h3>

          {product.rating > 0 && <StarRating rating={product.rating} />}

          {/* Prices */}
          <div
            className="flex items-baseline gap-2 mt-2 mb-3"
            data-icod-id="src_pages_home_jsx_55bb">
            <span
              className="text-xl font-bold"
              style={{ color: '#22c55e' }}
              data-icod-id="src_pages_home_jsx_71a8">
              ${product.discountPrice?.toFixed(2)}
            </span>
            <span
              className="text-gray-500 line-through text-sm"
              data-icod-id="src_pages_home_jsx_30c0">
              ${product.basePrice?.toFixed(2)}
            </span>
          </div>

          {/* Mini countdown */}
          {endDate && (
            <div
              className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 font-mono"
              data-icod-id="src_pages_home_jsx_a473">
              <span data-icod-id="src_pages_home_jsx_6883">Ends in:</span>
              <span
                className="bg-gray-800 px-1.5 py-0.5 rounded text-white"
                data-icod-id="src_pages_home_jsx_df56">{String(hoursLeft).padStart(2, '0')}h</span>
              <span data-icod-id="src_pages_home_jsx_68d7">:</span>
              <span
                className="bg-gray-800 px-1.5 py-0.5 rounded text-white"
                data-icod-id="src_pages_home_jsx_dadc">{String(countdown.mins).padStart(2, '0')}m</span>
              <span data-icod-id="src_pages_home_jsx_814f">:</span>
              <span
                className="bg-gray-800 px-1.5 py-0.5 rounded text-white"
                data-icod-id="src_pages_home_jsx_00df">{String(countdown.secs).padStart(2, '0')}s</span>
            </div>
          )}

          <button
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
            data-icod-id="src_pages_home_jsx_cdbf">
            Grab Deal
          </button>
        </div>
      </div>
    </Link>
  );
}

const trustBadges = [
  { icon: <Zap size={22} />, title: 'Instant Delivery', desc: 'Credentials delivered immediately after payment' },
  { icon: <Shield size={22} />, title: 'Secure Payment', desc: 'Multiple safe payment methods accepted' },
  { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
  { icon: <RefreshCw size={22} />, title: 'Money-Back Guarantee', desc: 'Not satisfied? We\'ll refund you' },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [topDeals, setTopDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, featuredData, dealsData] = await Promise.all([
          productService.getActiveCategories().catch(() => []),
          productService.getFeaturedProducts().catch(() => []),
          productService.getTopDeals().catch(() => []),
        ]);
        setCategories(categoriesData || []);
        setFeatured(featuredData || []);
        setTopDeals(dealsData || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Hero: pick top deal product with highest savings
  const heroProduct = topDeals.length > 0
    ? topDeals.reduce((best, p) => {
        const savings = (p.basePrice || 0) - (p.discountPrice || 0);
        const bestSavings = (best.basePrice || 0) - (best.discountPrice || 0);
        return savings > bestSavings ? p : best;
      }, topDeals[0])
    : null;

  return (
    <div
      className="min-h-screen bg-gray-950"
      data-icod-id="src_pages_home_jsx_9fdf">
      {/* Hero */}
      <HeroSection topDeal={heroProduct} />
      {/* Trust Badges */}
      <section
        className="bg-gray-900 border-y border-gray-800"
        data-icod-id="src_pages_home_jsx_a532">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          data-icod-id="src_pages_home_jsx_feab">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            data-icod-id="src_pages_home_jsx_546b">
            {trustBadges.map((badge, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
                data-icod-id={`src_pages_home_jsx_d237_${i}`}>
                <div
                  className="text-indigo-400 shrink-0"
                  data-icod-id={`src_pages_home_jsx_a01d_${i}`}>{badge.icon}</div>
                <div data-icod-id={`src_pages_home_jsx_b2a9_${i}`}>
                  <p
                    className="font-semibold text-white text-sm"
                    data-icod-id={`src_pages_home_jsx_4955_${i}`}>{badge.title}</p>
                  <p
                    className="text-xs text-gray-400"
                    data-icod-id={`src_pages_home_jsx_fa79_${i}`}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Category Showcase */}
      <CategoryShowcase categories={categories} />
      {/* Featured Products */}
      {featured.length > 0 && (
        <section
          className="py-16 bg-gray-900 border-t border-gray-800"
          data-icod-id="src_pages_home_jsx_a517">
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            data-icod-id="src_pages_home_jsx_2690">
            <div
              className="flex items-end justify-between mb-10"
              data-icod-id="src_pages_home_jsx_dabf">
              <div data-icod-id="src_pages_home_jsx_ec47">
                <h2
                  className="text-3xl font-bold text-white mb-2"
                  data-icod-id="src_pages_home_jsx_1719">Featured Products</h2>
                <div
                  className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  data-icod-id="src_pages_home_jsx_0fd2" />
              </div>
              <Link to="/shop?featured=true" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-icod-id="src_pages_home_jsx_81b8">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} dark />
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Top Deals */}
      <TopDealsSection deals={topDeals} />
      {/* CTA Section */}
      <section
        className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16"
        data-icod-id="src_pages_home_jsx_bb8a">
        <div
          className="max-w-4xl mx-auto text-center px-4"
          data-icod-id="src_pages_home_jsx_576b">
          <h2
            className="text-3xl font-bold text-white mb-4"
            data-icod-id="src_pages_home_jsx_154b">Ready to Get Started?</h2>
          <p
            className="text-indigo-100 text-lg mb-8"
            data-icod-id="src_pages_home_jsx_94b4">
            Join thousands of customers who trust us for their digital needs. Instant delivery, guaranteed.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-icod-id="src_pages_home_jsx_2eb4">
            <Link to="/shop" className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg">
              Shop Now
            </Link>
            <Link to="/track" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3.5 rounded-xl font-semibold transition-colors">
              Track Order
            </Link>
          </div>
          {/* Source attribution as required */}
          <p
            className="text-indigo-200/60 text-xs mt-8"
            data-icod-id="src_pages_home_jsx_1fda">
            Inspired by best practices from{' '}
            <a
              href="https://harisonusa.com/special-offer/?utm_source=openai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
              data-icod-id="src_pages_home_jsx_e1d6">HARISON</a>,{' '}
            <a
              href="https://nationsdistributor.com/?utm_source=openai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
              data-icod-id="src_pages_home_jsx_690c">Nations Distributor</a> &amp;{' '}
            <a
              href="https://nellisliquidation.com/?utm_source=openai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
              data-icod-id="src_pages_home_jsx_51eb">Nellis Liquidation</a>
          </p>
        </div>
      </section>
    </div>
  );
}
