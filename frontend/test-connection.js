const axios = require('axios');

// Test the connection to the backend
async function testConnection() {
  try {
    console.log('Testing connection to backend at http://localhost:8000/healthz');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:8000/healthz');
    console.log('Health check response:', healthResponse.data);
    
    // Test API info endpoint
    const apiResponse = await axios.get('http://localhost:8000/api-info');
    console.log('API info response:', apiResponse.data);
    
    console.log('Connection test successful!');
  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testConnection();