# DUKE & DAWN - Premium Hoodie Store

A complete e-commerce platform for premium hoodies built with React.js and Node.js.

## 🌟 Features

### Customer Features
- **User Authentication** - Register, login, Google Sign-In, forgot password
- **Product Catalog** - Browse hoodies with filters and search
- **Shopping Cart** - Add, remove, update quantities
- **Checkout System** - Complete order placement with address
- **Payment Integration** - Razorpay for online payments, Cash on Delivery
- **Order Tracking** - View order history and status
- **Newsletter Subscription** - Join mailing list for updates
- **Wishlist** - Save favorite products
- **Product Reviews** - Rate and review products

### Admin Features
- **Dashboard** - Overview of users, orders, products
- **User Management** - View and manage user accounts
- **Product Management** - Add, edit, delete products
- **Order Management** - View and update order status
- **Newsletter Management** - Send newsletters to subscribers
- **Contact Management** - View customer inquiries
- **Review Management** - Moderate product reviews

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Nodemailer** - Email sending
- **Razorpay** - Payment processing

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account for email services
- Razorpay account for payments

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your credentials:
   ```
   MONGODB_URI=mongodb://localhost:27017/hoodie-store
   JWT_SECRET=your_jwt_secret
   PORT=5000
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## 📧 Email Configuration

1. Enable 2-Step Verification in your Gmail account
2. Generate an App Password for the application
3. Use the App Password in the `EMAIL_PASS` environment variable

## 💳 Payment Configuration

1. Create a Razorpay account
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your environment variables

## 🔐 Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs

## 🌐 Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Update environment variables

### Backend (Heroku/Railway)
1. Push to your hosting platform
2. Set environment variables
3. Ensure MongoDB connection

## 📱 Features Overview

- **Responsive Design** - Works on all devices
- **Dark Theme** - Elegant dark UI with golden accents
- **Email Notifications** - Order confirmations and newsletters
- **Admin Dashboard** - Complete management system
- **Secure Authentication** - JWT tokens and Google OAuth
- **Payment Processing** - Razorpay integration
- **Order Management** - Complete order lifecycle

## 🎨 Design

- **Color Scheme** - Dark theme with golden accents (#D4AF37)
- **Typography** - Modern and elegant fonts
- **Layout** - Clean and intuitive user interface
- **Animations** - Smooth transitions and hover effects

## 📞 Support

For support and inquiries, contact: dukeanddawn18@gmail.com

## 📄 License

This project is for educational and portfolio purposes.

---

**DUKE & DAWN** - Premium Hoodies for Every Style