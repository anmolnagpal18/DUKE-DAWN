const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const sampleProducts = [
  // Signature Collection
  {
    name: 'Premium Black Hoodie',
    description: 'Our flagship hoodie made from 100% organic cotton. Comfort meets style with this classic black piece.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    ],
    category: 'signature',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal'],
    stock: 150,
    rating: 4.8,
    numReviews: 124,
    reviews: [],
  },
  {
    name: 'Signature Gold Stripe Hoodie',
    description: 'Elevated comfort with our signature gold striping. Premium blend fabric for ultimate warmth.',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    ],
    category: 'signature',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray'],
    stock: 100,
    rating: 4.9,
    numReviews: 156,
    reviews: [],
  },
  {
    name: 'Oversized Signature Hoodie',
    description: 'Extra comfort with oversized fit. Perfect for those who love a relaxed vibe.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cfffc3f9a7?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cfffc3f9a7?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    ],
    category: 'signature',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Cream', 'Olive'],
    stock: 120,
    rating: 4.7,
    numReviews: 89,
    reviews: [],
  },

  // Limited Drop Collection
  {
    name: 'Limited Edition Holographic Hoodie',
    description: 'Exclusive limited edition with holographic gold accents. Only 50 pieces worldwide.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1548911528-c4f269b6d3b4?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548911528-c4f269b6d3b4?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    ],
    category: 'limited',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    stock: 15,
    limitedDrop: true,
    dropEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    rating: 5,
    numReviews: 34,
    reviews: [],
  },
  {
    name: 'Spring Collection Mint Green Hoodie',
    description: 'Fresh mint green exclusive for spring season. Limited quantities available.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1540932239986-5a1ac13a7d59?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1540932239986-5a1ac13a7d59?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    ],
    category: 'limited',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Mint Green'],
    stock: 40,
    limitedDrop: true,
    dropEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    rating: 4.6,
    numReviews: 45,
    reviews: [],
  },
  {
    name: 'Winter Thermal Hoodie',
    description: 'Maximum warmth with thermal lining. Perfect for cold seasons.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cfffc3f9a7?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cfffc3f9a7?w=500&h=500&fit=crop',
    ],
    category: 'limited',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Navy'],
    stock: 25,
    limitedDrop: true,
    dropEndDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
    rating: 4.8,
    numReviews: 67,
    reviews: [],
  },

  // Regular Collection
  {
    name: 'Basic Black Hoodie',
    description: 'Timeless classic. Perfect everyday hoodie for any occasion.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821552-7fcfa60d2e74?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    stock: 200,
    rating: 4.4,
    numReviews: 234,
    reviews: [],
  },
  {
    name: 'Navy Classic Hoodie',
    description: 'Navy blue never goes out of style. Comfortable fit for everyone.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    stock: 180,
    rating: 4.5,
    numReviews: 198,
    reviews: [],
  },
  {
    name: 'Gray Comfort Hoodie',
    description: 'Soft gray hoodie for ultimate comfort. Great for lounging.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1548911528-c4f269b6d3b4?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548911528-c4f269b6d3b4?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Light Gray'],
    stock: 160,
    rating: 4.3,
    numReviews: 167,
    reviews: [],
  },
  {
    name: 'Cream Neutral Hoodie',
    description: 'Neutral cream color pairs with everything. Essential wardrobe piece.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1516762689617-e1cfffc3f9a7?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cfffc3f9a7?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Cream', 'Off-White'],
    stock: 190,
    rating: 4.6,
    numReviews: 145,
    reviews: [],
  },
  {
    name: 'Olive Green Hoodie',
    description: 'Rich olive green for a sophisticated look. Limited availability.',
    price: 74.99,
    image: 'https://images.unsplash.com/photo-1540932239986-5a1ac13a7d59?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1540932239986-5a1ac13a7d59?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Olive'],
    stock: 130,
    rating: 4.5,
    numReviews: 98,
    reviews: [],
  },
  {
    name: 'Charcoal Pro Hoodie',
    description: 'Professional charcoal hoodie. Great for work or casual wear.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal'],
    stock: 140,
    rating: 4.7,
    numReviews: 112,
    reviews: [],
  },
  {
    name: 'burgundy Statement Hoodie',
    description: 'Bold burgundy color makes a statement. Stand out from the crowd.',
    price: 84.99,
    image: 'https://images.unsplash.com/photo-1548911528-c4f269b6d3b4?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548911528-c4f269b6d3b4?w=500&h=500&fit=crop',
    ],
    category: 'regular',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Burgundy'],
    stock: 75,
    rating: 4.4,
    numReviews: 56,
    reviews: [],
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hoodie-store';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log(`${createdProducts.length} products added to database`);

    await mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
