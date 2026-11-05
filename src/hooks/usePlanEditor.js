import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useWarehouseMap } from "./useWarehouseMap";
import { getErrorMessage } from "../services/ApiClient";
import { createElement, deleteElement, updateElement, updateLayout } from "../services/WarehouseElementService";
import { getWarehouse } from "../services/WarehouseService";
import { getFreeSpot, getMinPlanSize, getPlanSize } from "../utils/MapUtils";

// Lugar para mover y agregar elementos más allá de lo que ya hay
const EDIT_MARGIN = 6;

// CU15: el plano se edita en borrador y se guarda todo junto
export const usePlanEditor = (warehouseId) => {
    const { elements: saved, setElements, loading, error, reload } = useWarehouseMap(warehouseId);
    const [changes, setChanges] = useState({});
    const [selectedId, setSelectedId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [savedPlan, setSavedPlan] = useState({});
    const [planChanges, setPlanChanges] = useState({});
    const [frozenPlan, setFrozenPlan] = useState(null);

    useEffect(() => {
        let ignore = false;
        getWarehouse(warehouseId)
            .then(({ planWidth, planHeight }) => {
                if (!ignore) setSavedPlan({ width: planWidth, height: planHeight });
            })
            .catch(() => {});
        return () => {
            ignore = true;
        };
    }, [warehouseId]);

    const elements = useMemo(() => saved.map((element) => ({ ...element, ...changes[element._id] })), [saved, changes]);
    const currentPlan = useMemo(
        () => getPlanSize(elements, EDIT_MARGIN, { ...savedPlan, ...planChanges }),
        [elements, savedPlan, planChanges],
    );
    // Mientras se arrastra el plano no cambia: si no, el elemento se movería debajo del dedo
    const plan = frozenPlan ?? currentPlan;
    const minPlan = useMemo(() => getMinPlanSize(elements), [elements]);
    const selected = elements.find(({ _id }) => _id === selectedId) ?? null;
    const dirty = Object.keys(changes).length > 0 || Object.keys(planChanges).length > 0;

    const placeElement = (id, rect) => setChanges((current) => ({ ...current, [id]: { ...current[id], ...rect } }));

    const choosePlanSize = (size) => setPlanChanges((current) => ({ ...current, ...size }));

    const freezePlan = () => setFrozenPlan(currentPlan);

    const releasePlan = () => setFrozenPlan(null);

    const discard = () => {
        setChanges({});
        setPlanChanges({});
    };

    const saveLayout = async () => {
        setSaving(true);
        try {
            const placements = elements
                .filter(({ _id }) => changes[_id])
                .map(({ _id, x, y, sizeX, sizeY }) => ({ _id, x, y, sizeX, sizeY }));
            setElements(await updateLayout(warehouseId, {
                ...(placements.length > 0 && { elements: placements }),
                planWidth: planChanges.width,
                planHeight: planChanges.height,
            }));
            setChanges({});
            setSavedPlan((current) => ({ ...current, ...planChanges }));
            setPlanChanges({});
            toast.success("Plano guardado.");
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const addElement = async (element) => {
        try {
            // El alta se valida contra lo guardado y el borrador se guarda después: tiene que entrar en los dos
            const created = await createElement(warehouseId, { ...element, ...getFreeSpot([...saved, ...elements]) });
            setElements((current) => [...current, created]);
            setSelectedId(created._id);
            toast.success("Elemento creado.");
            return true;
        } catch (err) {
            toast.error(getErrorMessage(err));
            return false;
        }
    };

    const saveFloorZone = async ({ name, description }) => {
        const { _id, x, y, sizeX, sizeY } = saved.find((element) => element._id === selectedId);
        try {
            const updated = await updateElement(warehouseId, _id, { name, description, x, y, sizeX, sizeY });
            setElements((current) => current.map((element) => (element._id === _id ? updated : element)));
            toast.success("Zona actualizada.");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    const removeSelected = async () => {
        try {
            await deleteElement(warehouseId, selectedId);
            setElements((current) => current.filter(({ _id }) => _id !== selectedId));
            setChanges((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== selectedId)));
            setSelectedId(null);
            toast.success("Elemento eliminado.");
        } catch (err) {
            toast.error(getErrorMessage(err));
        }
    };

    return {
        elements, plan, minPlan, selected, selectedId, setSelectedId, dirty, saving, loading, error, reload,
        placeElement, choosePlanSize, freezePlan, releasePlan, discard, saveLayout, addElement, saveFloorZone, removeSelected,
    };
};
