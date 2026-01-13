import React from 'react'           // ← Add this
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './auth/context/AuthContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)