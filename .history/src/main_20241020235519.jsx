import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'  // Add this import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>  {/* Add this wrapper */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)