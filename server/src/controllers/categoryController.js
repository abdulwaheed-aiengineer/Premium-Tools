import Category from '../models/Category.js';
import Product from '../models/Product.js';

export async function listCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function activeCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function categoryProducts(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found', statusCode: 404 });

    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = { category: category._id, isActive: true };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('variants')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, data: { category, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (err) {
    next(err);
  }
}

export async function adminListCategories(req, res, next) {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateCategory(req, res, next) {
  try {
    const { name, slug, description, isActive, order } = req.body;
    let image = '';
    let icon = req.body.icon || '';
    if (req.file) image = `/uploads/${req.file.filename}`;

    const category = await Category.create({ name, slug, description, icon, image, isActive: isActive !== 'false', order: Number(order) || 0 });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateCategory(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (data.order !== undefined) data.order = Number(data.order);
    if (data.isActive !== undefined) data.isActive = data.isActive !== 'false' && data.isActive !== false;

    const category = await Category.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found', statusCode: 404 });
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, error: 'Category not found', statusCode: 404 });
    res.json({ success: true, data: { success: true } });
  } catch (err) {
    next(err);
  }
}
