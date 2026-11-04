import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/ApiClient";
import { listWarehouses } from "../services/WarehouseService";

// Plantas que puede ver el usuario: todas para el Administrador, las asignadas para el Operario
export const useWarehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let ignore = false;
        listWarehouses()
            .then((list) => {
                if (ignore) return;
                setWarehouses(list);
                setError(null);
            })
            .catch((err) => {
                if (!ignore) setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [version]);

    const reload = useCallback(() => setVersion((current) => current + 1), []);

    return { warehouses, loading, error, reload };
};
