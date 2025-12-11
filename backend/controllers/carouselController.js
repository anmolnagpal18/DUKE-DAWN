const Carousel = require('../models/Carousel');

// Public: get active carousel items ordered by `order`
exports.getPublicCarousel = async (req, res) => {
  try {
    // find the center item if any
    const center = await Carousel.findOne({ active: true, isCenter: true }).sort({ order: 1 }).lean();

    // return up to 6 active rotating items that are NOT the center
    const query = { active: true };
    if (center && center._id) query._id = { $ne: center._id };

    const items = await Carousel.find(query).sort({ order: 1 }).limit(6).lean();

    res.json({ items, center });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carousel items', error: error.message });
  }
};

// Admin: list all items
exports.getAll = async (req, res) => {
  try {
    const items = await Carousel.find().sort({ order: 1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carousel items', error: error.message });
  }
};

// Admin: create item
exports.create = async (req, res) => {
  try {
    const { image, alt, product, order, active, isCenter } = req.body;
    if (!image) return res.status(400).json({ message: 'Image URL is required' });
    // if isCenter is true, unset previous center
    if (isCenter) {
      await Carousel.updateMany({ isCenter: true }, { isCenter: false });
    }

    const item = new Carousel({ image, alt, product, order: order || 0, active: active !== false, isCenter: !!isCenter });
    await item.save();
    res.status(201).json({ message: 'Carousel item created', item });
  } catch (error) {
    res.status(500).json({ message: 'Error creating carousel item', error: error.message });
  }
};

// Admin: update item
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.isCenter) {
      // unset other centers
      await Carousel.updateMany({ isCenter: true }, { isCenter: false });
    }
    const item = await Carousel.findByIdAndUpdate(id, update, { new: true });
    if (!item) return res.status(404).json({ message: 'Carousel item not found' });
    res.json({ message: 'Carousel item updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating carousel item', error: error.message });
  }
};

// Admin: delete item
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Carousel.findByIdAndDelete(id);
    res.json({ message: 'Carousel item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting carousel item', error: error.message });
  }
};
