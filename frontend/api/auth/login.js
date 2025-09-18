import { initDB, verifyPassword, createAccessToken } from '../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifier, password, user_type } = req.body;
    
    if (!identifier || !password || !user_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await initDB();
    const usersCollection = db.collection('users');

    // Find user by identifier (email, enrollment_no, or teacher_id)
    let query = { user_type };
    
    if (identifier.includes('@')) {
      query.email = identifier;
    } else if (user_type === 'student') {
      query.enrollment_no = identifier;
    } else if (user_type === 'faculty') {
      query.teacher_id = identifier;
    } else {
      query.email = identifier;
    }

    const user = await usersCollection.findOne(query);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create access token
    const token = createAccessToken({ sub: user.id });

    const userResponse = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type,
      enrollment_no: user.enrollment_no,
      teacher_id: user.teacher_id
    };

    res.status(200).json({
      access_token: token,
      token_type: 'bearer',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}