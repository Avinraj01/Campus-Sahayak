// Test routing functionality
console.log('Testing routing setup...');

// Check if environment variables are properly loaded
console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);

// Test if the URL construction is correct
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';
console.log('Constructed API URL:', API);

// Test URL construction for different endpoints
console.log('Login URL:', `${API}/auth/login`);
console.log('Register URL:', `${API}/auth/register`);

console.log('Routing test completed.');