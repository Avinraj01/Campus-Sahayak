// Test file to verify Vercel deployment configuration
import { api } from "./utils/api";

// Test API connection specifically for Vercel deployment
export const testVercelDeployment = async () => {
  console.log("=== Vercel Deployment Test ===");
  
  // Log current environment and configuration
  console.log("Environment:", process.env.NODE_ENV);
  console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
  console.log("API Base URL:", api.defaults.baseURL);
  
  // Check if we're in Vercel deployment
  const isVercelDeployment = process.env.REACT_APP_BACKEND_URL && 
                             !process.env.REACT_APP_BACKEND_URL.includes('localhost');
  
  console.log("Is Vercel Deployment:", isVercelDeployment);
  
  // Test the API configuration
  try {
    // Test root endpoint
    console.log("Testing root endpoint...");
    const rootResponse = await api.get("/");
    console.log("✓ Root endpoint test successful:", rootResponse.status);
    
    // Test auth endpoint (without /api prefix as it's handled by the proxy)
    console.log("Testing auth endpoint...");
    const authResponse = await api.get("/auth/status");
    console.log("✓ Auth endpoint test successful:", authResponse.status);
    
    console.log("=== Vercel Deployment Test Complete ===");
    return true;
  } catch (error) {
    console.error("✗ Vercel deployment test failed:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    console.log("=== Vercel Deployment Test Complete (with errors) ===");
    return false;
  }
};

// Run the test if this file is imported
testVercelDeployment();

export default testVercelDeployment;