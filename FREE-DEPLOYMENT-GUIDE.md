# 🎉 100% FREE DEPLOYMENT GUIDE
## GitHub Pages + Vercel + Sveltia CMS

**Total Cost: $0/month (completely free forever!)**

This setup uses:
- ✅ **GitHub Pages** - FREE website hosting
- ✅ **Vercel** - FREE serverless functions (contact form)
- ✅ **Sveltia CMS** - FREE content management
- ✅ **GitHub Authentication** - FREE admin login

---

## 📋 **WHAT YOU NEED**

1. GitHub account (free)
2. Vercel account (free)
3. Your domain: sehravillage.site (or use free GitHub subdomain)
4. 30 minutes of time

---

## 🚀 **STEP-BY-STEP DEPLOYMENT**

### **PART 1: GitHub Setup (5 minutes)**

#### **1.1 Create GitHub Account**
- Go to https://github.com
- Click "Sign up"
- Choose a username (e.g., `sehravillage`)
- Complete registration

#### **1.2 Create Repository**
- Click "+" icon → "New repository"
- Repository name: `sehra-village`
- Make it **Public** (required for free GitHub Pages)
- ✅ Check "Add a README file"
- Click "Create repository"

#### **1.3 Upload Your Files**

**Option A - Using GitHub Website (Easy):**
1. Click "Add file" → "Upload files"
2. Drag ALL files from `sehra-website` folder
3. Scroll down, click "Commit changes"

**Option B - Using Git (Advanced):**
```bash
cd sehra-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sehra-village.git
git push -u origin main
```

#### **1.4 Enable GitHub Pages**
1. Go to repository Settings
2. Click "Pages" in left sidebar
3. Under "Source", select "GitHub Actions"
4. Click "Save"

**Your site will be live at:**
`https://YOUR_USERNAME.github.io/sehra-village`

Wait 2-3 minutes for first deployment.

---

### **PART 2: Vercel Setup for Contact Form (10 minutes)**

#### **2.1 Create Vercel Account**
- Go to https://vercel.com
- Click "Sign up"
- **Sign up with GitHub** (recommended)
- Authorize Vercel

#### **2.2 Import Repository**
1. Click "Add New" → "Project"
2. Select your `sehra-village` repository
3. Click "Import"

#### **2.3 Configure Vercel Project**
- Framework Preset: **Other**
- Root Directory: `./`
- Build Command: (leave empty)
- Output Directory: `.`
- Install Command: `npm install`
- Click "Deploy"

Wait 1-2 minutes for deployment.

#### **2.4 Add Environment Variables**
1. Go to Vercel Dashboard → Your project → Settings
2. Click "Environment Variables"
3. Add these variables:

```
Name: EMAIL_USER
Value: your-gmail@gmail.com

Name: EMAIL_PASS
Value: your-gmail-app-password
```

**How to get Gmail App Password:**
1. Go to https://myaccount.google.com
2. Security → 2-Step Verification → Enable it
3. Security → App Passwords
4. Select "Mail" → Generate
5. Copy the 16-character password
6. Use it as EMAIL_PASS

4. Click "Save"
5. Redeploy: Deployments → Click "..." → "Redeploy"

**Your Vercel URL:**
`https://sehra-village.vercel.app`

---

### **PART 3: Update Configuration (5 minutes)**

#### **3.1 Update admin/config.yml**

Open `admin/config.yml` and change:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/sehra-village  # ← Change this
  branch: main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

Example:
```yaml
backend:
  name: github
  repo: sehravillage/sehra-village
  branch: main
```

#### **3.2 Update API URL in js/main.js**

Find this line:
```javascript
const response = await fetch('https://sehra-village-api.vercel.app/api/send-email', {
```

Change to YOUR Vercel URL:
```javascript
const response = await fetch('https://YOUR-PROJECT-NAME.vercel.app/api/send-email', {
```

Get your Vercel URL from Vercel dashboard.

#### **3.3 Commit Changes**

Push updated files to GitHub:
```bash
git add .
git commit -m "Updated config for GitHub Pages"
git push
```

Or upload via GitHub website.

---

### **PART 4: Setup Admin Access (5 minutes)**

#### **4.1 Create GitHub OAuth App**

1. Go to GitHub Settings → Developer settings
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   ```
   Application name: Sehra Village CMS
   Homepage URL: https://YOUR_USERNAME.github.io/sehra-village
   Authorization callback URL: https://YOUR_USERNAME.github.io/sehra-village/admin/
   ```
4. Click "Register application"
5. **Copy Client ID**
6. Click "Generate a new client secret"
7. **Copy Client Secret**

#### **4.2 Deploy Auth Gateway**

**Option 1 - Use Vercel (Recommended):**

1. Create new file `api/auth.js` in your project:

```javascript
module.exports = (req, res) => {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
  
  if (req.query.code) {
    // Exchange code for token
    fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code
      })
    })
    .then(r => r.json())
    .then(data => {
      res.send(`
        <script>
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify(data)}',
            window.location.origin
          );
          window.close();
        </script>
      `);
    });
  } else {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`
    );
  }
};
```

2. Add environment variables in Vercel:
   ```
   GITHUB_CLIENT_ID = (paste your client ID)
   GITHUB_CLIENT_SECRET = (paste your client secret)
   ```

3. Update `admin/config.yml`:
   ```yaml
   backend:
     name: github
     repo: YOUR_USERNAME/sehra-village
     branch: main
     base_url: https://YOUR-PROJECT.vercel.app/api
     auth_endpoint: auth
   ```

**Option 2 - Use Free Auth Service:**

Update `admin/config.yml`:
```yaml
backend:
  name: github
  repo: YOUR_USERNAME/sehra-village
  branch: main
  base_url: https://oauth.sehravillage.workers.dev  # Free Cloudflare Workers
```

I'll provide the Cloudflare Workers script separately.

---

### **PART 5: Custom Domain (Optional - $12/year)**

#### **5.1 Configure DNS**

If you have `sehravillage.site`:

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Add these DNS records:

```
Type: A
Host: @
Value: 185.199.108.153

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153

Type: CNAME
Host: www
Value: YOUR_USERNAME.github.io
```

#### **5.2 Configure GitHub Pages**

1. Repository Settings → Pages
2. Custom domain: `sehravillage.site`
3. Click "Save"
4. ✅ Check "Enforce HTTPS"

Wait 10-60 minutes for DNS propagation.

---

## ✅ **TESTING EVERYTHING**

### **Test 1: Website**
- Visit: `https://YOUR_USERNAME.github.io/sehra-village`
- All pages should load
- Navigation works
- Images display

### **Test 2: Admin Panel**
- Visit: `https://YOUR_USERNAME.github.io/sehra-village/admin`
- Click "Login with GitHub"
- Authorize the app
- You should see Sveltia CMS dashboard

### **Test 3: Content Management**
- Add a news article
- Upload an image
- Publish
- Check it appears on website

### **Test 4: Contact Form**
- Go to Contact page
- Fill and submit form
- Check your email inbox
- Should receive the message

---

## 💰 **COST BREAKDOWN**

| Service | Cost | What It Does |
|---------|------|--------------|
| GitHub Pages | **FREE** | Website hosting |
| GitHub Storage | **FREE** | Images & content storage |
| Vercel | **FREE** | Contact form emails |
| Sveltia CMS | **FREE** | Admin panel |
| GitHub Auth | **FREE** | Admin login |
| **TOTAL** | **$0/month** | Everything! |

**Optional:**
- Domain name: ~$12/year (sehravillage.site)

---

## 🔧 **MANAGING CONTENT**

### **Add News:**
1. Go to `/admin`
2. Login with GitHub
3. Click "News & Updates"
4. Click "New News Article"
5. Fill form, upload image
6. Click "Publish"
7. Wait 1 minute
8. News appears on website!

### **Add Gallery Photo:**
1. Admin → Gallery
2. New Photo
3. Upload image
4. Add title & description
5. Publish

### **Update Settings:**
1. Admin → Site Settings
2. Edit phone, email, population, etc.
3. Publish

---

## 🎯 **ADVANTAGES OF THIS SETUP**

### **Vs Netlify:**
- ✅ Truly FREE (no credit card needed)
- ✅ Unlimited bandwidth
- ✅ No build minutes limit
- ✅ GitHub's reliability
- ✅ Easy to migrate

### **Vs WordPress:**
- ✅ No hosting fees
- ✅ No database costs
- ✅ Faster loading
- ✅ More secure
- ✅ Version controlled

---

## 🔒 **SECURITY**

**Admin Access:**
- Only people with GitHub access to your repository can edit
- Uses GitHub's OAuth authentication
- No passwords stored anywhere

**To add another admin:**
1. Go to GitHub repo → Settings → Collaborators
2. Add their GitHub username
3. They can now access admin panel

**To remove admin:**
1. Remove them from GitHub collaborators
2. They lose access immediately

---

## 📊 **LIMITS (All Generous)**

### **GitHub Pages:**
- Bandwidth: 100 GB/month (plenty for village site)
- Storage: 1 GB (thousands of images)
- Builds: Unlimited

### **Vercel:**
- Function calls: 100,000/month (plenty for contact form)
- Bandwidth: 100 GB/month
- Build time: 6,000 minutes/month

**For a village website, you'll never hit these limits!**

---

## 🆘 **TROUBLESHOOTING**

### **"404 Page Not Found"**
- Wait 3-5 minutes after first deploy
- Check GitHub Actions ran successfully
- Hard refresh (Ctrl+Shift+R)

### **"Admin login not working"**
- Check GitHub OAuth app settings
- Verify callback URL matches exactly
- Try incognito/private browsing

### **"Contact form not sending"**
- Check Vercel environment variables
- Verify Gmail app password is correct
- Check Vercel function logs

### **"Images not loading"**
- Check image paths in config.yml
- Verify images are in `img/uploads/`
- Clear browser cache

---

## 🔄 **UPDATING YOUR SITE**

**Method 1 - Via Admin Panel:**
- Just edit content and publish
- Changes appear in 1-2 minutes

**Method 2 - Via GitHub:**
1. Edit files on GitHub
2. Commit changes
3. GitHub Actions auto-deploys
4. Wait 1-2 minutes

**Method 3 - Via Local:**
```bash
# Make changes to files
git add .
git commit -m "Updated homepage"
git push
# Auto-deploys in 1-2 minutes
```

---

## 🎓 **MONITORING**

### **Check Deployments:**
- GitHub: Actions tab → See deployment status
- Vercel: Deployments → See API status

### **View Logs:**
- GitHub Actions: Click on any workflow run
- Vercel: Functions → Logs

### **Traffic Stats:**
- GitHub: Insights → Traffic
- Free analytics: Add Google Analytics

---

## 🌟 **BONUS TIPS**

1. **Backup Strategy:**
   - Content is in GitHub = auto-backed up
   - Download repo monthly as extra backup

2. **Performance:**
   - Optimize images before uploading
   - Keep images under 500KB
   - Use JPG for photos, PNG for graphics

3. **SEO:**
   - Add meta descriptions (in code)
   - Submit sitemap to Google
   - Get listed on Google My Business

4. **Updates:**
   - GitHub Pages: Auto-updates
   - Vercel: Auto-updates
   - Sveltia CMS: Auto-updates

---

## ✨ **YOU'RE DONE!**

Congratulations! You now have:
- ✅ FREE website hosting
- ✅ FREE admin panel
- ✅ FREE contact form
- ✅ Professional domain (optional)
- ✅ No monthly costs!

**Total Setup Time:** ~30 minutes
**Monthly Cost:** $0
**Features:** Unlimited

---

## 📞 **SUPPORT**

**GitHub Pages Issues:**
- https://docs.github.com/pages

**Vercel Issues:**
- https://vercel.com/docs

**Sveltia CMS:**
- https://github.com/sveltia/sveltia-cms

**General Help:**
- Check your repository's Issues tab
- Google the error message
- Ask in GitHub Discussions

---

**Welcome to FREE, modern web hosting! 🎊**
