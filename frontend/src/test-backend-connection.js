// Test script to verify backend connection
import { api } from './utils/api';

async function testBackendConnection() {
  console.log('Testing backend connection...');
  
  try {
    // Test basic connectivity
    const response = await api.get('/test');
    console.log('Backend connection test successful:', response.data);
    
    // Test health endpoint
    const healthResponse = await api.get('/health');
    console.log('Backend health check:', healthResponse.data);
    
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    
    return false;
  }
}

// Run the test
testBackendConnection().then(success => {
  if (success) {
    console.log('✅ Backend connection test passed');
  } else {
    console.log('❌ Backend connection test failed');
  }
});

export default testBackendConnection;