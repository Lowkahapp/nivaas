# Nivaas Backend & Admin Dashboard - Setup Complete

## What's Live

### 1. **Frontend (Next.js)**
- **URL:** http://localhost:3000
- Home page, search, property details, landlord form, tenant visit form
- All forms now post to the API instead of logging to console

### 2. **API (Node.js/Express)**
- **URL:** http://localhost:3001
- REST endpoints for properties, visit requests, and admin stats
- Connected to PostgreSQL database

### 3. **Database (PostgreSQL)**
- **Host:** localhost:5432
- Schema: `properties`, `visit_requests`, `users` tables with indexes
- Auto-initialized on first startup

### 4. **Admin Dashboard**
- **URL:** http://localhost:3000/admin
- **Features:**
  - Overview stats (pending properties, live properties, new requests, total views)
  - Properties tab: approve/reject new submissions
  - Lead Requests tab: mark tenants as contacted, schedule visits
  - Real-time updates from the database

---

## How It Works

### Tenant Flow
1. Tenant searches properties on `/search`
2. Tenant views listing details on `/listing/[id]`
3. Tenant fills "Schedule Visit" form → POST to `/api/visit-requests`
4. Admin sees it in dashboard under "Lead Requests"
5. Admin marks as "Contacted" or "Visit Scheduled"

### Landlord Flow
1. Landlord goes to `/list-property`
2. Landlord fills property form → POST to `/api/properties`
3. Property created with status `pending`
4. Admin reviews it in dashboard under "Properties"
5. Admin clicks "Approve" → status becomes `live` and field_verified = true
6. Property now appears on `/search` for tenants

---

## API Endpoints

### Properties
- `POST /api/properties` - Submit new property
- `GET /api/properties?status=live` - Get all live properties (with filters)
- `GET /api/properties/:id` - Get single property
- `PATCH /api/properties/:id` - Update property (approve/reject/verify)
- `DELETE /api/properties/:id` - Delete property

### Visit Requests
- `POST /api/visit-requests` - Submit visit request
- `GET /api/visit-requests?status=new` - Get all new requests (with filters)
- `PATCH /api/visit-requests/:id` - Update request status (contacted, visit_scheduled, etc.)

### Stats
- `GET /api/stats` - Dashboard metrics

---

## Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Or in Docker, set in `docker-compose.yml`:

```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://api:3001
```

---

## Docker Commands

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f api    # API server
docker-compose logs -f app    # Next.js app
docker-compose logs -f db     # PostgreSQL
```

### Access database directly
```bash
docker exec -it apartments-db-1 psql -U postgres -d nivaas
```

---

## Next Steps (Phase 2)

1. **User Authentication** - Phone OTP login to save favorites and searches
2. **Video Uploads** - Integrate Cloudinary for property videos
3. **Email Notifications** - Send confirmations to landlords & tenants
4. **CRM Integration** - Connect to Makanify for lead tracking

---

## Verify It's Working

1. Go to http://localhost:3000/admin
2. You should see dashboard with stats (all 0 initially)
3. Go to http://localhost:3000/list-property
4. Submit a test property
5. Go back to admin dashboard → "Properties" tab → you should see it with status "pending"
6. Click "Approve" → status changes to "live" and field_verified = true
7. Go to http://localhost:3000/search → your new property appears!

---

## Database Schema

```sql
users (id, email, phone, name, role)
properties (id, landlord_id, society_name, bhk, rent, deposit, status, rera_verified, field_verified, ...)
visit_requests (id, property_id, tenant_name, tenant_phone, status, assigned_to, ...)
```

All tables have timestamps and indexes for fast queries.
