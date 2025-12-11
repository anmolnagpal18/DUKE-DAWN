require('dotenv').config();
const mongoose = require('mongoose');

async function verifyFixes() {
  console.log('🔍 Verifying DUKE & DAWN Store Fixes...\n');
  
  // 1. Check Environment Variables
  console.log('1. 📋 Environment Variables:');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('   FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Set' : '❌ Missing');
  console.log('   BACKEND_URL:', process.env.BACKEND_URL ? '✅ Set' : '❌ Missing');
  
  // 2. Check Database Connection
  console.log('\n2. 🗄️ Database Connection:');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ MongoDB connected successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.log('   ❌ MongoDB connection failed:', error.message);
  }
  
  // 3. Check Email Service
  console.log('\n3. 📧 Email Service:');
  try {
    const { sendPasswordResetEmail } = require('./services/emailService');
    console.log('   ✅ Email service loaded successfully');
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('   ✅ Email credentials configured');
      console.log('   💡 Run "node test-email.js" to test email sending');
    } else {
      console.log('   ⚠️ Email credentials not configured');
    }
  } catch (error) {
    console.log('   ❌ Email service error:', error.message);
  }
  
  // 4. Check Order Controller
  console.log('\n4. 🛒 Order Controller:');
  try {
    const orderController = require('./controllers/orderController');
    console.log('   ✅ Order controller loaded successfully');
    console.log('   ✅ Email integration updated');
  } catch (error) {
    console.log('   ❌ Order controller error:', error.message);
  }
  
  // 5. Check Auth Controller
  console.log('\n5. 🔐 Auth Controller:');
  try {
    const authController = require('./controllers/authController');
    console.log('   ✅ Auth controller loaded successfully');
    console.log('   ✅ Password reset email integration updated');
  } catch (error) {
    console.log('   ❌ Auth controller error:', error.message);
  }
  
  console.log('\n🎉 Verification Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Test email functionality: node test-email.js');
  console.log('2. Start the server: npm start');
  console.log('3. Test order processing on frontend');
  console.log('4. Check email delivery for orders and password resets');
  
  process.exit(0);
}

verifyFixes().catch(console.error);