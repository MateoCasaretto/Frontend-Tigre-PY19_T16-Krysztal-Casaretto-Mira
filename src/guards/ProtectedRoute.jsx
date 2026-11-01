import { Navigate, Outlet, useLocation } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/usuario.slice";

const ProtectedRoute = ({ allowedRoles = [] }) => {

    const token = localStorage.getItem('token');

    const isAuthenticated = localStorage.getItem('nombreUsuario') !== null && localStorage.getItem('token') !== null;

    const twoFactorEnabled = localStorage.getItem('twoFactorEnabled') === 'true';

    const rol = localStorage.getItem('rol');

    const location = useLocation();

    const dispatch = useDispatch();

    let tokenExpired = true;

    try {
        const payload = jwtDecode(token);
        tokenExpired = !payload.exp || payload.exp * 1000 <= Date.now();
    } catch {
        tokenExpired = true;
    }

    useEffect(() => {
        if (token && tokenExpired) {
            dispatch(logout());
        }
    }, [token, tokenExpired, dispatch]);
    
    if (!isAuthenticated || tokenExpired) {
        return <Navigate to="/" replace />
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