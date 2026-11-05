import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/ApiClient";
import { listElements } from "../services/WarehouseElementService";

// Estructura de la planta: estanterías y zonas de piso (CU03 pasos 2 a 4)
export const useWarehouseMap = (warehouseId) => {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let ignore = false;
        listElements(warehouseId)
            .then((list) => {
                if (ignore) return;
                setElements(list);
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
    }, [warehouseId, version]);

    const reload = useCallback(() => {
        setLoading(true);
        setVersion((current) => current + 1);
    }, []);

    return { elements, setElements, loading, error, reload };
};
