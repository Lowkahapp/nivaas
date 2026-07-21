import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getOne, getAll, query } from './db.js';

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
    // 1. Average rent + count by BHK
    const byBhk = await getAll(
      `SELECT bhk,
              ROUND(AVG(rent)) AS avg_rent,
              ROUND(MIN(rent))  AS min_rent,
              ROUND(MAX(rent))  AS max_rent,
              COUNT(*)          AS listing_count
       FROM properties
       WHERE status = 'live'
       GROUP BY bhk
       ORDER BY bhk`,
      []
    );

    // 2. Top localities by listing count + avg rent
    const byLocality = await getAll(
      `SELECT locality,
              ROUND(AVG(rent))  AS avg_rent,
              COUNT(*)          AS listing_count
       FROM properties
       WHERE status = 'live' AND locality != ''
       GROUP BY locality
       ORDER BY listing_count DESC
       LIMIT 10`,
      []
    );

    // 3. Demand vs supply — enquiries per listing by locality
    const demandSupply = await getAll(
      `SELECT p.locality,
              COUNT(DISTINCT p.id)   AS live_listings,
              COUNT(vr.id)           AS total_enquiries,
              ROUND(COUNT(vr.id)::numeric / NULLIF(COUNT(DISTINCT p.id), 0), 1) AS enquiries_per_listing
       FROM properties p
       LEFT JOIN visit_requests vr ON vr.property_id = p.id
       WHERE p.status = 'live' AND p.locality != ''
       GROUP BY p.locality
       ORDER BY enquiries_per_listing DESC
       LIMIT 10`,
      []
    );

    // 4. Summary stats
    const summary = await getOne(
      `SELECT ROUND(AVG(rent)) AS overall_avg_rent,
              COUNT(*)          AS total_live_listings
       FROM properties
       WHERE status = 'live'`,
      []
    );

    const newThisMonth = await getOne(
      `SELECT COUNT(*) AS count
       FROM visit_requests
       WHERE created_at >= date_trunc('month', NOW())`,
      []
    );

    res.json({
      generated_at: new Date().toISOString(),
      summary: {
        overall_avg_rent: parseInt(summary?.overall_avg_rent || 0),
        total_live_listings: parseInt(summary?.total_live_listings || 0),
        enquiries_this_month: parseInt(newThisMonth?.count || 0),
      },
      by_bhk: byBhk,
      by_locality: byLocality,
      demand_supply: demandSupply,
    });
  } catch (err) {
    console.error(err);
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
