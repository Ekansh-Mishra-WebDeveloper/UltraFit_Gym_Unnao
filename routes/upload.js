// routes/upload.js (modified to accept both admin and member tokens)
const express = require('express');
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const authMember = require('../middleware/authMember');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Try member auth first, then admin auth
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    await authMember(req, res, () => next());
  } catch (err) {
    // Fallback to admin auth
    protect(req, res, next);
  }
};

router.post('/', optionalAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ultrafit_gym' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;