const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) cb(new Error('Only images allowed'), false);
    else cb(null, true);
  }
});

// POST /api/uploads (Upload images)
router.post('/', auth, upload.array('images', 5), (req, res) => {
  const files = req.files || [];
  const paths = files.map(f => `/uploads/${f.filename}`);
  res.status(201).json({ files: paths });
});

module.exports = router;

