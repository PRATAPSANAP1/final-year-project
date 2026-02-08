# Email SMTP Setup (Free Gmail)

## Steps to configure Gmail for sending emails:

### 1. Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Under "Signing in to Google", enable "2-Step Verification"

### 2. Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Enter "Jobsy App" as the name
4. Click "Generate"
5. Copy the 16-character password

### 3. Update .env file
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

## Usage Example:

```javascript
const {sendEmail} = require('./utils/emailService');

// Send application confirmation
await sendEmail(
  'candidate@example.com',
  'Application Received',
  '<h1>Thank you for applying!</h1><p>Your application has been received.</p>'
);
```

## Email Templates Available:
- Application confirmation
- Shortlist notification
- Rejection notification
- Interview schedule
- Quiz completion certificate

## Free Limits:
- Gmail: 500 emails/day
- No cost, completely free
