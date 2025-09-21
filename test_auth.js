const axios = require('axios');

// Test the authentication endpoints
async function testAuth() {
  const API_BASE = 'http://localhost:8000/api';
  
  console.log('Testing authentication endpoints...');
  console.log('API Base:', API_BASE);
  
  try {
    // Test login with invalid credentials (should fail)
    console.log('\n--- Testing Login with Invalid Credentials ---');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      identifier: 'test@example.com',
      password: 'wrongpassword',
      user_type: 'student'
    });
    console.log('Unexpected success:', loginResponse.data);
  } catch (error) {
    console.log('Expected login error:', error.response?.data || error.message);
  }
  
  try {
    // Test signup
    console.log('\n--- Testing Signup ---');
    const signupResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'testuser@example.com',
      password: 'testpassword',
      user_type: 'student',
      full_name: 'Test User'
    });
    console.log('Signup response:', signupResponse.data);
    
    // If signup is successful, try to login with the new user
    console.log('\n--- Testing Login with New User ---');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      identifier: 'testuser@example.com',
      password: 'testpassword',
      user_type: 'student'
    });
    console.log('Login response:', loginResponse.data);
  } catch (error) {
    console.log('Signup/Login error:', error.response?.data || error.message);
  }
}

testAuth();