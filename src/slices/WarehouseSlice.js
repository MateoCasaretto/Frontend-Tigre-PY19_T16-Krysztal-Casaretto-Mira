import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../features/usuario.slice";

const STORAGE_KEY = "warehouse";

const readStoredWarehouse = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
};

const clear = (state) => {
    state.selected = null;
    localStorage.removeItem(STORAGE_KEY);
};

// Planta sobre la que está trabajando el usuario (CU17)
const warehouseSlice = createSlice({
    name: "warehouse",
    initialState: { selected: readStoredWarehouse() },
    reducers: {
        selectWarehouse: (state, action) => {
            const { _id, name } = action.payload;
            state.selected = { _id, name };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.selected));
        },
        clearWarehouse: clear,
    },
    extraReducers: (builder) => {
        builder.addCase(logout, clear);
    },
});

export const { selectWarehouse, clearWarehouse } = warehouseSlice.actions;

export default warehouseSlice.reducer;
