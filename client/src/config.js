// client/src/config.js

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Agar localhost hai toh local server, nahi toh Render server
export const API_BASE_URL = isLocal 
  ? "http://localhost:5000" 
  : "https://unitime.onrender.com"; // Yahan apna Render URL daalo