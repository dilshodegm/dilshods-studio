import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { NotFound } from './routes/NotFound'
import { PageScreen } from './routes/PageScreen'
import { PhaseCover } from './routes/PhaseCover'
import { ProcessIndex } from './routes/ProcessIndex'

const router = createBrowserRouter([
  { path: '/', element: <ProcessIndex /> },
  { path: '/:phaseKey', element: <PhaseCover /> },
  { path: '/:phaseKey/:pageKey', element: <PageScreen /> },
  { path: '*', element: <NotFound /> },
])

export function App() {
  return <RouterProvider router={router} />
}
