# 📁 COMPLETE FILE STRUCTURE - SEHRA VILLAGE WEBSITE

```
sehra-website/
│
├── 📄 index.html                       # Main HTML file (header, footer, navigation)
├── 📄 manifest.json                    # PWA manifest (app settings)
├── 📄 sw.js                            # Service Worker (offline support, notifications)
├── 📄 package.json                     # Node.js dependencies
├── 📄 vercel.json                      # Vercel configuration
│
├── 📄 README.md                        # Project documentation
├── 📄 FREE-DEPLOYMENT-GUIDE.md         # Complete deployment guide
├── 📄 SVELTIA-CMS-GUIDE.md            # Sveltia CMS usage guide
├── 📄 cloudflare-worker-auth.js       # Optional: Cloudflare auth script
│
├── 📁 .github/                         # GitHub Actions configuration
│   └── 📁 workflows/
│       └── 📄 deploy.yml               # Auto-deployment workflow
│
├── 📁 admin/                           # Admin Panel (CMS)
│   ├── 📄 index.html                   # CMS entry point
│   └── 📄 config.yml                   # CMS configuration (collections, fields)
│
├── 📁 css/                             # Stylesheets
│   └── 📄 style.css                    # All website styles (colors, layout, responsive)
│
├── 📁 js/                              # JavaScript Files
│   ├── 📄 config.js                    # Site settings (phone, email, etc.)
│   ├── 📄 navigation.js                # Page routing & navigation
│   ├── 📄 main.js                      # Page templates & content logic
│   ├── 📄 pwa.js                       # PWA installation handling
│   └── 📄 notifications.js             # Push notifications system
│
├── 📁 api/                             # Serverless Functions (Vercel)
│   └── 📄 send-email.js                # Contact form email handler
│
├── 📁 content/                         # CMS Content (Auto-generated)
│   ├── 📁 news/                        # News articles (JSON files)
│   ├── 📁 gallery/                     # Gallery items (JSON files)
│   ├── 📁 main-cards/                  # Homepage cards (JSON files)
│   ├── 📁 notifications/               # Push notifications (JSON files)
│   ├── 📄 notice.json                  # Notice board content
│   └── 📄 upcoming.json                # Upcoming events content
│
├── 📁 settings/                        # Site Settings (Auto-generated)
│   └── 📄 site.json                    # General settings (phone, email, population, etc.)
│
└── 📁 img/                             # Images
    └── 📁 uploads/                     # User-uploaded images from CMS
        ├── (news images)
        ├── (gallery photos)
        └── (card images)
```

---

## 📋 FILE PURPOSES & WHAT TO EDIT

### 🏠 **ROOT FILES** (Main Directory)

| File | Purpose | Edit This? |
|------|---------|------------|
| `index.html` | Main HTML structure, header, footer, navigation | ✅ YES - To change header/footer/nav |
| `manifest.json` | PWA app settings (name, icons, colors) | ✅ YES - To change app name/icon |
| `sw.js` | Service Worker (makes site work offline) | ⚠️ RARELY - Only for advanced features |
| `package.json` | NPM dependencies | ⚠️ RARELY - Only if adding libraries |
| `vercel.json` | Vercel configuration | ❌ NO - Already configured |
| `README.md` | Documentation | ✅ YES - Add your own notes |
| `FREE-DEPLOYMENT-GUIDE.md` | Deployment instructions | 📖 READ ONLY |
| `SVELTIA-CMS-GUIDE.md` | CMS usage guide | 📖 READ ONLY |
| `cloudflare-worker-auth.js` | Optional auth script | 📖 REFERENCE |

---

### 🎨 **CSS FOLDER** (Styles)

| File | Purpose | Edit This? |
|------|---------|------------|
| `css/style.css` | **ALL website styles** - colors, fonts, layouts, responsive design | ✅ YES - To change colors/design |

**What you can change in style.css:**
- Colors (lines 1-15)
- Fonts
- Button styles
- Card designs
- Spacing & padding
- Mobile responsive breakpoints

---

### 💻 **JS FOLDER** (JavaScript)

| File | Purpose | Edit This? | What's Inside |
|------|---------|------------|---------------|
| `js/config.js` | Site configuration | ⚠️ RARELY | Phone, email settings (loaded from CMS) |
| `js/navigation.js` | Page routing | ⚠️ RARELY | Navigation between pages |
| `js/main.js` | **PAGE CONTENT** | ✅ YES | **All page templates (Home, About, News, etc.)** |
| `js/pwa.js` | PWA installation | ❌ NO | App install prompts |
| `js/notifications.js` | Push notifications | ❌ NO | Notification system |

**🎯 IMPORTANT:** To edit page content, edit `js/main.js`

---

### 🔧 **ADMIN FOLDER** (CMS)

| File | Purpose | Edit This? |
|------|---------|------------|
| `admin/index.html` | CMS entry point | ❌ NO - Already configured |
| `admin/config.yml` | **CMS configuration** - what appears in admin panel | ✅ YES - To add/change fields |

**What you can change in config.yml:**
- Field types (text, image, dropdown)
- Field labels
- Default values
- Add new collections
- Add new fields

---

### 🌐 **API FOLDER** (Serverless Functions)

| File | Purpose | Edit This? |
|------|---------|------------|
| `api/send-email.js` | Contact form email handler | ⚠️ RARELY - Only to change email template |

---

### 📝 **CONTENT FOLDER** (Auto-Generated)

| Folder/File | Created By | Edit Via |
|-------------|------------|----------|
| `content/news/*.json` | CMS | Admin Panel |
| `content/gallery/*.json` | CMS | Admin Panel |
| `content/main-cards/*.json` | CMS | Admin Panel |
| `content/notice.json` | CMS | Admin Panel |
| `content/upcoming.json` | CMS | Admin Panel |

**❌ DON'T edit these files manually** - use admin panel instead!

---

### ⚙️ **SETTINGS FOLDER** (Auto-Generated)

| File | Created By | Edit Via |
|------|------------|----------|
| `settings/site.json` | CMS | Admin Panel → Site Settings |

Contains:
- Phone number
- Email
- Population
- Schools count
- Mosques count
- Map coordinates

---

### 🖼️ **IMG FOLDER** (Images)

```
img/
├── uploads/              # CMS uploaded images (auto-created)
│   ├── news-image-1.jpg
│   ├── gallery-photo-2.jpg
│   └── card-image-3.png
│
├── icon-192.png         # PWA app icon (192x192) - ADD THIS
├── icon-512.png         # PWA app icon (512x512) - ADD THIS
└── screenshot1.png      # PWA screenshot - ADD THIS
```

**You need to add:**
1. `icon-192.png` - 192x192px app icon
2. `icon-512.png` - 512x512px app icon
3. `screenshot1.png` - 540x720px screenshot

---

### 🤖 **GITHUB FOLDER** (Auto-Deployment)

```
.github/
└── workflows/
    └── deploy.yml       # GitHub Actions workflow (auto-deploys on push)
```

**❌ DON'T edit** unless you know GitHub Actions

---

## 🎯 **COMMON EDITING TASKS**

### **1. Change Page Content (Home, About, etc.)**
📁 Edit: `js/main.js`
- Find function: `getHomePage()` for home
- Find function: `getAboutPage()` for about
- Find function: `getNewsPage()` for news
- etc.

### **2. Change Colors/Design**
📁 Edit: `css/style.css`
- Lines 1-15: Color variables
- Search for specific elements

### **3. Change Header/Footer/Navigation**
📁 Edit: `index.html`
- Line ~30: Top bar
- Line ~40: Logo & navigation
- Line ~500: Footer

### **4. Add/Edit News, Gallery, Settings**
🌐 Use: Admin Panel (`/admin`)
- No code editing needed!

### **5. Change Contact Form Fields**
📁 Edit: `js/main.js`
- Find: `getContactPage()` function
- Modify form HTML

### **6. Add New Page**
📁 Edit multiple files:
1. `js/main.js` - Add `getNewPage()` function
2. `js/navigation.js` - Add page to `pages` array
3. `index.html` - Add nav link

### **7. Change App Name/Icon**
📁 Edit: `manifest.json`
- Change `name` and `short_name`
- Add icon files to `img/` folder

---

## 📦 **FILE SIZES**

Current total: ~500 KB (very small!)

Breakdown:
- HTML: ~15 KB
- CSS: ~20 KB
- JavaScript: ~30 KB
- CMS Config: ~5 KB
- Images: Variable (user uploads)

**GitHub Pages limit:** 1 GB (you can add ~2,000 high-quality photos!)

---

## 🔍 **FINDING FILES**

### **On GitHub:**
1. Go to your repository
2. Click on folder name
3. Click on file name
4. Click pencil icon to edit

### **On Your Computer:**
1. Extract ZIP file
2. Open folder in code editor (VS Code recommended)
3. Use file explorer on left

### **File Extensions Explained:**
- `.html` - Web pages
- `.css` - Styles
- `.js` - JavaScript code
- `.json` - Data files (settings, content)
- `.yml` - Configuration files
- `.md` - Documentation (Markdown)

---

## 🚫 **FILES YOU SHOULD NEVER EDIT**

1. `.github/workflows/deploy.yml` - Breaks auto-deployment
2. `sw.js` - Breaks offline functionality
3. `vercel.json` - Breaks API
4. Files in `content/` - Use admin panel instead
5. Files in `settings/` - Use admin panel instead

---

## ✅ **FILES YOU CAN SAFELY EDIT**

1. ✅ `index.html` - Header, footer, navigation
2. ✅ `css/style.css` - All styles
3. ✅ `js/main.js` - Page content
4. ✅ `admin/config.yml` - Admin panel fields
5. ✅ `manifest.json` - App settings
6. ✅ `README.md` - Your notes

---

## 📊 **FILE ORGANIZATION TIPS**

### **Keep It Clean:**
- Don't create random files in root
- Put images in `img/uploads/`
- Put docs in root (README, GUIDE, etc.)

### **Naming Conventions:**
- Files: `kebab-case.html` (lowercase with dashes)
- Images: `descriptive-name.jpg`
- No spaces in filenames!

### **Version Control:**
- Commit often
- Use descriptive commit messages
- Example: "Updated homepage hero section"

---

## 🔄 **AUTO-GENERATED FILES**

These folders/files are created automatically by the CMS:

```
content/                 # Created when you add content via admin
├── news/               # Auto-created when adding news
├── gallery/            # Auto-created when adding gallery
└── main-cards/         # Auto-created when adding cards

settings/               # Created when you update settings
└── site.json          # Auto-created on first settings save

img/uploads/            # Created when you upload images
└── (uploaded files)    # Auto-created on image upload
```

**❌ Don't delete these folders manually!**

---

## 💡 **QUICK REFERENCE**

**To change:**
- **Colors** → `css/style.css` (lines 1-15)
- **Homepage text** → `js/main.js` (find `getHomePage()`)
- **About page** → `js/main.js` (find `getAboutPage()`)
- **Header/Footer** → `index.html`
- **News/Gallery** → Admin panel
- **Settings** → Admin panel
- **Contact form** → `js/main.js` (find `getContactPage()`)

---

## 📞 **NEED HELP?**

1. Check the guide files (README, DEPLOYMENT GUIDE)
2. Look at comments in code (lines starting with `//` or `/* */`)
3. Search for specific text in files (Ctrl+F)
4. Ask in GitHub Issues

---

**Remember:** You can always restore files from GitHub history if you make a mistake!
