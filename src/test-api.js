import { api } from './utils/api';

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test the register endpoint with a test user
    try {
      const registerResponse = await api.post("/auth/register", {
        email: 'testuser@example.com',
        password: 'password123',
        user_type: 'student',
        full_name: 'Test User'
      });
      console.log('Register response:', registerResponse.data);
    } catch (error) {
      console.log('Register error (might be duplicate user):', error.response?.data || error.message);
    }
    
    // Test the login endpoint with invalid credentials (should get 401)
    try {
      const loginResponse = await api.post("/auth/login", {
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