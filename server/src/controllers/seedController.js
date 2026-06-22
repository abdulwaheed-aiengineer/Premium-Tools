import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Deal from '../models/Deal.js';

const CATEGORIES = [
  {
    name: 'Streaming Services',
    slug: 'streaming-services',
    description: 'Premium streaming subscriptions for movies, music & more',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600',
    isActive: true,
    order: 1,
  },
  {
    name: 'Software & Apps',
    slug: 'software-apps',
    description: 'Productivity, security & creative software licenses',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    isActive: true,
    order: 2,
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Game keys, subscriptions & in-game currency',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    isActive: true,
    order: 3,
  },
  {
    name: 'Gift Cards',
    slug: 'gift-cards',
    description: 'Digital gift cards for all major platforms',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
    isActive: true,
    order: 4,
  },
  {
    name: 'VPN & Security',
    slug: 'vpn-security',
    description: 'VPN services, antivirus & security tools',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600',
    isActive: true,
    order: 5,
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'Online courses, certifications & learning platforms',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600',
    isActive: true,
    order: 6,
  },
];

// Products keyed by SKU; categorySlug resolved after category upserts
const PRODUCT_TEMPLATES = [
  {
    name: 'Netflix Premium 1-Month',
    slug: 'netflix-premium-1-month',
    description: 'Unlimited movies, TV shows & more in Ultra HD on all your devices.',
    SKU: 'NET-PREM-1M',
    basePrice: 19.99,
    discountPrice: 12.99,
    categorySlug: 'streaming-services',
    isFeatured: true,
    isTopDeal: true,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400',
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400',
    ],
    tags: ['netflix', 'streaming', 'movies', 'tv'],
  },
  {
    name: 'Spotify Premium 3-Month',
    slug: 'spotify-premium-3-month',
    description: 'Ad-free music streaming with offline downloads and unlimited skips.',
    SKU: 'SPO-PREM-3M',
    basePrice: 29.99,
    discountPrice: 17.99,
    categorySlug: 'streaming-services',
    isFeatured: true,
    isTopDeal: false,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400',
    ],
    tags: ['spotify', 'music', 'streaming', 'audio'],
  },
  {
    name: 'Microsoft Office 365',
    slug: 'microsoft-office-365',
    description: 'Complete productivity suite including Word, Excel, PowerPoint & Teams — 1-year license.',
    SKU: 'MS-O365-1Y',
    basePrice: 99.99,
    discountPrice: 59.99,
    categorySlug: 'software-apps',
    isFeatured: true,
    isTopDeal: true,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400',
    ],
    tags: ['microsoft', 'office', 'productivity', 'software'],
  },
  {
    name: 'Adobe Creative Cloud',
    slug: 'adobe-creative-cloud',
    description: 'Full access to Photoshop, Illustrator, Premiere Pro & all 20+ creative apps.',
    SKU: 'ADOBE-CC-1M',
    basePrice: 54.99,
    discountPrice: 34.99,
    categorySlug: 'software-apps',
    isFeatured: true,
    isTopDeal: false,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    ],
    tags: ['adobe', 'creative', 'design', 'software'],
  },
  {
    name: 'PlayStation Store $50',
    slug: 'playstation-store-50',
    description: 'Add $50 credit to your PlayStation Network wallet. Works on PS4 & PS5.',
    SKU: 'PSN-GIFT-50',
    basePrice: 50.0,
    discountPrice: 44.99,
    categorySlug: 'gaming',
    isFeatured: false,
    isTopDeal: true,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400',
    ],
    tags: ['playstation', 'psn', 'gaming', 'gift card'],
  },
  {
    name: 'Xbox Game Pass Ultimate 3M',
    slug: 'xbox-game-pass-ultimate-3m',
    description: 'Access 100+ high-quality games on console, PC & cloud. Includes Xbox Live Gold.',
    SKU: 'XBOX-GPU-3M',
    basePrice: 44.99,
    discountPrice: 29.99,
    categorySlug: 'gaming',
    isFeatured: true,
    isTopDeal: true,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400',
    ],
    tags: ['xbox', 'game pass', 'gaming', 'microsoft'],
  },
  {
    name: 'Amazon Gift Card $100',
    slug: 'amazon-gift-card-100',
    description: 'Shop anything on Amazon — electronics, fashion, groceries & more. Never expires.',
    SKU: 'AMZ-GIFT-100',
    basePrice: 100.0,
    discountPrice: 94.99,
    categorySlug: 'gift-cards',
    isFeatured: true,
    isTopDeal: false,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
    ],
    tags: ['amazon', 'gift card', 'shopping'],
  },
  {
    name: 'Steam Wallet $20',
    slug: 'steam-wallet-20',
    description: 'Add $20 to your Steam Wallet. Buy games, DLC, software & in-game items.',
    SKU: 'STM-WALL-20',
    basePrice: 20.0,
    discountPrice: 18.99,
    categorySlug: 'gaming',
    isFeatured: false,
    isTopDeal: false,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    ],
    tags: ['steam', 'gaming', 'valve', 'wallet'],
  },
  {
    name: 'NordVPN 1-Year',
    slug: 'nordvpn-1-year',
    description: 'Military-grade encryption, 5400+ servers in 60 countries. Protect all your devices.',
    SKU: 'NORD-VPN-1Y',
    basePrice: 59.99,
    discountPrice: 29.99,
    categorySlug: 'vpn-security',
    isFeatured: true,
    isTopDeal: true,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    ],
    tags: ['nordvpn', 'vpn', 'security', 'privacy'],
  },
  {
    name: 'ExpressVPN 6-Month',
    slug: 'expressvpn-6-month',
    description: 'Ultra-fast VPN with 3000+ servers in 94 countries. Blazing speeds guaranteed.',
    SKU: 'EXPR-VPN-6M',
    basePrice: 49.99,
    discountPrice: 27.99,
    categorySlug: 'vpn-security',
    isFeatured: false,
    isTopDeal: false,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400',
    ],
    tags: ['expressvpn', 'vpn', 'security', 'privacy'],
  },
  {
    name: 'Coursera Plus Annual',
    slug: 'coursera-plus-annual',
    description: 'Unlimited access to 7000+ courses, certificates & specializations from top universities.',
    SKU: 'COUR-PLUS-1Y',
    basePrice: 399.99,
    discountPrice: 199.99,
    categorySlug: 'education',
    isFeatured: true,
    isTopDeal: false,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
    ],
    tags: ['coursera', 'education', 'online learning', 'courses'],
  },
  {
    name: 'Discord Nitro 1-Year',
    slug: 'discord-nitro-1-year',
    description: 'Custom emoji, animated avatar, boosted upload limit & HD video streaming — all year.',
    SKU: 'DISC-NIT-1Y',
    basePrice: 99.99,
    discountPrice: 59.99,
    categorySlug: 'software-apps',
    isFeatured: false,
    isTopDeal: true,
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400',
    ],
    tags: ['discord', 'nitro', 'chat', 'gaming'],
  },
];

export async function seedDatabase(req, res, next) {
  try {
    // 1. Upsert categories
    const categoryMap = {};
    let categoriesSeeded = 0;

    for (const catData of CATEGORIES) {
      const cat = await Category.findOneAndUpdate(
        { slug: catData.slug },
        { $set: catData },
        { upsert: true, new: true }
      );
      categoryMap[catData.slug] = cat._id;
      categoriesSeeded++;
    }

    // 2. Upsert products
    let productsSeeded = 0;
    const topDealProducts = [];

    for (const tmpl of PRODUCT_TEMPLATES) {
      const { categorySlug, SKU, isTopDeal, rating, ...productData } = tmpl;

      const doc = await Product.findOneAndUpdate(
        { slug: tmpl.slug },
        {
          $set: {
            ...productData,
            category: categoryMap[categorySlug],
            isTopSelling: isTopDeal,
            inStock: true,
            isActive: true,
            rating: rating,
            tags: tmpl.tags,
          },
        },
        { upsert: true, new: true }
      );

      productsSeeded++;

      if (isTopDeal) {
        topDealProducts.push({ doc, basePrice: tmpl.basePrice, discountPrice: tmpl.discountPrice });
      }
    }

    // 3. Upsert deals for top deal products
    // Sort by savings descending to assign labels
    const sorted = [...topDealProducts].sort(
      (a, b) => (b.basePrice - b.discountPrice) - (a.basePrice - a.discountPrice)
    );

    const now = new Date();
    const flash48End = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const weekendEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let dealsSeeded = 0;

    for (let i = 0; i < sorted.length; i++) {
      const { doc, basePrice, discountPrice } = sorted[i];
      const discountPercent = Math.round(((basePrice - discountPrice) / basePrice) * 100);
      const isFlash = i < 2;
      const dealLabel = isFlash ? '48hr Flash Sale' : 'Weekend Deal';
      const endDate = isFlash ? flash48End : weekendEnd;

      await Deal.findOneAndUpdate(
        { productId: doc._id, dealLabel },
        {
          $set: {
            productId: doc._id,
            discountPercent,
            dealLabel,
            startDate: now,
            endDate,
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );

      dealsSeeded++;
    }

    res.json({
      success: true,
      categoriesSeeded,
      productsSeeded,
      dealsSeeded,
    });
  } catch (err) {
    next(err);
  }
}
