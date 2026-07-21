import { query, getOne, getAll } from '../../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const stats = await getOne('SELECT COUNT(*) as pending FROM properties WHERE status = $1', ['pending']);
      const live = await getOne('SELECT COUNT(*) as count FROM properties WHERE status = $1', ['live']);
      const newReqs = await getOne('SELECT COUNT(*) as count FROM visit_requests WHERE status = $1', ['new']);
      const views = await getOne('SELECT SUM(views) as total FROM properties');

      res.status(200).json({
        pending_properties: parseInt(stats?.pending || 0),
        live_properties: parseInt(live?.count || 0),
        new_requests: parseInt(newReqs?.count || 0),
        total_views: parseInt(views?.total || 0),
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
