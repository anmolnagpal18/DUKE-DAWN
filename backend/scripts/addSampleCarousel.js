const mongoose = require('mongoose');
require('dotenv').config();

const Carousel = require('../models/Carousel');

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoodie-store';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const sample = new Carousel({
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop',
    alt: 'Lifestyle sample',
    order: 1,
    active: true,
  });

  await sample.save();
  console.log('Sample carousel item saved:', sample._id);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error inserting sample carousel item', err);
  process.exit(1);
});
