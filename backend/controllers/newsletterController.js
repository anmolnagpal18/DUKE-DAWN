const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// Email transporter setup
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const existingSubscription = await Newsletter.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();

    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, message } = req.body;
    
    if (!transporter) {
      return res.status(500).json({ message: 'Email configuration not set up' });
    }

    // Test email connection
    try {
      await transporter.verify();
    } catch (emailError) {
      console.error('Email connection failed:', emailError);
      return res.status(500).json({ message: `Email authentication failed: ${emailError.message}` });
    }

    const subscriptions = await Newsletter.find({ isActive: true });
    
    if (subscriptions.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    const emailPromises = subscriptions.map(subscription => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscription.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">DUKE & DAWN</h1>
              <p style="color: white; margin: 5px 0;">Circle of Elegance</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <div style="background: white; padding: 20px; border-radius: 8px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>You received this email because you subscribed to DUKE & DAWN newsletter.</p>
            </div>
          </div>
        `,
      };
      
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    
    res.json({ 
      message: `Newsletter sent successfully to ${subscriptions.length} subscribers` 
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    res.status(500).json({ message: error.message });
  }
};