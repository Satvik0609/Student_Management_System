# Email Verification Setup Guide

## Overview
The application now includes email verification functionality. When users register, they receive a verification email to confirm their email address.

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Configure Email Service (Gmail)

#### Option A: Using Gmail with App Password (Recommended)

1. **Enable 2-Step Verification:**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification
   - Enable it if not already enabled

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "SRMS Pro" as the name
   - Click "Generate"
   - Copy the 16-character password (you'll use this, not your regular Gmail password)

3. **Add to `.env` file in `backend/` directory:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   FRONTEND_URL=http://localhost:3000
   ```

#### Option B: Development Mode (No Email)
- If email is not configured, the system will still work
- In development mode, verification emails are skipped
- Users can still register and login
- Check backend console for verification token URLs

### 3. Environment Variables
Create or update `backend/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/student-records

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Node Environment
NODE_ENV=development
```

## How It Works

### Registration Flow
1. User registers with email and password
2. System generates a verification token (valid for 24 hours)
3. Verification email is sent to user's email
4. User clicks verification link in email
5. Email is verified and user can access all features

### Verification Email
- Contains a beautiful HTML email template
- Includes a verification button
- Shows verification link as fallback
- Expires after 24 hours

### Frontend Features
- **Verification Banner:** Shows for unverified users with option to resend email
- **Verification Page:** `/verify-email?token=TOKEN` - handles email verification
- **Resend Email:** Users can request a new verification email from the banner

## API Endpoints

### Verify Email
```
GET /api/auth/verify-email?token=VERIFICATION_TOKEN
```

### Resend Verification Email
```
POST /api/auth/resend-verification
Headers: Authorization: Bearer TOKEN
```

## Testing

### Test Email Verification
1. Register a new account
2. Check your email inbox (and spam folder)
3. Click the verification link
4. You should be redirected to login page with success message

### Test Resend Email
1. Login with unverified account
2. You'll see a verification banner at the top
3. Click "Resend Email" button
4. Check your email for new verification link

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify App Password is correct (not regular password)
- Check backend console for error messages
- In development mode, emails are skipped but registration still works

### Verification Link Expired
- Links expire after 24 hours
- Use "Resend Email" button to get a new link

### Email Goes to Spam
- Check spam/junk folder
- Mark as "Not Spam" to improve deliverability
- Consider using a professional email service for production

## Production Considerations

For production, consider:
- Using a professional email service (SendGrid, Mailgun, AWS SES)
- Setting up SPF/DKIM records for better deliverability
- Using environment-specific email templates
- Adding email rate limiting
- Implementing email verification reminders

## Security Notes

- Verification tokens are cryptographically secure (32 bytes random)
- Tokens expire after 24 hours
- Tokens are single-use (removed after verification)
- App passwords are more secure than regular passwords for Gmail

