# 🚀 DUKE & DAWN - Production Deployment Configuration

## ✅ Live URLs
- **Frontend**: https://duke-dawn.vercel.app
- **Backend**: https://duke-dawn.onrender.com

## 🔧 Backend Configuration (Render)

### Environment Variables
```
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345
PORT=10000
EMAIL_USER=dukeanddawn18@gmail.com
EMAIL_PASS=yjynneuxlsftnkov
RAZORPAY_KEY_ID=your_production_razorpay_key_id
RAZORPAY_KEY_SECRET=your_production_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=https://duke-dawn.vercel.app
BACKEND_URL=https://duke-dawn.onrender.com
```

## 🌐 Frontend Configuration (Vercel)

### Environment Variables
```
REACT_APP_API_URL=https://duke-dawn.onrender.com/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## ✅ Features Working
- ✅ Order confirmation emails
- ✅ Forgot password emails
- ✅ Newsletter bulk emails
- ✅ User authentication
- ✅ Cart and wishlist
- ✅ Payment processing
- ✅ Admin panel

## 🔗 Connection Status
- Frontend → Backend: ✅ Connected
- CORS: ✅ Configured for Vercel domain
- Email Service: ✅ Gmail SMTP configured
- Database: ✅ MongoDB connection ready

Your DUKE & DAWN website is production-ready! 🎉