import { api } from "./utils/api";

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test the register endpoint
    const response = await api.post('/api/auth/register', {
      email: 'frontendtest@example.com',
      password: 'password123',
      user_type: 'student',
      full_name: 'Frontend Test User'
    });
    
    console.log('API connection test successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error.response?.data || error.message);
    return false;
  }
};