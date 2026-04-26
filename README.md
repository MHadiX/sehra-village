# Sehra Village Website

Official website and Progressive Web App for Sehra Village, Azad Jammu & Kashmir, Pakistan.

🌐 **Live Site:** https://sehravillage.site

## Features

✅ **Multi-page website** - Home, About, News, Gallery, Contact  
✅ **Secure Admin Panel** - Netlify CMS with authentication  
✅ **Content Management** - Add, edit, delete news & gallery  
✅ **Push Notifications** - Real-time updates to all users  
✅ **Progressive Web App** - Installable on mobile devices  
✅ **Fully Responsive** - Works on all screen sizes  
✅ **Contact Form** - Sends emails to contact@sehravillage.site  
✅ **Customizable Settings** - Edit phone, email, population, etc.  

## Setup Instructions

### 1. GitHub Repository Setup

1. Create a new repository on GitHub
2. Push this code to your repository:

```bash
cd sehra-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sehra-village.git
git push -u origin main
```

### 2. Netlify Deployment

1. Go to [Netlify](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Click "Deploy site"

### 3. Custom Domain Setup

1. In Netlify Dashboard → Domain Settings
2. Add custom domain: `sehravillage.site`
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

### 4. Enable Netlify Identity (Admin Authentication)

1. In Netlify Dashboard → Site settings → Identity
2. Click "Enable Identity"
3. Under Registration preferences, select "Invite only"
4. Under External providers, enable if needed
5. Services → Git Gateway → Enable Git Gateway

### 5. Enable Admin Access

1. Visit: `https://sehravillage.site/admin`
2. Click "Sign up" (first time only)
3. Check your email for invitation
4. Set your password
5. You now have admin access!

**Important:** Only YOU can access the admin panel. Invite-only prevents unauthorized access.

### 6. Configure Environment Variables

In Netlify Dashboard → Site settings → Environment variables, add:

**For Email Function:**
```
EMAIL_USER = your-gmail@gmail.com
EMAIL_PASS = your-app-specific-password
```

To get Gmail App Password:
1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail"
4. Use that password in EMAIL_PASS

**For Push Notifications:**

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

Then add to Netlify:
```
VAPID_PUBLIC_KEY = <your-public-key>
VAPID_PRIVATE_KEY = <your-private-key>
```

**For Database (Optional - for push subscriptions):**

If using FaunaDB:
```
FAUNA_SECRET = <your-fauna-secret>
```

1. Sign up at [FaunaDB](https://fauna.com)
2. Create database called "sehra-village"
3. Create collection "push_subscriptions"
4. Get secret key from Security settings

### 7. Install Dependencies

Netlify will auto-install, but for local development:

```bash
npm install
```

### 8. Local Development

```bash
npm run dev
```

Visit http://localhost:8888

## Admin Panel Usage

### Accessing Admin

Visit: `https://sehravillage.site/admin`

### Managing Content

**Site Settings:**
- Edit phone number, email, population, schools, mosques
- Update village location and map coordinates

**News & Updates:**
- Add new news articles
- Edit existing news
- Delete old news
- Set category (Development, Community, Education, etc.)

**Gallery:**
- Upload images with titles and descriptions
- Images are automatically optimized
- Reorder gallery items

**Main Page Cards:**
- Edit the 3 main highlight cards on homepage
- Change images, icons, titles, descriptions

**Notice & Upcoming:**
- Update notice board content
- Update upcoming events section

**Push Notifications:**
- Send custom notifications to all app users
- Automatic notifications for new news

### Content Publishing

1. Make changes in admin panel
2. Click "Publish" or "Save"
3. Changes go live immediately
4. Push notifications sent automatically (if enabled)

## Push Notifications

### How It Works

1. Users visit website
2. Banner asks to enable notifications
3. Users click "Enable"
4. They receive notifications for:
   - New news articles
   - New notices
   - New upcoming events
   - Custom notifications from admin

### Sending Custom Notifications

1. Go to Admin → Push Notifications
2. Create new notification
3. Enter title and message
4. Check "Send Immediately"
5. Publish

## Progressive Web App (PWA)

### Installation

**On Mobile (Android/iOS):**
1. Visit sehravillage.site in browser
2. Tap "Add to Home Screen" banner
3. App icon appears on home screen

**On Desktop (Chrome/Edge):**
1. Visit sehravillage.site
2. Click install icon in address bar
3. App opens in standalone window

### Features

- Works offline
- Home screen icon
- Push notifications
- Fast loading
- App-like experience

## File Structure

```
sehra-website/
├── index.html                 # Main entry point
├── manifest.json             # PWA manifest
├── sw.js                     # Service Worker
├── netlify.toml              # Netlify config
├── package.json              # Dependencies
├── admin/
│   ├── index.html            # Admin panel entry
│   └── config.yml            # CMS configuration
├── css/
│   └── style.css             # All styles
├── js/
│   ├── config.js             # Site configuration
│   ├── navigation.js         # Page routing
│   ├── pwa.js                # PWA installation
│   ├── notifications.js      # Push notifications
│   └── main.js               # Main logic & page templates
├── netlify/functions/
│   ├── send-email.js         # Contact form emails
│   ├── save-subscription.js  # Save push subscriptions
│   └── send-notification.js  # Send push notifications
├── content/                  # CMS content (auto-created)
│   ├── news/
│   ├── gallery/
│   ├── main-cards/
│   ├── notice.json
│   └── upcoming.json
├── settings/                 # Site settings (auto-created)
│   └── site.json
└── img/                      # Images
    └── uploads/              # User uploads from CMS
```

## Customization

### Changing Colors

Edit in `css/style.css`:

```css
:root {
  --sky: #0e7fc0;           /* Primary blue */
  --green: #2d8a5e;         /* Secondary green */
  --gold: #e8a020;          /* Accent gold */
}
```

### Adding New Pages

1. Add page template in `js/main.js`
2. Add navigation link in `index.html`
3. Update `pages` array in `navigation.js`

### Changing Default Content

Edit default values in `admin/config.yml`

## Security

- Admin panel requires authentication
- Invite-only registration
- HTTPS enabled automatically
- Secure headers configured
- Form submissions validated
- Environment variables for secrets

## Support

For issues or questions:
- Email: contact@sehravillage.site
- Create GitHub issue

## License

© 2026 Sehra Village. All rights reserved.
