# 🚀 Deploy to Vercel in 5 Minutes

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Nivaas apartment platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nivaas.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy to Vercel

### For Frontend Only (Recommended for Quick Demo):

1. Go to **https://vercel.com/new**
2. Click **"Import Project"**
3. Paste your GitHub repo URL: `https://github.com/YOUR_USERNAME/nivaas.git`
4. Click **"Import"**
5. Vercel auto-detects Next.js
6. Click **"Deploy"**

That's it! Your app is live at `https://nivaas.vercel.app` (or similar).

---

### For Full Stack (Frontend + Backend):

#### A. Deploy Backend to Railway

1. Go to **https://railway.app/new**
2. Click **"Deploy from GitHub"**
3. Select your `nivaas` repo
4. Railway auto-detects and creates a project
5. Click **"Add Service"** → **"Database"** → **"PostgreSQL"**
6. Wait for deployment (~2 min)
7. In Railway dashboard:
   - Copy the **Database URL** or note: `host`, `port`, `user`, `password`
   - Add new variable `PORT=3001`
8. Your API is live at: `https://your-project-api.railway.app`

#### B. Deploy Frontend to Vercel with Backend URL

1. Go to **https://vercel.com/new**
2. Click **"Import Project"** → paste your GitHub URL
3. In **"Environment Variables"** section, add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-project-api.railway.app` (from Railway)
4. Click **"Deploy"**

Your full app is now live!

---

## Step 3: Test Your Live Demo

1. Open `https://nivaas.vercel.app` (or your domain)
2. Go to **"/list-property"** - submit a test property
3. If backend connected:
   - Go to **"/admin"** → see your property in "Properties" tab
   - Click **"Approve"** to make it live
   - Go to **"/search"** → see your property in results
   - Request a visit → see it in **"/admin"** under "Lead Requests"

---

## 🎬 Demo Flow

### Landlord Journey
1. Visit homepage
2. Click "List your flat"
3. Fill form → Submit
4. ✅ Confirmation page

### Tenant Journey
1. Search for properties
2. Filter by BHK, price, furnishing
3. View property details
4. Schedule a visit
5. ✅ Confirmation with phone call

### Admin
1. Visit `/admin` dashboard
2. Approve pending properties
3. Track tenant leads
4. Update visit status

---

## 📊 Live Links After Deployment

- **Frontend:** `https://nivaas.vercel.app`
- **Backend API:** `https://your-project-api.railway.app` (if deployed)
- **Database:** PostgreSQL (managed by Railway)

---

## 🔄 Continuous Deployment

After initial setup:
- Every `git push` to `main` triggers auto-deployment
- Vercel deploys within 1-2 minutes
- No manual steps needed

```bash
# Make a change
echo "Update coming!" >> README.md

# Commit and push
git add README.md
git commit -m "Update README"
git push origin main

# Vercel auto-deploys ✨
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Frontend loads at `https://nivaas.vercel.app`
- [ ] (Optional) Backend deployed to Railway
- [ ] (Optional) Environment variable `NEXT_PUBLIC_API_URL` set
- [ ] Forms connected to backend and working
- [ ] Admin dashboard functional

---

## 🆘 Troubleshooting

### Vercel build fails
- Check Vercel logs: Dashboard → Deployments → click failed build
- Common issue: Missing environment variables
- Solution: Add `NEXT_PUBLIC_API_URL` in Vercel project settings

### Frontend can't reach backend
- Check `NEXT_PUBLIC_API_URL` is correct in Vercel env vars
- Verify backend API is running on Railway
- Check CORS headers in `api/server.js`

### Database connection error
- Verify Railway PostgreSQL is running
- Check environment variables on Railway match `schema.sql`
- Run migration: `psql <DATABASE_URL> < schema.sql`

---

## 🎉 You're Live!

Share your demo link: **https://nivaas.vercel.app**

---

## Next Steps

1. **Customize branding:** Update logo, colors, company name
2. **Add your properties:** Edit `lib/listings.ts` with real data
3. **Set up custom domain:** In Vercel Settings → Domains
4. **Add authentication:** Implement phone OTP with Twilio
5. **Connect CRM:** Integrate Makanify or Zoho

---

Need help? Check `README.md` and `DEPLOYMENT_GUIDE.md` for more info.
