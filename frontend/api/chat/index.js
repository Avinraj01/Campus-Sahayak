import OpenAI from 'openai';
import { initDB, verifyToken } from '../../lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    const userId = decoded.sub;

    const { message, session_id, language } = req.body;
    
    if (!message || !session_id) {
      return res.status(400).json({ error: 'Missing required fields: message and session_id' });
    }

    // Get user info
    const db = await initDB();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ id: userId });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Get conversation history
    const conversationsCollection = db.collection('conversations');
    const history = await conversationsCollection
      .find({ session_id })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    const conversationHistory = [];
    for (const chat of history.reverse()) {
      conversationHistory.push(
        { role: 'user', content: chat.message },
        { role: 'assistant', content: chat.response }
      );
    }

    // Check if question is about scholarships
    const isScholarshipQuery = message.toLowerCase().includes('scholarship') || 
                              message.toLowerCase().includes('छात्रवृत्ति') ||
                              message.toLowerCase().includes('સ્કોલરશિપ') ||
                              message.toLowerCase().includes('స్కాలర్‌షిప్') ||
                              message.toLowerCase().includes('اسکالرشپ');

    let scholarshipInfo = '';
    if (isScholarshipQuery) {
      scholarshipInfo = `
        🎓 Current Scholarship Opportunities 2025:
        
        1. NSP Central Sector Scheme - Ministry of Education
        2. Vidyadhan Tamil Nadu Plus 1 Scholarship - Up to ₹10,000/year
        3. Post Matric Scholarships Karnataka (SSP) - For SC/ST/OBC students
        4. Reliance Foundation Undergraduate Scholarships - Up to ₹2 lakhs
        5. National Overseas Scholarship (NOS) - Opens Sept 15, 2025
        
        📅 Important Deadlines:
        - Reliance Foundation: October 4, 2025
        - NSP Portal: Check individual scheme deadlines
        
        💡 Apply at: National Scholarship Portal (NSP) or visit scholarship office
      `;
    }

    // Build system prompt
    const systemPrompt = `
      You are a helpful multilingual campus assistant for an educational institution. 
      
      ${language ? `Please respond in ${language}.` : 'Please respond in English.'}
      
      Campus Information:
      1. Fee payment deadline: March 15th, 2025 (Late fee: ₹500)
      2. Scholarship deadline: March 10th, 2025
      3. Library hours: 8 AM - 10 PM
      4. Admin office: 9 AM - 5 PM, Room 205
      5. Contact: avinyaduvansi123@gmail.com, +916200060778
      6. WhatsApp: +916200060778
      7. Facebook: https://www.facebook.com/profile.php?id=100022302462266
      
      ${scholarshipInfo}
      
      User Information:
      - Name: ${user.full_name}
      - Type: ${user.user_type}
      - ID: ${user.enrollment_no || user.teacher_id || 'General User'}
      
      If you cannot answer a specific question, direct them to contact the admin office.
      Keep responses concise, helpful, and friendly. Always respond in the detected language.
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-6),
      { role: 'user', content: message }
    ];

    // Initialize OpenAI client with the API key from environment variables
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY, // This will be set in Vercel environment variables
    });

    // Call OpenRouter API
    const completion = await openai.chat.completions.create({
      headers: {
        'HTTP-Referer': 'https://campus-lingua.preview.emergentagent.com',
        'X-Title': 'Campus Management System',
      },
      model: 'openai/gpt-4o',
      messages: messages,
      max_tokens: 200,
      temperature: 0.7
    });

    const botResponse = completion.choices[0].message.content;

    // Save conversation
    const chatRecord = {
      session_id,
      user_id: userId,
      message,
      response: botResponse,
      language: language || 'en',
      timestamp: new Date().toISOString(),
      context: { scholarship_query: isScholarshipQuery }
    };

    await conversationsCollection.insertOne(chatRecord);

    // Generate suggested links
    const suggestedLinks = [];
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('fee') || messageLower.includes('payment') || messageLower.includes('dues')) {
      suggestedLinks.push({ title: 'Fee Payment Portal', url: '/student-portal' });
      suggestedLinks.push({ title: 'Fee Structure', url: '/notices' });
    }
    
    if (messageLower.includes('scholarship') || messageLower.includes('financial aid')) {
      suggestedLinks.push({ title: 'Scholarship Portal', url: '/student-portal' });
      suggestedLinks.push({ title: 'Apply for Financial Aid', url: '/forms' });
    }
    
    if (messageLower.includes('complaint') || messageLower.includes('issue') || messageLower.includes('problem')) {
      suggestedLinks.push({ title: 'Submit Complaint', url: '/complaints' });
    }
    
    if (messageLower.includes('timetable') || messageLower.includes('schedule') || messageLower.includes('calendar')) {
      suggestedLinks.push({ title: 'Academic Calendar', url: '/calendar' });
      suggestedLinks.push({ title: 'Class Schedule', url: '/student-portal' });
    }
    
    if (messageLower.includes('form') || messageLower.includes('application') || messageLower.includes('certificate')) {
      suggestedLinks.push({ title: 'Form Submission', url: '/forms' });
    }

    res.status(200).json({
      response: botResponse,
      language: language || 'en',
      session_id,
      suggested_links: suggestedLinks
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}