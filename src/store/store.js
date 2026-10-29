import { configureStore } from "@reduxjs/toolkit";
import usuarioReducer from "../features/usuario.slice.js"

export const store = configureStore({
    reducer: {
        usuario: usuarioReducer
    }
})