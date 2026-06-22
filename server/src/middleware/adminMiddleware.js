import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No admin token provided', statusCode: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, error: 'Admin not found', statusCode: 401 });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired admin token', statusCode: 401 });
  }
};

export const superadminMiddleware = async (req, res, next) => {
  if (!req.admin || req.admin.role !== 'superadmin') {
    return res.status(403).json({ success: false, error: 'Superadmin access required', statusCode: 403 });
  }
  next();
};
