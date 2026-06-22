import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Category from '../models/Category.js';
import Deal from '../models/Deal.js';

export async function getProducts({ category, search, featured, topSelling, page = 1, limit = 12, sort = 'createdAt' }) {
  const filter = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (featured === 'true' || featured === true) filter.isFeatured = true;
  if (topSelling === 'true' || topSelling === true) filter.isTopSelling = true;

  const sortMap = {
    latest: { createdAt: -1 },
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
    createdAt: { createdAt: -1 },
  };
  const sortObj = sortMap[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate('category', 'name slug icon')
    .populate('variants')
    .sort(sortObj)
    .skip(skip)
    .limit(Number(limit));

  return { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
}

export async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug icon image')
    .populate({ path: 'variants', match: { isActive: true } });

  if (!product) throw new Error('Product not found');
  return product;
}

export async function createProduct(data) {
  const product = await Product.create(data);
  return product;
}

export async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!product) throw new Error('Product not found');
  return product;
}

export async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error('Product not found');
  await ProductVariant.deleteMany({ product: id });
  return { success: true };
}

export async function createVariant(productId, data) {
  const variant = await ProductVariant.create({ ...data, product: productId });
  return variant;
}

export async function updateVariant(id, data) {
  const variant = await ProductVariant.findByIdAndUpdate(id, { $set: data }, { new: true });
  if (!variant) throw new Error('Variant not found');
  return variant;
}

export async function deleteVariant(id) {
  const variant = await ProductVariant.findByIdAndDelete(id);
  if (!variant) throw new Error('Variant not found');
  return { success: true };
}

export async function getFeatured(limit = 8) {
  const products = await Product.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug icon image')
    .sort({ createdAt: -1 })
    .limit(limit);
  return products;
}

export async function getTopDeals(limit = 6) {
  const products = await Product.find({ isActive: true, isTopSelling: true })
    .populate('category', 'name slug icon image')
    .sort({ createdAt: -1 })
    .limit(limit);

  const now = new Date();
  const enriched = await Promise.all(
    products.map(async (product) => {
      const deal = await Deal.findOne({
        productId: product._id,
        isActive: true,
        endDate: { $gt: now },
      });
      const obj = product.toObject();
      obj.deal = deal || null;
      return obj;
    })
  );

  return enriched;
}

export async function getRelatedProducts(productId, categoryId, limit = 4) {
  const products = await Product.find({
    category: categoryId,
    _id: { $ne: productId },
    isActive: true,
  })
    .populate('category', 'name slug')
    .populate('variants')
    .limit(limit);
  return products;
}
