// Test script to verify Vercel configuration
console.log('=== Vercel Configuration Test ===');
console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set');

// Check if we're in Vercel deployment
const isVercel = !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === 'production';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

console.log('Running in Vercel:', isVercel);
console.log('Production environment:', isProduction);
console.log('Backend URL:', backendUrl);

if (isVercel && isProduction) {
  if (backendUrl) {
    console.log('✓ Environment variables are properly set for Vercel production deployment');
  } else {
    console.log('✗ REACT_APP_BACKEND_URL is not set for Vercel production deployment');
  }
} else {
  console.log('✓ Local development environment detected');
}

console.log('=== Configuration Test Complete ===');