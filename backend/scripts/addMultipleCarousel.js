const mongoose = require('mongoose');
require('dotenv').config();

const Carousel = require('../models/Carousel');

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoodie-store';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // sample images (Unsplash) - up to 6
  const samples = [
    { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop', alt: 'Lifestyle sample 1' },
    { image: 'https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=1200&h=800&fit=crop', alt: 'Lifestyle sample 2' },
    { image: 'https://images.unsplash.com/photo-1520975923180-38c1b8b0b7f8?w=1200&h=800&fit=crop', alt: 'Lifestyle sample 3' },
    { image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop', alt: 'Lifestyle sample 4' },
    { image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&h=800&fit=crop', alt: 'Lifestyle sample 5' },
    { image: 'https://images.unsplash.com/photo-1526178613262-7f3f9d4f7da3?w=1200&h=800&fit=crop', alt: 'Lifestyle sample 6' },
  ];

  // Remove any previous samples we created with same images to avoid duplicates
  const urls = samples.map(s => s.image);
  await Carousel.deleteMany({ image: { $in: urls } });

  const created = [];
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const item = new Carousel({ image: s.image, alt: s.alt, order: i + 1, active: true, isCenter: false });
    await item.save();
    created.push(item);
    console.log('Inserted', item._id.toString());
  }

  // Make the first one center (ensure only one center)
  if (created.length > 0) {
    await Carousel.updateMany({ isCenter: true }, { isCenter: false });
    await Carousel.findByIdAndUpdate(created[0]._id, { isCenter: true });
    console.log('Marked center:', created[0]._id.toString());
  }

  console.log('Done inserting sample carousel items. Total:', created.length);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Error inserting sample carousel items', err);
  process.exit(1);
});
