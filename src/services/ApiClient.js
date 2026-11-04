import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/usuario.slice";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
    const { token } = store.getState().usuario;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Token vencido o inválido: se cierra la sesión y se vuelve al login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            window.location.replace("/");
        }
        return Promise.reject(error);
    },
);

// Mensaje legible para mostrar en un toast
export const getErrorMessage = (error) =>
    error.response?.data?.message ?? (error.request ? "No se pudo conectar con el servidor." : "Ocurrió un error inesperado.");
