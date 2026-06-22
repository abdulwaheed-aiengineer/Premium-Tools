import Banner from '../models/Banner.js';

export async function listBanners(req, res, next) {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
}

export async function adminListBanners(req, res, next) {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    next(err);
  }
}

export async function adminCreateBanner(req, res, next) {
  try {
    const { title, subtitle, link, isActive, order } = req.body;
    let image = req.body.image || '';
    if (req.file) image = `/uploads/${req.file.filename}`;

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      image,
      link: link || '',
      isActive: isActive !== 'false',
      order: Number(order) || 0,
    });
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateBanner(req, res, next) {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (data.order !== undefined) data.order = Number(data.order);
    if (data.isActive !== undefined) data.isActive = data.isActive !== 'false' && data.isActive !== false;

    const banner = await Banner.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found', statusCode: 404 });
    res.json({ success: true, data: banner });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteBanner(req, res, next) {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).json({ success: false, error: 'Banner not found', statusCode: 404 });
    res.json({ success: true, data: { success: true } });
  } catch (err) {
    next(err);
  }
}
