// client/src/config.js

// This logic automatically switches between Localhost and your Live Server
const getApiUrl = () => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:5000"; 
  }
  // Replace this with your actual Render/Vercel backend URL if you have one
  return "https://unitime.onrender.com"; 
};

export const API_BASE_URL = getApiUrl();