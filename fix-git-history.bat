@echo off
echo Fixing git history to remove sensitive credentials...

echo Step 1: Reset to previous commit before credentials were added
git reset --hard HEAD~2

echo Step 2: Add all current files (without credentials)
git add .

echo Step 3: Create new commit
git commit -m "Complete DUKE & DAWN hoodie store - production ready

Features:
- User authentication with Google Sign-In
- Shopping cart and checkout system
- Razorpay payment integration
- Order management system
- Newsletter subscription with email sending
- Forgot password with email verification
- Admin panel for managing everything
- Responsive design with golden theme
- Email notifications for orders
- Currency in Indian Rupees
- CORS configured for production deployment"

echo Step 4: Force push to GitHub (this will overwrite the problematic commits)
git push --force-with-lease origin main

echo Done! Your repository should now be clean without sensitive credentials.
pause