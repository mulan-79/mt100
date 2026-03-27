import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MountainsProvider } from './context/MountainsContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MountainsProvider>
        <App />
      </MountainsProvider>
    </BrowserRouter>
  </StrictMode>,
)
