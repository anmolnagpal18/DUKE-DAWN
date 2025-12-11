const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail } = require('../services/emailService');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// Create Razorpay order
exports.createRazorpayOrder = async (req, res) => {
  try {
    // Check if Razorpay is properly configured
    if (!razorpay || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
      // For demo purposes, create a mock order and redirect to COD
      const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
      
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const items = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }));

      const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      const order = new Order({
        user: req.userId,
        items,
        shippingInfo: req.body.shippingInfo,
        paymentMethod: 'online',
        subtotal,
        tax,
        total,
        paymentId: 'demo_payment_' + Date.now(),
        status: 'processing',
      });

      await order.save();
      await Cart.updateOne({ user: req.userId }, { items: [] });

      // Send order confirmation email
      await sendOrderConfirmationEmail(order);

      return res.json({ 
        message: 'Demo order created (Razorpay not configured)', 
        orderId: order._id,
        isDemoOrder: true 
      });
    }

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const options = {
      amount: Math.round(total * 100), // Amount in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify payment and create order
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingInfo } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    
    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const order = new Order({
      user: req.userId,
      items,
      shippingInfo,
      paymentMethod: 'online',
      subtotal,
      tax,
      total,
      paymentId: razorpay_payment_id,
      status: 'processing',
    });

    await order.save();
    await Cart.updateOne({ user: req.userId }, { items: [] });

    // Send order confirmation email
    await sendOrderConfirmationEmail(order);

    res.json({ message: 'Payment verified successfully', orderId: order._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { shippingInfo, paymentMethod } = req.body;

    // Only handle COD orders here
    if (paymentMethod !== 'cod') {
      return res.status(400).json({ message: 'Use payment verification for online payments' });
    }

    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const order = new Order({
      user: req.userId,
      items,
      shippingInfo,
      paymentMethod: 'cod',
      subtotal,
      tax,
      total,
    });

    await order.save();
    await Cart.updateOne({ user: req.userId }, { items: [] });

    // Send order confirmation email
    await sendOrderConfirmationEmail(order);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: order._id,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'canceled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
