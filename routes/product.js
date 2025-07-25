const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const sanitize = require('sanitize-filename');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.zip', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .zip, .docx files allowed!'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + sanitize(file.originalname));
  }
});

// Routes
router.get('/upload', productController.getUploadForm);
router.post('/upload', upload.single('file'), productController.postUpload);
router.get('/my-products', productController.getMyProducts);
router.get('/products', productController.galleryProducts);
router.get('/product/:id', productController.productDetail);
router.get('/download/:productId', productController.downloadProduct);

module.exports = router; 