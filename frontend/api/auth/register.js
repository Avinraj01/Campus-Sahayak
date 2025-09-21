import { initDB, hashPassword, createAccessToken, generateEnrollmentNo, generateTeacherId, prepareForMongo } from '../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, user_type, full_name, phone } = req.body;
    
    if (!email || !password || !user_type || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = await initDB();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const userId = Math.random().toString(36).substr(2, 9);
    
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      full_name,
      user_type,
      phone,
      created_at: new Date().toISOString(),
      is_active: true
    };

    // Generate enrollment/teacher ID based on user type
    if (user_type === 'student') {
      user.enrollment_no = generateEnrollmentNo();
    } else if (user_type === 'faculty') {
      user.teacher_id = generateTeacherId();
    }

    const userToInsert = prepareForMongo(user);
    await usersCollection.insertOne(userToInsert);

    // Create access token
    const token = createAccessToken({ sub: userId });

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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}