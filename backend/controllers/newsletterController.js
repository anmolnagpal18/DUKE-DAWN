const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// Email transporter setup with better timeout settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'dukeanddawn18@gmail.com',
    pass: process.env.EMAIL_PASS || 'yjynneuxlsftnkov',
  },
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
  pool: false,
  debug: false,
  logger: false
});

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
  console.log('📧 Newsletter send request received');
  console.log('Request body:', req.body);
  
  try {
    const { subject, message } = req.body;
    
    console.log('Email config:', {
      user: process.env.EMAIL_USER || 'dukeanddawn18@gmail.com',
      pass: process.env.EMAIL_PASS ? '***' : 'yjynneuxlsftnkov'
    });

    const subscriptions = await Newsletter.find({ isActive: true });
    
    if (subscriptions.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    // Send emails without blocking the response
    const sendEmails = async () => {
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

      try {
        await Promise.all(emailPromises);
        console.log(`Newsletter sent successfully to ${subscriptions.length} subscribers`);
      } catch (error) {
        console.error('Some newsletter emails failed to send:', error);
      }
    };

    // Start sending emails in background
    sendEmails();
    
    // Respond immediately
    res.json({ 
      message: `Newsletter is being sent to ${subscriptions.length} subscribers` 
    });
  } catch (error) {
    console.error('❌ Newsletter send error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message,
      error: 'Newsletter processing failed'
    });
  }
};