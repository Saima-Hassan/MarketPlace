const Product = require('../models/Product');
const path = require('path');
const sanitize = require('sanitize-filename');

exports.getUploadForm = (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('upload', { error: null });
};

exports.postUpload = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const { title, description, category } = req.body;
  if (!req.file) return res.render('upload', { error: 'File is required.' });
  try {
    // File size validation (max 10MB)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.render('upload', { error: 'File too large. Max 10MB.' });
    }
    // Sanitize file name
    const sanitized = sanitize(req.file.originalname);
    const fs = require('fs');
    const path = require('path');
    const oldPath = req.file.path;
    const newPath = path.join(path.dirname(oldPath), Date.now() + '-' + sanitized);
    fs.renameSync(oldPath, newPath);
    const product = new Product({
      title,
      description,
      category,
      file: '/uploads/' + path.basename(newPath),
      uploadedBy: req.session.userId,
    });
    await product.save();
    req.flash('success', 'File uploaded successfully!');
    res.redirect('/my-products');
  } catch (err) {
    res.render('upload', { error: 'Upload failed. Try again.' });
  }
};

exports.getMyProducts = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const products = await Product.find({ uploadedBy: req.session.userId }).sort({ uploadDate: -1 });
  res.render('my-products', { products });
};

exports.listProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const filter = {};
  if (req.query.category && req.query.category !== 'All') {
    filter.category = req.query.category;
  }
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter).sort({ uploadDate: -1 }).skip(skip).limit(limit);
  const totalPages = Math.ceil(total / limit);
  res.render('products', {
    products,
    currentPage: page,
    totalPages,
    isLoggedIn: !!req.session.userId,
    selectedCategory: req.query.category || 'All'
  });
};

exports.galleryProducts = async (req, res) => {
  const { search = '', category = 'All' } = req.query;
  const filter = {};
  if (category && category !== 'All') filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  const products = await Product.find(filter).populate('uploadedBy', 'name').sort({ uploadDate: -1 });
  res.render('gallery', { products, search, selectedCategory: category });
};

exports.productDetail = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('uploadedBy', 'name');
  if (!product) return res.status(404).send('Product not found');
  res.render('product-detail', { product });
};

exports.downloadProduct = async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).send('Product not found');
  product.downloadCount = (product.downloadCount || 0) + 1;
  await product.save();
  const filePath = require('path').join(__dirname, '..', product.file);
  res.download(filePath, err => {
    if (err) res.status(500).send('Could not download file');
  });
};

exports.getTopDownloads = async () => {
  return await Product.find().sort({ downloadCount: -1 }).limit(5);
}; 