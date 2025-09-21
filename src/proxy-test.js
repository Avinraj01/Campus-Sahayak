// Use environment variable for API URL, fallback to relative URL for proxy
const baseUrl = process.env.REACT_APP_API_URL || '';

// Simple test to check if the proxy is working
fetch(`${baseUrl}/api-info`)
  .then(response => response.json())
  .then(data => console.log('Proxy test successful:', data))
  .catch(error => console.error('Proxy test failed:', error));