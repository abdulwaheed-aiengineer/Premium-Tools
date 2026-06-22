import { validationResult } from 'express-validator';
import { registerUser, loginUser, loginAdmin, updateUserProfile, changeUserPassword } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, statusCode: 400 });
    }
    const result = await registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, statusCode: 400 });
    }
    const result = await loginUser(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function adminLogin(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg, statusCode: 400 });
    }
    const result = await loginAdmin(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({ success: false, error: err.message, statusCode: 401 });
    }
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await updateUserProfile(req.user._id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const result = await changeUserPassword(req.user._id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
