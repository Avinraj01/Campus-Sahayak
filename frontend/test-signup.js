const axios = require('axios');

// Test the signup endpoint
async function testSignup() {
  try {
    console.log('Testing signup endpoint...');
    
    const response = await axios.post('http://localhost:8000/api/auth/register', {
      email: 'test@example.com',
      password: 'password123',
      user_type: 'student',
      full_name: 'Test User'
    });
    
    console.log('Signup successful:', response.data);
  } catch (error) {
    console.error('Signup failed:', error.response?.data || error.message);
  }
}

testSignup();