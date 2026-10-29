import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {

    const isAuthenticated = localStorage.getItem('nombreUsuario') !== null && localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default ProtectedRoute