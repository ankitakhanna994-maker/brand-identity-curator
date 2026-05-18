# 🚀 QUICK START GUIDE

## The 5 Steps (Spoon-Fed)

### Step 1: Get Gmail App Password (5 minutes)
```
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google gives you a 16-character password
4. Copy it. Keep it safe.
```

### Step 2: Create GitHub Account (If you don't have one)
```
1. Go to https://github.com/signup
2. Sign up with email
3. Verify email
```

### Step 3: Create GitHub Repository
```
1. Go to https://github.com/new
2. Name: brand-identity-curator
3. Make it Private (optional but recommended)
4. Create repository
```

### Step 4: Upload Files to GitHub
```
There are two ways:

EASIEST (Via GitHub Web):
1. Go to your new repository
2. Click "Add file" → "Upload files"
3. Drag and drop all files from ~/brand-identity-curator
4. Commit

OR (Via Git Terminal):
cd ~/brand-identity-curator
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/brand-identity-curator.git
git push -u origin main
```

### Step 5: Deploy to Vercel
```
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select brand-identity-curator
4. Vercel shows "Environment Variables" form
5. Add:
   - Name: GMAIL_USER
     Value: ankitakhanna994@gmail.com
   
   - Name: GMAIL_APP_PASSWORD
     Value: (the 16-char password from Step 1)
6. Click "Deploy"
7. Wait 2-3 minutes
8. Done! ✅
```

---

## That's It!

You now have:
- ✅ Daily scraper running on Vercel
- ✅ Emails sent at 7 AM IST
- ✅ 7 brand identity case studies in your inbox each morning

---

## Testing (Optional but Recommended)

Once deployed, manually trigger it:

```
Go to: https://your-project-name.vercel.app/api/curator

Check your inbox. Should have email with 7 articles.
```

If it works, you're done. If not, check Vercel logs.

---

## Troubleshooting

**Not getting emails?**
- Check Gmail App Password is exactly right (16 chars, no spaces)
- Check 2FA is ON in Gmail settings
- Check Vercel logs for errors

**Articles not showing?**
- Check internet connection
- Sources might be down temporarily
- Check Vercel function logs

---

## Next: Adding More Topics

Once the first topic is running smoothly, you can add:
- Circular Design articles
- Product Design articles
- AI in Design articles
- Anything else

Just tell me the sources and curation criteria. I update the code, you redeploy (10 seconds).

---

## You're All Set!

Tomorrow morning at 7 AM, check your inbox. 🎉
