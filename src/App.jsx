import './App.css'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DobleFactorPage from './pages/DobleFactorPage'
import ProtectedRoute from './guards/ProtectedRoute'
import RegisterPage from './pages/RegisterPage'
import CatalogImportPage from './pages/CatalogImportPage'

function App() {
  return (
  <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
         <Route path="/home" element={<HomePage />} />
         <Route path="/doble-factor" element={<DobleFactorPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="/importar-catalogo" element={<CatalogImportPage />} />
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={4000} theme="light" />
  </>
  )
}

export default App
