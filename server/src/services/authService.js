import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const SALT_ROUNDS = 12;

export async function registerUser({ name, email, password, phone }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed, phone: phone || '' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error('Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  };
}

export async function loginAdmin({ email, password }) {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) throw new Error('Invalid email or password');

  const match = await bcrypt.compare(password, admin.password);
  if (!match) throw new Error('Invalid email or password');

  const secret = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET;
  const token = jwt.sign({ id: admin._id, role: admin.role }, secret, { expiresIn: '12h' });

  return {
    token,
    admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  };
}

export async function seedAdminUser() {
  const password = await bcrypt.hash('Admin@1234', SALT_ROUNDS);
  await Admin.updateOne(
    { email: 'admin@premiumtools.com' },
    { $set: { name: 'Super Admin', email: 'admin@premiumtools.com', password, role: 'superadmin' } },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log('[SEED] Admin user upserted: admin@premiumtools.com');
}

export async function seedDemoUser() {
  const password = await bcrypt.hash('User@1234', SALT_ROUNDS);
  await User.updateOne(
    { email: 'user@premiumtools.com' },
    { $set: { name: 'Demo User', email: 'user@premiumtools.com', password, phone: '', role: 'user' } },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log('[SEED] Demo user upserted: user@premiumtools.com');
}

export async function updateUserProfile(userId, { name, phone }) {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { name, phone } },
    { new: true }
  ).select('-password');
  if (!user) throw new Error('User not found');
  return user;
}

export async function changeUserPassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) throw new Error('Current password is incorrect');

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();
  return { success: true };
}
