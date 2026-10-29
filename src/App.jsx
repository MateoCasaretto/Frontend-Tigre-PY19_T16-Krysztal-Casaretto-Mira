import './App.css'
import { Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DobleFactorPage from './pages/DobleFactorPage'
import ProtectedRoute from './guards/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
         <Route path="/home" element={<HomePage />} />
         <Route path="/doble-factor" element={<DobleFactorPage />} />
      </Route>
    </Routes>
  )
}

export default App
