const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const User = require('../models/user');

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getDailyStreak,
  deleteAccount
} = require('../controllers/userController');

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './frontend/private/uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${req.user.id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only .jpeg, .png, and .webp images allowed'));
  }
});

// Unified API endpoints under /api/profile
router.get('/api/profile', authMiddleware, getProfile);
router.put('/api/profile', authMiddleware, updateProfile);
router.put('/api/profile/change-password', authMiddleware, changePassword);
router.post('/api/profile/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.get('/api/profile/streak', authMiddleware, getDailyStreak);
router.delete('/api/profile/delete', authMiddleware, deleteAccount);


module.exports = router;

router.get('/api/profile', authMiddleware, getProfile);