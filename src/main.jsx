import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("App is mounting...");

try {
  const root = document.getElementById('root');
  if (!root) throw new Error("Root element not found");
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log("Render called successfully");
} catch (e) {
  console.error("Mounting error:", e);
}
