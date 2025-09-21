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
  const formsCollection = db.collection('form_submissions');

  if (req.method === 'POST') {
    try {
      const { title, description, form_type } = req.body;
      
      if (!title || !description || !form_type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const formSubmission = {
        id: Math.random().toString(36).substr(2, 9),
        user_id: userId,
        title,
        description,
        form_type,
        file_path: null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: null
      };

      const formToInsert = prepareForMongo(formSubmission);
      await formsCollection.insertOne(formToInsert);

      res.status(200).json({
        message: 'Form submitted successfully',
        id: formSubmission.id
      });
    } catch (error) {
      console.error('Create form error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const forms = await formsCollection
        .find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(50)
        .toArray();

      res.status(200).json(forms);
    } catch (error) {
      console.error('Get forms error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}