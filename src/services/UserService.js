import { apiClient } from "./ApiClient";

export const listUsers = async (filters = {}) => {
    const { data } = await apiClient.get("/users", { params: filters });
    return data; // { message, data, pagination }
};

export const updateUserWarehouses = async (id, warehouses) => {
    const { data } = await apiClient.put(`/users/${id}/warehouses`, { warehouses });
    return data.data;
};
