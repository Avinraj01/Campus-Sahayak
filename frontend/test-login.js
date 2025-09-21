const axios = require('axios');

// Test the login endpoint
async function testLogin() {
  try {
    console.log('Testing login endpoint at http://localhost:8000/api/auth/login');
    
    // Test with invalid credentials (should return 401)
    const loginResponse = await axios.post('http://localhost:8000/api/auth/login', {
      identifier: 'test@example.com',
      password: 'wrongpassword',
      user_type: 'student'
    });
    
    console.log('Login response:', loginResponse.data);
  } catch (error) {
    console.error('Login test result:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testLogin();