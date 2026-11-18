import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AdminResponses from './components/AdminResponses.jsx'
import './styles/global.css'

const path = window.location.pathname.replace(/\/+$/, '') || '/'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {path === '/admin/respuestas' ? <AdminResponses /> : <App />}
  </StrictMode>,
)
