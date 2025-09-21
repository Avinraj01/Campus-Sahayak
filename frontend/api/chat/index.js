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

    // Instead of calling OpenRouter directly, forward the request to our backend
    // This ensures the API key stays secure on the backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    // Make request to backend chat endpoint
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message,
        session_id,
        language
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.detail || 'Backend service error' });
    }

    const data = await response.json();
    
    // Return the response from backend
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Chat proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      message: error.message 
    });
  }
}