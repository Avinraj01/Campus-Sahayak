// Simple test to check if the proxy is working
fetch('/api-info')
  .then(response => response.json())
  .then(data => console.log('Proxy test successful:', data))
  .catch(error => console.error('Proxy test failed:', error));