# 🎉 Bar Mitzvah RSVP System

A beautiful, free RSVP system for your son's Bar Mitzvah celebration. Easily collect guest responses with a modern, mobile-friendly interface.

## ✨ Features

- **Personalized Links**: Each guest gets a unique RSVP link with their name pre-filled
- **Beautiful Design**: Modern, elegant interface with Bar Mitzvah theming
- **Mobile Friendly**: Works perfectly on all devices
- **No Manual Entry**: Guests don't need to type their names
- **WhatsApp Integration**: Send personalized WhatsApp messages with unique links
- **Guest Management**: Add, edit, and manage all 60+ guests easily
- **Admin Dashboard**: View all responses and export to CSV
- **Bulk Operations**: Import guests from CSV, generate all links at once
- **Dietary Restrictions**: Collect special dietary needs
- **100% Free**: Multiple free hosting options available

## 🚀 Quick Start Options

### Option 1: Google Forms (Completely Free & Easy)

1. **Create a Google Form**:
   - Go to [Google Forms](https://forms.google.com)
   - Create a new form with these fields:
     - Name (Short answer, Required)
     - Email (Short answer)
     - Will you be attending? (Multiple choice: "Coming", "Not Coming", Required)
     - Number of guests (Dropdown: 1-6+)
     - Dietary restrictions (Short answer)

2. **Get Form IDs**:
   - Click "Send" → "Link" → Copy the form URL
   - Extract the form ID from the URL (between `/d/` and `/viewform`)
   - For each field, right-click → "Inspect" → find `name="entry.XXXXXXXX"`

3. **Update the HTML**:
   - Open `google-forms-version.html`
   - Replace `YOUR_FORM_ID` with your form ID
   - Replace `YOUR_NAME_FIELD_ID`, `YOUR_EMAIL_FIELD_ID`, etc. with the entry IDs
   - Update event details (son's name, date, time, location)

4. **Host for Free**:
   - Upload to [Netlify Drop](https://app.netlify.com/drop) (drag & drop)
   - Or use [GitHub Pages](https://pages.github.com/)
   - Or use [Vercel](https://vercel.com/)

### Option 2: Personalized Links Solution (Recommended!)

This creates unique RSVP links for each guest so they don't have to enter their name.

1. **Setup**:
   ```bash
   cd bar-mitzvah-rsvp
   npm install
   ```

2. **Add Your Guests**:
   ```bash
   # Option A: Use sample data to test
   node populate-guests.js
   
   # Option B: Import from CSV file
   node populate-guests.js your-guests.csv
   ```

3. **Customize Event Details**:
   - Edit `rsvp-template.html` - Update event details and son's name
   - Modify colors/styling if desired

4. **Run Locally**:
   ```bash
   npm start
   ```
   - Guest Manager: http://localhost:3000/admin/guests-manager
   - Admin Dashboard: http://localhost:3000/admin
   - Sample RSVP: http://localhost:3000/rsvp/js_abc123

5. **Generate Personalized Links**:
   - Visit the Guest Manager
   - Click "Generate Links" tab
   - Generate all personalized RSVP links
   - Send via WhatsApp or copy individual links

6. **Deploy for Free**:
   - **Heroku**: `git push heroku main`
   - **Railway**: Connect GitHub repo
   - **Render**: Connect GitHub repo
   - **Vercel**: `vercel --prod`

## 📱 Personalized WhatsApp Messages

The system creates personalized WhatsApp messages for each guest:

**Example**: "Hi John Smith! You're invited to [Son's Name]'s Bar Mitzvah! Please RSVP at: https://yoursite.com/rsvp/js_abc123"

**Features**:
- Each guest gets their own unique link
- Pre-written personal message with their name
- One-click sending from Guest Manager
- Guests can easily share with family members

## 🎨 Customization

### Update Event Details
Edit these sections in your HTML file:
```html
<h2>[Your Son's Name]'s Bar Mitzvah</h2>
<p><strong>Date:</strong> [Date - e.g., Saturday, March 15, 2025]</p>
<p><strong>Time:</strong> [Time - e.g., 10:00 AM - 3:00 PM]</p>
<p><strong>Location:</strong> [Venue Name and Address]</p>
```

### Change Colors
The main colors are defined in CSS:
- Primary: `#667eea` (purple-blue)
- Secondary: `#764ba2` (purple)
- Success: `#28a745` (green)
- WhatsApp: `#25D366` (green)

## 📊 Admin Features

The admin dashboard (`/admin`) provides:
- Real-time RSVP statistics
- Guest list with all details
- Export to CSV for planning
- Auto-refresh every 30 seconds

## 🆓 Free Hosting Options

### Static Hosting (Google Forms Version)
- **Netlify**: Drag & drop deployment
- **GitHub Pages**: Free with GitHub account
- **Vercel**: Connect GitHub repo
- **Firebase Hosting**: Google's free tier

### Full-Stack Hosting (Node.js Version)
- **Heroku**: Free tier (with some limitations)
- **Railway**: $5/month after free trial
- **Render**: Free tier available
- **Vercel**: Free for personal projects

## 📧 Getting RSVPs

### Google Forms Version
- Responses automatically saved to Google Sheets
- Email notifications available
- Download as CSV anytime

### Node.js Version
- RSVPs saved to `rsvps.json` file
- View in admin dashboard
- Export to CSV with one click

## 🔧 Technical Details

### Files Included
- `index.html` - Main RSVP form (Node.js version)
- `google-forms-version.html` - Google Forms integration
- `server.js` - Node.js backend
- `admin.html` - Admin dashboard
- `package.json` - Dependencies

### Dependencies (Node.js version)
- Express.js - Web server
- CORS - Cross-origin requests
- File system - Store RSVPs locally

## 🎯 For 60 Guests

This system easily handles 60+ guests:
- **Google Forms**: Unlimited responses
- **Node.js**: Handles hundreds of concurrent users
- **Mobile Optimized**: Works on all devices
- **WhatsApp Sharing**: Easy viral distribution

## 🛠️ Troubleshooting

### Google Forms Not Working?
1. Check form ID is correct
2. Verify entry field IDs match
3. Make sure form accepts responses

### Node.js Issues?
1. Run `npm install` first
2. Check port 3000 is available
3. Look at console for error messages

### Hosting Problems?
1. Check all files are uploaded
2. Verify environment variables
3. Check hosting service logs

## 📞 Support

Need help? Check these resources:
- Google Forms: [Google Support](https://support.google.com/forms)
- Netlify: [Netlify Docs](https://docs.netlify.com)
- Node.js: [Node.js Documentation](https://nodejs.org/docs)

## 🎊 Mazel Tov!

Congratulations on your son's Bar Mitzvah! This RSVP system will help make your celebration planning much easier.

---

**Made with ❤️ for your special celebration**
