import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getWarehouse } from "../services/WarehouseService";
import { clearWarehouse, selectWarehouse } from "../slices/WarehouseSlice";

// Pide elegir una planta antes de entrar. Va dentro de ProtectedRoute
const WarehouseGuard = () => {
    const selectedId = useSelector((state) => state.warehouse.selected?._id);
    const dispatch = useDispatch();

    // La planta guardada puede haber dejado de estar asignada o de existir (RN14)
    useEffect(() => {
        if (!selectedId) return;
        getWarehouse(selectedId)
            .then((warehouse) => dispatch(selectWarehouse(warehouse)))
            .catch((error) => {
                if ([403, 404].includes(error.response?.status)) dispatch(clearWarehouse());
            });
    }, [selectedId, dispatch]);

    if (!selectedId) return <Navigate to="/seleccionar-planta" replace />;

    return <Outlet />;
};

export default WarehouseGuard;
