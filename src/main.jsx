import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TelemetryProvider } from './context/TelemetryContext.jsx'
import { LayoutProvider } from './context/LayoutContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LayoutProvider>
      <TelemetryProvider>
        <App />
      </TelemetryProvider>
    </LayoutProvider>
  </StrictMode>,
)

