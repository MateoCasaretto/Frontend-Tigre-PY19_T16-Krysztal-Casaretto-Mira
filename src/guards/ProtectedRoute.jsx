import { Navigate, Outlet, useLocation } from "react-router-dom"

const ProtectedRoute = ({ allowedRoles = [] }) => {

    const isAuthenticated = localStorage.getItem('nombreUsuario') !== null && localStorage.getItem('token') !== null;

    const twoFactorEnabled = localStorage.getItem('twoFactorEnabled') === 'true';

    const rol = localStorage.getItem('rol');

    const location = useLocation();
    
    if (!isAuthenticated) {
        return <Navigate to="/" />
    }

    if (!twoFactorEnabled && location.pathname !== '/doble-factor') {
        return <Navigate to="/doble-factor" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />
}

export default ProtectedRoute