require('dotenv').config();
const { sendPasswordResetEmail } = require('./services/emailService');

async function testEmail() {
  console.log('🧪 Testing email configuration...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured in .env file');
    return;
  }
  
  const testEmail = process.env.EMAIL_USER; // Send test email to yourself
  const testCode = '123456';
  
  console.log(`📧 Sending test email to: ${testEmail}`);
  
  const result = await sendPasswordResetEmail(testEmail, testCode);
  
  if (result.success) {
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
  } else {
    console.error('❌ Test email failed:', result.error);
    
    if (result.error.includes('EAUTH')) {
      console.log('\n🔧 Email Authentication Fix:');
      console.log('1. Enable 2-Factor Authentication on your Gmail account');
      console.log('2. Generate an App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use the App Password (not your regular password) in EMAIL_PASS');
      console.log('4. Make sure EMAIL_USER is your full Gmail address');
    }
  }
}

testEmail().catch(console.error);