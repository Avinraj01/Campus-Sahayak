import { initDB, verifyToken, prepareForMongo } from '../../lib/utils';

export default async function handler(req, res) {
  // Verify authentication token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = verifyToken(token);
    const userId = decoded.sub;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const db = await initDB();
  const complaintsCollection = db.collection('complaints');

  if (req.method === 'POST') {
    try {
      const { title, description, category } = req.body;
      
      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const complaint = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        title,
        description,
        category,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: null
      };

      const complaintToInsert = prepareForMongo(complaint);
      await complaintsCollection.insertOne(complaintToInsert);

      res.status(200).json(complaint);
    } catch (error) {
      console.error('Create complaint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const complaints = await complaintsCollection
        .find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(50)
        .toArray();

      res.status(200).json(complaints);
    } catch (error) {
      console.error('Get complaints error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}