import axios from 'axios';

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test the root endpoint
    const rootResponse = await axios.get('/api-info');
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test the login endpoint with invalid credentials (should get 401)
    try {
      const loginResponse = await axios.post('/api/auth/login', {
        identifier: 'test@example.com',
        password: 'wrongpassword',
        user_type: 'student'
      });
      console.log('Login response:', loginResponse.data);
    } catch (error) {
      console.log('Login error (expected):', error.response?.data || error.message);
    }
    
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};