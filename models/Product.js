const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String, required: true }, // file path
  category: { type: String, enum: ['Templates', 'Guides', 'Cheat Sheets', 'Other'], default: 'Other' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now },
  downloadCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema); 