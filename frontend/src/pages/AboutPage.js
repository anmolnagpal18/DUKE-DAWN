import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <div className="bg-black border-b border-gold-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gold-400 mb-4">
            About Vibe Hoodies
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Crafting premium hoodies that define your vibe since day one.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gold-400 mb-6">Our Story</h2>
            <p className="text-gray-400 mb-4">
              Vibe Hoodies was born from a simple belief: comfort and style shouldn't be compromised. We started with a vision to create hoodies that not only look great but feel incredible to wear.
            </p>
            <p className="text-gray-400">
              Every piece we create is designed with attention to detail, using premium materials and craftsmanship. Our mission is to provide you with hoodies that match your lifestyle and express your unique vibe.
            </p>
          </div>
          <div className="bg-dark-800 h-64 rounded-lg border border-gold-500 flex items-center justify-center">
            <p className="text-gold-400 text-xl">Our Story Image</p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gold-400 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-800 p-6 rounded-lg border border-gold-500 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-white mb-3">Quality First</h3>
              <p className="text-gray-400">
                We use only premium materials and ensure every stitch meets our high standards.
              </p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg border border-gold-500 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-white mb-3">Unique Design</h3>
              <p className="text-gray-400">
                Each collection is carefully designed to stand out and express individuality.
              </p>
            </div>
            <div className="bg-dark-800 p-6 rounded-lg border border-gold-500 text-center">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-xl font-bold text-white mb-3">Sustainability</h3>
              <p className="text-gray-400">
                We're committed to ethical production and sustainable practices.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-dark-800 rounded-lg border border-gold-500 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gold-400 mb-8 text-center">Why Choose Vibe Hoodies?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <span className="text-gold-400 text-2xl">✓</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Premium Materials</h3>
                <p className="text-gray-400">Soft, durable fabrics that last.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-gold-400 text-2xl">✓</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Perfect Fit</h3>
                <p className="text-gray-400">Designed for comfort and style.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-gold-400 text-2xl">✓</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Limited Editions</h3>
                <p className="text-gray-400">Exclusive drops you won't find anywhere else.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-gold-400 text-2xl">✓</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Fast Shipping</h3>
                <p className="text-gray-400">Quick delivery to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
