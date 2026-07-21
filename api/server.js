import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import { getOne, getAll, query } from './db.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// File upload — store in /uploads, accessible at /uploads/<filename>
const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max per file
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpe?g|png|webp|gif|mp4|mov)$/i;
    cb(null, allowed.test(file.originalname));
  },
});
app.use('/uploads', express.static(uploadDir));

// POST /api/upload — accepts up to 10 files, returns array of URLs
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const baseUrl = process.env.API_BASE_URL || `http://localhost:${PORT}`;
  const urls = req.files.map((f) => `${baseUrl}/uploads/${f.filename}`);
  res.json({ urls });
});

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'change-me-in-production';

// Email transporter — only active if SMTP_HOST is set
const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

async function sendVisitConfirmation({ tenantName, tenantEmail, societyName, preferredDate }) {
  if (!mailer || !tenantEmail) return;
  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || '"Nivaas" <noreply@nivaas.in>',
      to: tenantEmail,
      subject: `Visit request confirmed – ${societyName}`,
      text: `Hi ${tenantName},\n\nWe've received your visit request for ${societyName}${preferredDate ? ` on ${preferredDate}` : ''}.\n\nYour relationship manager will call you within 2 hours to confirm the slot.\n\nTeam Nivaas`,
      html: `<p>Hi <strong>${tenantName}</strong>,</p>
<p>We've received your visit request for <strong>${societyName}</strong>${preferredDate ? ` on <strong>${preferredDate}</strong>` : ''}.</p>
<p>Your relationship manager will call you within 2 hours to confirm the slot.</p>
<p>Team Nivaas</p>`,
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

// Middleware: require X-Admin-Key header for protected routes
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing admin key' });
  }
  next();
}

// ============ PROPERTY ENDPOINTS ============

// Submit a new property (landlord form)
app.post('/api/properties', async (req, res) => {
  try {
    const {
      ownerName,
      phone,
      society,
      locality,
      city,
      pincode,
      bhk,
      furnishing,
      area,
      rent,
      deposit,
      maintenance = 0,
      media,
    } = req.body;

    if (!ownerName || !phone || !society || !bhk || !furnishing || !rent || !deposit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create landlord user if doesn't exist
    const existingUser = await getOne(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );
    let userId = existingUser?.id;

    if (!userId) {
      const result = await query(
        'INSERT INTO users (phone, name, role) VALUES ($1, $2, $3) RETURNING id',
        [phone, ownerName, 'landlord']
      );
      userId = result.rows[0].id;
    }

    // Create property
    const result = await query(
      `INSERT INTO properties (
        landlord_id, society_name, bhk, furnishing, area_sqft, rent, 
        deposit, maintenance, address, locality, city, pincode, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, status, created_at`,
      [
        userId,
        society,
        parseInt(bhk),
        furnishing,
        parseInt(area),
        parseInt(rent),
        parseInt(deposit),
        parseInt(maintenance),
        society, // address
        locality || '',
        city || '',
        pincode || '',
        'pending',
      ]
    );

    res.json({
      id: result.rows[0].id,
      status: result.rows[0].status,
      message: 'Property submitted for verification',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all properties (with filters + pagination)
app.get('/api/properties', async (req, res) => {
  try {
    const { status, bhk, furnishing, minRent, maxRent, page, limit } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (pageNum - 1) * pageSize;

    let sql = 'SELECT * FROM properties WHERE status = $1';
    const params = [status || 'live'];

    if (bhk) {
      sql += ` AND bhk = $${params.length + 1}`;
      params.push(parseInt(bhk));
    }
    if (furnishing) {
      sql += ` AND furnishing = $${params.length + 1}`;
      params.push(furnishing);
    }
    if (minRent) {
      sql += ` AND rent >= $${params.length + 1}`;
      params.push(parseInt(minRent));
    }
    if (maxRent) {
      sql += ` AND rent <= $${params.length + 1}`;
      params.push(parseInt(maxRent));
    }

    // Count total for pagination metadata
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await getOne(countSql, params);
    const total = parseInt(countResult?.total || 0);

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(pageSize, offset);

    const properties = await getAll(sql, params);
    res.json({
      data: properties,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await getOne(
      'SELECT * FROM properties WHERE id = $1',
      [req.params.id]
    );
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update property status (admin)
app.patch('/api/properties/:id', requireAdmin, async (req, res) => {
  try {
    const { status, rera_verified, field_verified, verified_by } = req.body;
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      params.push(status);
    }
    if (rera_verified !== undefined) {
      updates.push(`rera_verified = $${paramCount++}`);
      params.push(rera_verified);
    }
    if (field_verified !== undefined) {
      updates.push(`field_verified = $${paramCount++}`);
      params.push(field_verified);
    }
    if (verified_by) {
      updates.push(`verified_by = $${paramCount++}`);
      params.push(verified_by);
      updates.push(`verified_at = NOW()`);
    }
    updates.push(`updated_at = NOW()`);

    params.push(req.params.id);
    const sql = `UPDATE properties SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await query(sql, params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete property (admin)
app.delete('/api/properties/:id', requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ VISIT REQUEST ENDPOINTS ============

// Submit a visit request (tenant form)
app.post('/api/visit-requests', async (req, res) => {
  try {
    const { property_id, tenant_name, tenant_phone, tenant_email, preferred_date } = req.body;

    if (!property_id || !tenant_name || !tenant_phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO visit_requests (
        property_id, tenant_name, tenant_phone, tenant_email, preferred_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, status, created_at`,
      [property_id, tenant_name, tenant_phone, tenant_email, preferred_date, 'new']
    );

    // Send confirmation email (non-blocking)
    const property = await getOne('SELECT society_name FROM properties WHERE id = $1', [property_id]);
    sendVisitConfirmation({
      tenantName: tenant_name,
      tenantEmail: tenant_email,
      societyName: property?.society_name || 'the property',
      preferredDate: preferred_date,
    });

    res.json({
      id: result.rows[0].id,
      status: result.rows[0].status,
      message: 'Visit request submitted',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get visit requests (admin/staff)
app.get('/api/visit-requests', requireAdmin, async (req, res) => {
  try {
    const { status, property_id, assigned_to } = req.query;
    let sql = 'SELECT vr.*, p.society_name FROM visit_requests vr JOIN properties p ON vr.property_id = p.id WHERE 1=1';
    const params = [];

    if (status) {
      sql += ` AND vr.status = $${params.length + 1}`;
      params.push(status);
    }
    if (property_id) {
      sql += ` AND vr.property_id = $${params.length + 1}`;
      params.push(property_id);
    }
    if (assigned_to) {
      sql += ` AND vr.assigned_to = $${params.length + 1}`;
      params.push(assigned_to);
    }

    sql += ' ORDER BY vr.created_at DESC';
    const requests = await getAll(sql, params);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update visit request status (admin/staff)
app.patch('/api/visit-requests/:id', requireAdmin, async (req, res) => {
  try {
    const { status, assigned_to, notes } = req.body;
    const updates = [];
    const params = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      params.push(status);
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramCount++}`);
      params.push(assigned_to || null);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      params.push(notes);
    }
    updates.push(`updated_at = NOW()`);

    params.push(req.params.id);
    const sql = `UPDATE visit_requests SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;

    const result = await query(sql, params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Visit request not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ ADMIN STATS ENDPOINTS ============

// Get dashboard stats
app.get('/api/stats', requireAdmin, async (req, res) => {
  try {
    const pendingProps = await getOne('SELECT COUNT(*) as count FROM properties WHERE status = $1', ['pending']);
    const liveProps = await getOne('SELECT COUNT(*) as count FROM properties WHERE status = $1', ['live']);
    const newRequests = await getOne('SELECT COUNT(*) as count FROM visit_requests WHERE status = $1', ['new']);
    const totalViews = await getOne('SELECT SUM(views) as total FROM properties');

    res.json({
      pending_properties: parseInt(pendingProps.count),
      live_properties: parseInt(liveProps.count),
      new_requests: parseInt(newRequests.count),
      total_views: parseInt(totalViews.total) || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ RENTAL TRENDS ENDPOINT ============

app.get('/api/trends', async (req, res) => {
  try {
    const { city } = req.query; // optional city filter

    // ── Live listing data ──────────────────────────────────────────────────
    const liveFilter = city ? "status = 'live' AND city = $1" : "status = 'live'";
    const liveParams = city ? [city] : [];

    const byBhkLive = await getAll(
      `SELECT bhk,
              ROUND(AVG(rent)) AS avg_rent,
              ROUND(MIN(rent))  AS min_rent,
              ROUND(MAX(rent))  AS max_rent,
              COUNT(*)          AS listing_count
       FROM properties
       WHERE ${liveFilter}
       GROUP BY bhk ORDER BY bhk`,
      liveParams
    );

    const byLocalityLive = await getAll(
      `SELECT locality, city,
              ROUND(AVG(rent)) AS avg_rent,
              COUNT(*)          AS listing_count
       FROM properties
       WHERE ${liveFilter} AND locality != ''
       GROUP BY locality, city ORDER BY listing_count DESC LIMIT 15`,
      liveParams
    );

    const demandSupply = await getAll(
      `SELECT p.locality, p.city,
              COUNT(DISTINCT p.id) AS live_listings,
              COUNT(vr.id)         AS total_enquiries,
              ROUND(COUNT(vr.id)::numeric / NULLIF(COUNT(DISTINCT p.id),0), 1) AS enquiries_per_listing
       FROM properties p
       LEFT JOIN visit_requests vr ON vr.property_id = p.id
       WHERE p.${liveFilter.replace('status', 'p.status')} AND p.locality != ''
       GROUP BY p.locality, p.city
       ORDER BY enquiries_per_listing DESC LIMIT 15`,
      liveParams
    );

    const summary = await getOne(
      `SELECT ROUND(AVG(rent)) AS overall_avg_rent, COUNT(*) AS total_live_listings
       FROM properties WHERE ${liveFilter}`,
      liveParams
    );

    const newThisMonth = await getOne(
      `SELECT COUNT(*) AS count FROM visit_requests WHERE created_at >= date_trunc('month', NOW())`,
      []
    );

    // ── AI benchmark data ──────────────────────────────────────────────────
    const aiFilter = city ? 'city = $1' : '1=1';
    const aiParams = city ? [city] : [];

    const aiBenchmarks = await getAll(
      `SELECT locality, city, bhk, avg_rent, min_rent, max_rent, notes, generated_at
       FROM market_benchmarks WHERE ${aiFilter}
       ORDER BY city, locality, bhk`,
      aiParams
    );

    // Group AI benchmarks by city for the response
    const aiByCity = {};
    for (const row of aiBenchmarks) {
      if (!aiByCity[row.city]) aiByCity[row.city] = [];
      aiByCity[row.city].push(row);
    }

    // ── Merge: if live data is sparse, supplement with AI benchmarks ──────
    const liveCityCount = parseInt(summary?.total_live_listings || 0);
    const dataSource = liveCityCount >= 5 ? 'live' : aiBenchmarks.length > 0 ? 'ai' : 'sample';

    // For by_bhk: use live if available, otherwise aggregate AI
    let byBhk = byBhkLive;
    if (byBhk.length === 0 && aiBenchmarks.length > 0) {
      const bhkMap = {};
      for (const b of aiBenchmarks) {
        if (!bhkMap[b.bhk]) bhkMap[b.bhk] = { rents: [], mins: [], maxes: [] };
        bhkMap[b.bhk].rents.push(parseInt(b.avg_rent));
        bhkMap[b.bhk].mins.push(parseInt(b.min_rent));
        bhkMap[b.bhk].maxes.push(parseInt(b.max_rent));
      }
      byBhk = Object.entries(bhkMap)
        .sort(([a], [b]) => a - b)
        .map(([bhk, v]) => ({
          bhk: parseInt(bhk),
          avg_rent: Math.round(v.rents.reduce((a, b) => a + b, 0) / v.rents.length),
          min_rent: Math.min(...v.mins),
          max_rent: Math.max(...v.maxes),
          listing_count: 0,
        }));
    }

    // For by_locality: use live, then append AI localities not in live data
    let byLocality = byLocalityLive;
    if (aiBenchmarks.length > 0) {
      const liveLocalities = new Set(byLocalityLive.map((r) => r.locality));
      const aiLocalities = {};
      for (const b of aiBenchmarks) {
        if (liveLocalities.has(b.locality)) continue;
        if (!aiLocalities[b.locality]) aiLocalities[b.locality] = { rents: [], city: b.city };
        aiLocalities[b.locality].rents.push(parseInt(b.avg_rent));
      }
      const aiRows = Object.entries(aiLocalities).map(([locality, v]) => ({
        locality,
        city: v.city,
        avg_rent: Math.round(v.rents.reduce((a, b) => a + b, 0) / v.rents.length),
        listing_count: 0,
        source: 'ai',
      }));
      byLocality = [...byLocality, ...aiRows].slice(0, 20);
    }

    res.json({
      generated_at: new Date().toISOString(),
      data_source: dataSource,
      ai_benchmarks_count: aiBenchmarks.length,
      ai_last_updated: aiBenchmarks[0]?.generated_at || null,
      summary: {
        overall_avg_rent: parseInt(summary?.overall_avg_rent || 0),
        total_live_listings: liveCityCount,
        enquiries_this_month: parseInt(newThisMonth?.count || 0),
        cities_covered: Object.keys(aiByCity).length,
      },
      by_bhk: byBhk,
      by_locality: byLocality,
      demand_supply: demandSupply,
      ai_by_city: aiByCity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ============ AI RENTAL BENCHMARKS ============

// POST /api/trends/ai-refresh  (admin protected)
// Asks Claude for current rental benchmarks across major Indian cities,
// then upserts them into the market_benchmarks table.
app.post('/api/trends/ai-refresh', requireAdmin, async (req, res) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    const cities = req.body.cities || [
      'Pune', 'Bangalore', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi NCR', 'Kolkata', 'Ahmedabad'
    ];

    const prompt = `You are a real estate data analyst. Provide current (${new Date().getFullYear()}) rental market benchmarks for residential apartments in major Indian cities.

For each city listed below, give benchmark monthly rents (in INR) for the top 5 localities, broken down by BHK type (1, 2, 3).

Cities: ${cities.join(', ')}

Respond with ONLY a valid JSON array. No explanation, no markdown, no code fences. Format:
[
  {
    "city": "Pune",
    "locality": "Hinjewadi Phase 3",
    "bhk": 2,
    "avg_rent": 28000,
    "min_rent": 22000,
    "max_rent": 36000,
    "notes": "IT hub, high demand from tech professionals"
  }
]

Include realistic, current figures based on your knowledge of each market. Cover a range of localities from premium to affordable within each city.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '';

    // Strip any accidental markdown fences
    const jsonStr = raw.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
    const benchmarks = JSON.parse(jsonStr);

    if (!Array.isArray(benchmarks)) throw new Error('AI did not return an array');

    // Upsert into market_benchmarks
    let inserted = 0;
    for (const b of benchmarks) {
      if (!b.city || !b.locality || !b.bhk || !b.avg_rent) continue;
      await query(
        `INSERT INTO market_benchmarks (locality, city, bhk, avg_rent, min_rent, max_rent, notes, generated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
         ON CONFLICT (locality, bhk)
         DO UPDATE SET
           city = EXCLUDED.city,
           avg_rent = EXCLUDED.avg_rent,
           min_rent = EXCLUDED.min_rent,
           max_rent = EXCLUDED.max_rent,
           notes = EXCLUDED.notes,
           generated_at = NOW()`,
        [b.locality, b.city, parseInt(b.bhk), parseInt(b.avg_rent), parseInt(b.min_rent || b.avg_rent * 0.8), parseInt(b.max_rent || b.avg_rent * 1.3), b.notes || null]
      );
      inserted++;
    }

    res.json({
      message: `AI benchmarks refreshed — ${inserted} records upserted`,
      cities,
      records: inserted,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('AI refresh error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trends/benchmarks  — fetch all stored AI benchmarks (optional city filter)
app.get('/api/trends/benchmarks', async (req, res) => {
  try {
    const { city } = req.query;
    let sql = 'SELECT * FROM market_benchmarks';
    const params = [];
    if (city) {
      sql += ' WHERE city = $1';
      params.push(city);
    }
    sql += ' ORDER BY city, locality, bhk';
    const rows = await getAll(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✓ API running on http://localhost:${PORT}`);
});
