# Brand Identity Curator

Daily curator that sends 7 brand identity case studies to your inbox at 7:00 AM IST.

---

## What It Does

Every morning at 7:00 AM IST, you receive an email with 7 curated brand identity case studies:
- **Title** of the case study
- **Direct link** to read it
- **Source** (The Brand Identity, Pentagram, Dezeen, etc.)

No summaries. Just links to deep reads.

---

## Setup Instructions (Step by Step)

### Step 1: Create Gmail App Password

The system sends emails via Gmail. You need an **App Password** (not your regular Gmail password).

1. Go to: https://myaccount.google.com/security
2. Enable **2-Factor Authentication** (if not already enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer" (or your device)
5. Google generates a 16-character password. **Copy this**.

You'll use this in Step 3.

---

### Step 2: Create Vercel Account

1. Go to: https://vercel.com
2. Sign up with GitHub (recommended) or email
3. Once logged in, you're ready for deployment

---

### Step 3: Deploy to Vercel

You have two options:

#### Option A: Deploy via Vercel Web (Easiest)

1. **Create a GitHub repository** for this project:
   - Go to https://github.com/new
   - Name it: `brand-identity-curator`
   - Upload the files from the `~/brand-identity-curator` folder

2. **Connect GitHub to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select the `brand-identity-curator` repo
   - Click "Import"

3. **Add Environment Variables in Vercel:**
   - Vercel shows a form for environment variables
   - Add these:
     - `GMAIL_USER` = `ankitakhanna994@gmail.com`
     - `GMAIL_APP_PASSWORD` = (paste the 16-character password from Step 1)
   - Click "Deploy"

4. **Vercel deploys automatically** ✅

---

#### Option B: Deploy via Terminal (For Later)

Once you have Vercel CLI:
```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel will ask for environment variables interactively.

---

### Step 4: Set Up Daily Scheduling

Once deployed, Vercel gives you a URL like:
```
https://your-project.vercel.app/api/curator
```

You need to trigger this at 7:00 AM IST daily. Use one of these:

#### Option A: Vercel Cron (Recommended)

Add this to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/scheduler",
      "schedule": "0 1 * * *"
    }
  ]
}
```

Then redeploy. Vercel automatically triggers at 7:30 AM UTC (1:00 AM IST equivalent, adjusted).

#### Option B: External Service (EasyCron)

1. Go to: https://www.easycron.com
2. Sign up (free)
3. Create a new cron job:
   - URL: `https://your-project.vercel.app/api/curator` (replace with your actual URL)
   - Frequency: Daily at 7:00 AM IST
   - HTTP Method: POST
   - Save

EasyCron triggers your function daily.

#### Option C: Manual Testing

While setting up, test manually:
```bash
curl -X POST https://your-project.vercel.app/api/curator
```

If you get articles in your inbox, it's working!

---

## After Deployment

### Check Logs
- Go to Vercel dashboard
- Find your project
- Click "Deployments" → Latest
- Scroll to "Function Logs" to see what ran

### Test the System
1. Manually trigger via curl or browser
2. Check your inbox (ankitakhanna994@gmail.com)
3. You should see 7 case studies

### Add More Topics Later

Edit `api/curator.js` and add to the `sources` object:

```javascript
circularDesign: {
  sources: [
    { name: 'Source Name', url: 'https://...', selector: 'article' },
    // Add more sources
  ],
  articlesPerDay: 5,
  sendTime: '07:15',
  emailSubject: '5 Circular Design Articles',
}
```

Then redeploy. Vercel auto-updates.

---

## Troubleshooting

**Problem:** Not receiving emails
- Check `GMAIL_APP_PASSWORD` is correct (16 characters)
- Check 2FA is enabled on Gmail account
- Check Vercel logs for errors

**Problem:** Articles not showing
- Check the sources are accessible (some may have changed URLs)
- Check function logs in Vercel dashboard

**Problem:** Wrong time
- IST is UTC+5:30
- Adjust the scheduler accordingly

---

## File Structure

```
brand-identity-curator/
├── package.json           # Dependencies
├── vercel.json            # Vercel config
├── .env.example          # Environment variables template
├── README.md             # This file
└── api/
    ├── curator.js        # Main scraper & curator
    └── scheduler.js      # Daily trigger
```

---

## What Happens Each Morning

1. **7:00 AM IST** — EasyCron (or Vercel Cron) triggers `/api/scheduler`
2. **Scheduler checks** if it's 7:00 AM in IST timezone
3. **If yes**, scheduler calls `/api/curator`
4. **Curator scrapes** The Brand Identity, Pentagram, Dezeen, Creative Boom
5. **Curator filters** for articles about identity, systems, strategy
6. **Curator curates** top 7 articles by relevance
7. **Curator sends email** to ankitakhanna994@gmail.com with 7 links
8. **You wake up**, read 7 case studies over coffee ☕

---

## Need Help?

If anything breaks, check:
1. Vercel function logs
2. Gmail 2FA settings
3. Environment variables in Vercel dashboard
4. EasyCron logs (if using that)

Questions? Ask. This system is built to be modified. You own it.
