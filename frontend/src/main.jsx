// src/main.jsx (Expected structure)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// 1. Import BrowserRouter
import { BrowserRouter } from 'react-router-dom'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. BrowserRouter is placed here, wrapping the entire App */}
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);