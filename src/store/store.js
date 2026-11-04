import { configureStore } from "@reduxjs/toolkit";
import usuarioReducer from "../features/usuario.slice.js"
import warehouseReducer from "../slices/WarehouseSlice.js"

export const store = configureStore({
    reducer: {
        usuario: usuarioReducer,
        warehouse: warehouseReducer
    }
})