import Page from '../models/Page.js';

export async function getPage(req, res, next) {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found', statusCode: 404 });
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
}

export async function adminListPages(req, res, next) {
  try {
    const pages = await Page.find().sort({ slug: 1 });
    res.json({ success: true, data: pages });
  } catch (err) {
    next(err);
  }
}

export async function adminUpsertPage(req, res, next) {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;

    const page = await Page.findOneAndUpdate(
      { slug },
      { $set: { slug, title, content } },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: page });
  } catch (err) {
    next(err);
  }
}
