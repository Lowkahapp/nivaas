# 🏠 Nivaas - Apartment Search Platform

A modern, full-stack apartment rental platform for Hinjewadi Phase 3, Pune.

**Live Demo:** (Deploy to Vercel to see it live)

---

## 📋 Features

### Tenant-Facing
- ✅ Search apartments by BHK, furnishing, rent, RERA verification
- ✅ View detailed property listings with photos, amenities, nearby places
- ✅ Schedule visits with one-click form
- ✅ Mobile-first responsive design

### Landlord-Facing
- ✅ List your property in minutes
- ✅ Track views and inquiries
- ✅ Field verification badge

### Admin Dashboard
- ✅ Approve/reject property submissions
- ✅ Manage tenant lead inquiries
- ✅ Track verification workflow
- ✅ Real-time stats (pending properties, live listings, new leads)

---

## 🚀 Quick Start (Local)

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (for local development without Docker)

### Run Locally

```bash
# Start all services (app + API + database)
docker-compose up -d

# Access the app
# Frontend: http://localhost:8000
# Admin: http://localhost:8000/admin
# API: http://localhost:3001
```

### Stop Services
```bash
docker-compose down
```

---

## 📦 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express, Cors
- **Database:** PostgreSQL 16
- **Deployment:** Vercel (frontend), Railway/Render (backend)
- **Containerization:** Docker & Docker Compose

---

## 🌐 Deployment

### Option 1: Frontend Only (5 min) - Fastest
Deploy just the Next.js app to Vercel without backend:

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://vercel.com/new
# 3. Import your GitHub repo
# 4. Deploy
```

### Option 2: Full Stack (15 min) - Recommended for Demo
Deploy frontend + backend + database:

1. **Deploy Backend to Railway:**
   - Go to https://railway.app/new
   - Deploy from your GitHub repo
   - Add PostgreSQL database
   - Get API URL

2. **Deploy Frontend to Vercel:**
   - Go to https://vercel.com/new
   - Import GitHub repo
   - Set environment variable: `NEXT_PUBLIC_API_URL=<your-railway-api-url>`
   - Deploy

See `DEPLOYMENT_GUIDE.md` for detailed steps.

---

## 📂 Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── list-property/     # Landlord listing form
│   ├── listing/[id]/      # Property detail page
│   ├── search/            # Tenant search page
│   └── page.tsx           # Home page
├── api/                   # Node.js API server
│   ├── server.js          # Express app
│   ├── db.js              # Database helpers
│   └── Dockerfile
├── components/            # React components
├── lib/                   # Utilities and data
├── public/                # Static assets
├── docker-compose.yml     # Multi-container setup
├── schema.sql             # Database schema
└── Dockerfile             # Next.js containerization
```

---

## 🔄 API Endpoints

### Properties
- `POST /api/properties` - Submit new property
- `GET /api/properties?status=live` - Get all live properties
- `GET /api/properties/:id` - Get single property
- `PATCH /api/properties/:id` - Approve/reject property (admin)
- `DELETE /api/properties/:id` - Delete property

### Visit Requests
- `POST /api/visit-requests` - Submit visit request
- `GET /api/visit-requests?status=new` - Get new requests (admin)
- `PATCH /api/visit-requests/:id` - Update request status

### Stats
- `GET /api/stats` - Dashboard metrics

---

## 🗄️ Database Schema

```sql
users (landlords, admins, staff)
properties (listings with verification status)
visit_requests (tenant inquiries with status tracking)
```

See `schema.sql` for full schema.

---

## 🔐 Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend (docker-compose or Railway):**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nivaas
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## 📊 Feature Roadmap

### Phase 1 ✅ (Complete)
- [x] Frontend UI (home, search, listings, detail)
- [x] Admin dashboard
- [x] Landlord form & tenant form
- [x] PostgreSQL database
- [x] REST API with CRUD operations

### Phase 2 (Next)
- [ ] User authentication (phone OTP)
- [ ] Saved favorites & search history
- [ ] Video upload & playback
- [ ] Email notifications
- [ ] WhatsApp integration

### Phase 3 (Future)
- [ ] CRM integration (Makanify, Zoho)
- [ ] Advanced analytics
- [ ] AI property recommendations
- [ ] Payment gateway (for premium listings)
- [ ] Mobile app (React Native)

---

## 🧪 Testing

### Test the Full Flow Locally

1. **Submit a property:**
   - Go to http://localhost:8000/list-property
   - Fill in the form
   - Submit

2. **Approve it in admin:**
   - Go to http://localhost:8000/admin
   - Click "Properties" tab
   - Click "Approve" on your test property
   - Status changes to "live"

3. **See it in search:**
   - Go to http://localhost:8000/search
   - Your property appears in results

4. **Request a visit:**
   - Go to listing detail
   - Fill "Schedule Visit" form
   - Submit

5. **Track it in admin:**
   - Go to http://localhost:8000/admin
   - Click "Lead Requests" tab
   - See your visit request with status "new"
   - Click "Mark Contacted" or "Visit Scheduled"

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
# Or kill the process
docker kill $(docker ps -q)
docker-compose up -d
```

### Database Connection Error
```bash
# Check if database is healthy
docker-compose ps

# View logs
docker-compose logs db
```

### API Not Responding
```bash
# Check API logs
docker-compose logs api

# Verify environment variables
docker-compose exec api env
```

---

## 📝 License

MIT

---

## 👥 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions, open a GitHub issue or contact the team.

---

## 🎯 Next Steps

1. **Customize for your city:** Update listings data in `lib/listings.ts`
2. **Add your branding:** Update colors, fonts, logo in Tailwind config
3. **Deploy to Vercel:** Follow `DEPLOYMENT_GUIDE.md`
4. **Add authentication:** Integrate Twilio or Firebase for phone OTP
5. **Connect CRM:** Add Makanify or Zoho integration

---

**Built with ❤️ for Hinjewadi Phase 3, Pune**
