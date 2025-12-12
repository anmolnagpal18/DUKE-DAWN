const nodemailer = require('nodemailer');

// Simple email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dukeanddawn18@gmail.com',
    pass: 'yjynneuxlsftnkov',
  }
});

console.log('📧 Email service initialized');

const sendOrderConfirmationEmail = async (order) => {
  try {
    console.log('📧 Sending order confirmation email to:', order.shippingInfo.email);
    
    const mailOptions = {
      from: 'dukeanddawn18@gmail.com',
      to: order.shippingInfo.email,
      subject: `Order Confirmation - DUKE & DAWN #${order._id.toString().slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #D4AF37; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">DUKE & DAWN</h1>
          </div>
          <div style="padding: 20px; background: white;">
            <h2>🎉 Order Confirmed!</h2>
            <p>Hi ${order.shippingInfo.name},</p>
            <p>Your order #${order._id.toString().slice(-8)} has been confirmed.</p>
            <p><strong>Total: ₹${order.total.toFixed(2)}</strong></p>
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

const sendPasswordResetEmail = async (user, resetCode) => {
  try {
    console.log('📧 Sending password reset email to:', user.email);
    
    const mailOptions = {
      from: 'dukeanddawn18@gmail.com',
      to: user.email,
      subject: 'Password Reset Code - DUKE & DAWN',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #D4AF37; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">DUKE & DAWN</h1>
          </div>
          <div style="padding: 20px; background: white;">
            <h2>🔑 Password Reset</h2>
            <p>Hi ${user.name},</p>
            <p>Your password reset code is:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold;">
              ${resetCode}
            </div>
            <p>This code expires in 10 minutes.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendPasswordResetEmail
};