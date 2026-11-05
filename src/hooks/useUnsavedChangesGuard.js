import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker } from "react-router-dom";

// Avisa antes de perder un borrador. Dentro de la app pregunta con un modal;
// al recargar o cerrar la pestaña, el navegador solo admite su propio aviso
export const useUnsavedChangesGuard = (dirty) => {
    const leaving = useRef(false);
    const [logoutAnswer, setLogoutAnswer] = useState(null);

    const blocker = useBlocker(({ currentLocation, nextLocation }) => (
        dirty && !leaving.current && currentLocation.pathname !== nextLocation.pathname
    ));

    useEffect(() => {
        if (!dirty) return undefined;
        const warn = (event) => event.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    // Cerrar sesión borra la planta antes de navegar: hay que preguntar antes de empezar
    const confirmLogout = useCallback(() => {
        if (!dirty) return Promise.resolve(true);
        return new Promise((resolve) => setLogoutAnswer(() => resolve));
    }, [dirty]);

    const stay = () => {
        blocker.reset?.();
        logoutAnswer?.(false);
        setLogoutAnswer(null);
    };

    const leave = () => {
        leaving.current = true;
        blocker.proceed?.();
        logoutAnswer?.(true);
        setLogoutAnswer(null);
    };

    return { asking: blocker.state === "blocked" || logoutAnswer !== null, stay, leave, confirmLogout };
};
