const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, default: '' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  isCenter: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Carousel', CarouselSchema);
