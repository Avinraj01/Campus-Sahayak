import { api } from "./utils/api";

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    console.log('API Base URL:', api.defaults.baseURL);
    
    // Test the root endpoint
    const response = await api.get("/api-info");
    console.log('API connection test successful:', response.data);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    console.error('Error response:', error.response);
    console.error('API Base URL was:', api.defaults.baseURL);
    return false;
  }
};

export const testLoginEndpoint = async () => {
  try {
    console.log('Testing login endpoint...');
    const response = await api.post("/auth/login", {
      identifier: 'test@example.com',
      password: 'password123',
      user_type: 'student'
    });
    console.log('Login endpoint test successful:', response.data);
    return true;
  } catch (error) {
    console.log('Login endpoint test failed (expected if user does not exist):', error.response?.data || error.message);
    // This is expected to fail if the user doesn't exist, but we want to check if the endpoint is reachable
    return error.response?.status !== undefined; // Return true if we got any response from the server
  }
};