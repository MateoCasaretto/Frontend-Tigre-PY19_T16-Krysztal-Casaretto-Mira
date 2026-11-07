import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../services/ApiClient";
import { listElementStock } from "../services/StockLocationService";

// CU08 pasos 2 y 3: el stock de toda la estantería se pide una vez, así tocar otra posición no espera a la red
export const useElementStock = (warehouseId, elementId) => {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let ignore = false;
        listElementStock(warehouseId, elementId)
            .then((list) => {
                if (ignore) return;
                setStock(list);
                setError(null);
            })
            .catch((err) => {
                // ER1: no se muestra información parcial como válida
                if (ignore) return;
                setStock([]);
                setError(getErrorMessage(err));
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [warehouseId, elementId, version]);

    const reload = useCallback(() => {
        setLoading(true);
        setVersion((current) => current + 1);
    }, []);

    // Productos de una posición de la estantería; para una zona de piso, positionId es null
    const stockAt = useCallback(
        (positionId) => stock.filter((item) => (item.positionId ?? null) === (positionId ?? null)),
        [stock],
    );

    return { stock, stockAt, loading, error, reload };
};
