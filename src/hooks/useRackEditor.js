import { useState } from "react";
import { toast } from "react-toastify";
import { useWarehouseMap } from "./useWarehouseMap";
import { getErrorMessage } from "../services/ApiClient";
import { updateElement } from "../services/WarehouseElementService";
import { toRackPayload } from "../utils/RackUtils";

// CU15 A1: la estantería se edita en borrador y se guarda todo junto
export const useRackEditor = (warehouseId, elementId) => {
    const { elements, setElements, loading, error, reload } = useWarehouseMap(warehouseId);
    const [draft, setDraft] = useState(null);
    const [selection, setSelection] = useState(null);
    const [saving, setSaving] = useState(false);

    const saved = elements.find(({ _id }) => _id === elementId) ?? null;
    const rack = draft ?? saved;

    const applyChange = (change) => setDraft(change(rack));

    const discard = () => {
        setDraft(null);
        setSelection(null);
    };

    const save = async () => {
        setSaving(true);
        try {
            const updated = await updateElement(warehouseId, elementId, toRackPayload(draft));
            setElements((current) => current.map((element) => (element._id === elementId ? updated : element)));
            setDraft(null);
            toast.success("Estantería guardada.");
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return { rack, selection, setSelection, dirty: draft !== null, saving, loading, error, reload, applyChange, discard, save };
};
