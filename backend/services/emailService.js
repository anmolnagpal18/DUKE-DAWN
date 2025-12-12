const nodemailer = require('nodemailer');

// Email transporter with fallback for hosting providers
let transporter;
try {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'dukeanddawn18@gmail.com',
      pass: process.env.EMAIL_PASS || 'yjynneuxlsftnkov',
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
} catch (error) {
  console.error('Email transporter setup failed:', error);
}

console.log('📧 Email service initialized');

const sendOrderConfirmationEmail = async (order) => {

  if (!order.shippingInfo || !order.shippingInfo.email) {
    console.error('❌ No email address found in order');
    return { success: false, error: 'No email address' };
  }

  try {
    console.log('📧 Sending order confirmation email to:', order.shippingInfo.email);
    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; text-align: left;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.size}</td>
        <td style="padding: 10px; text-align: center;">${item.color}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.shippingInfo.email,
      subject: `Order Confirmation - DUKE & DAWN #${order._id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">DUKE & DAWN</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Premium Hoodies</p>
          </div>

          <div style="background: white; padding: 30px;">
            <h2 style="color: #D4AF37; margin: 0 0 20px 0;">Order Confirmed!</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Hi ${order.shippingInfo.name},<br><br>
              Thank you for your order! We're excited to get your premium hoodies to you.
            </p>

            <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Order Details</h3>
              <p style="margin: 5px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
              <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #D4AF37; color: white;">
                  <th style="padding: 12px; text-align: left;">Product</th>
                  <th style="padding: 12px; text-align: center;">Size</th>
                  <th style="padding: 12px; text-align: center;">Color</th>
                  <th style="padding: 12px; text-align: center;">Qty</th>
                  <th style="padding: 12px; text-align: right;">Price</th>
                  <th style="padding: 12px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Subtotal:</span>
                <span>₹${order.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Tax (10%):</span>
                <span>₹${order.tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 15px 0 5px 0; padding-top: 10px; border-top: 2px solid #D4AF37; font-weight: bold; font-size: 18px;">
                <span>Total:</span>
                <span style="color: #D4AF37;">₹${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <h3 style="color: #333; margin: 0 0 15px 0;">Shipping Address</h3>
              <p style="margin: 0; line-height: 1.6;">
                ${order.shippingInfo.name}<br>
                ${order.shippingInfo.address}<br>
                ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}<br>
                ${order.shippingInfo.country}<br>
                Phone: ${order.shippingInfo.phone}
              </p>
            </div>

            <div style="text-align: center; padding: 30px 0; border-top: 1px solid #eee; margin-top: 30px;">
              <h3 style="color: #D4AF37; margin: 0 0 15px 0;">Thank You for Choosing DUKE & DAWN!</h3>
              <p style="color: #666; line-height: 1.6; margin: 0;">
                We appreciate your business and trust in our premium quality hoodies. 
                Your order will be processed and shipped within 2-3 business days.
              </p>
            </div>
          </div>

          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout after 15 seconds')), 15000)
      )
    ]);
    console.log('✅ Order confirmation email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your Gmail app password.');
    }
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (email, resetCode) => {

  try {
    console.log('📧 Sending password reset email to:', email);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code - DUKE & DAWN',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #D4AF37, #B8941F); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">DUKE & DAWN</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Premium Hoodies</p>
          </div>

          <div style="background: white; padding: 40px; text-align: center;">
            <h2 style="color: #D4AF37; margin: 0 0 20px 0;">Password Reset Request</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              You requested to reset your password. Use the verification code below:
            </p>
            
            <div style="background: #f8f8f8; border: 2px solid #D4AF37; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 10px 0;">Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #D4AF37; letter-spacing: 5px;">
                ${resetCode}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              This code will expire in 10 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>

          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; font-size: 14px;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      `,
    };

    const result = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout after 15 seconds')), 15000)
      )
    ]);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your Gmail app password.');
    }
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendPasswordResetEmail
};