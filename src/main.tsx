import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LoadingSpinner } from './components/common/LoadingSpinner'

// Lazy load App for better performance
const App = lazy(() => import('./App'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <App />
    </Suspense>
  </StrictMode>,
)