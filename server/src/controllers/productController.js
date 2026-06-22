import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
  getRelatedProducts,
  getFeatured,
  getTopDeals,
} from '../services/productService.js';

export async function listProducts(req, res, next) {
  try {
    const { category, search, featured, topSelling, page, limit, sort } = req.query;
    const result = await getProducts({ category, search, featured, topSelling, page, limit, sort });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function productDetail(req, res, next) {
  try {
    const product = await getProductBySlug(req.params.slug);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminListProducts(req, res, next) {
  try {
    const { category, search, page, limit, sort } = req.query;
    const result = await getProducts({ category, search, page, limit, sort });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateProduct(req, res, next) {
  try {
    const { name, slug, description, longDescription, category, basePrice, discountPrice, isActive, inStock, isFeatured, isTopSelling, tags } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((f) => `/uploads/${f.filename}`);
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const product = await createProduct({
      name,
      slug,
      description,
      longDescription,
      images,
      category,
      basePrice: Number(basePrice),
      discountPrice: Number(discountPrice) || 0,
      isActive: isActive !== 'false',
      inStock: inStock !== 'false',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isTopSelling: isTopSelling === 'true' || isTopSelling === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
    });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateProduct(req, res, next) {
  try {
    const data = { ...req.body };

    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    if (data.basePrice) data.basePrice = Number(data.basePrice);
    if (data.discountPrice !== undefined) data.discountPrice = Number(data.discountPrice);
    if (data.tags && typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t) => t.trim());
    }

    const product = await updateProduct(req.params.id, data);
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteProduct(req, res, next) {
  try {
    const result = await deleteProduct(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateVariant(req, res, next) {
  try {
    const data = { ...req.body };
    if (data.price) data.price = Number(data.price);
    if (data.discountPrice !== undefined) data.discountPrice = Number(data.discountPrice);
    const variant = await createVariant(req.params.productId, data);
    res.status(201).json({ success: true, data: variant });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateVariant(req, res, next) {
  try {
    const data = { ...req.body };
    if (data.price) data.price = Number(data.price);
    if (data.discountPrice !== undefined) data.discountPrice = Number(data.discountPrice);
    const variant = await updateVariant(req.params.variantId, data);
    res.json({ success: true, data: variant });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteVariant(req, res, next) {
  try {
    const result = await deleteVariant(req.params.variantId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function relatedProducts(req, res, next) {
  try {
    const { productId, categoryId } = req.query;
    const products = await getRelatedProducts(productId, categoryId);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function featuredProducts(req, res, next) {
  try {
    const products = await getFeatured();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function topDealsProducts(req, res, next) {
  try {
    const products = await getTopDeals();
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}
