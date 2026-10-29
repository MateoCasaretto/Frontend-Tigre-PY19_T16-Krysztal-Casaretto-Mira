import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    token: localStorage.getItem("token") ?? null,
    nombreUsuario: localStorage.getItem("nombreUsuario") ?? null,
    email: localStorage.getItem("email") ?? null,
    rol: localStorage.getItem("rol") ?? null,
    twoFactorEnabled: localStorage.getItem("twoFactorEnabled") === "true",
    userId: localStorage.getItem("userId") ?? null
};

export const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: intialState,
    reducers: {
        setUsuario: (state, action) => {
            state.token = action.payload.token;
            state.nombreUsuario = action.payload.nombreUsuario;
            state.email = action.payload.email;
            state.rol = action.payload.rol;
            state.twoFactorEnabled = action.payload.twoFactorEnabled;
            state.userId = action.payload.userId;
        },
        setTwoFactorEnabled: (state, action) => {
            state.twoFactorEnabled = action.payload;
            localStorage.setItem("twoFactorEnabled", action.payload);
        }
    }
});

export const { setUsuario, setTwoFactorEnabled } = usuarioSlice.actions;

export default usuarioSlice.reducer;