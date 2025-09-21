import { initDB } from '../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = await initDB();
    const noticesCollection = db.collection('notices');

    const notices = await noticesCollection
      .find({ is_active: true })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    res.status(200).json(notices);
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}