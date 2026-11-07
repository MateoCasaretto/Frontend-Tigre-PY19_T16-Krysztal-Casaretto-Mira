import { useEffect, useState } from "react";
import { getWarehouseOccupancy } from "../services/StockLocationService";

// Ocupación de cada elemento del plano, por id. Si falla, el mapa se ve igual pero sin los contadores
export const useWarehouseOccupancy = (warehouseId) => {
    const [occupancy, setOccupancy] = useState(new Map());

    useEffect(() => {
        let ignore = false;
        getWarehouseOccupancy(warehouseId)
            .then((list) => {
                if (!ignore) setOccupancy(new Map(list.map((item) => [item.elementId, item])));
            })
            .catch(() => {
                if (!ignore) setOccupancy(new Map());
            });
        return () => {
            ignore = true;
        };
    }, [warehouseId]);

    return occupancy;
};
