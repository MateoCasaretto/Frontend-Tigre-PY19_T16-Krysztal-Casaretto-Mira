import { apiClient } from "./ApiClient";

export const listWarehouses = async () => {
    const { data } = await apiClient.get("/warehouses");
    return data.data;
};

export const getWarehouse = async (id) => {
    const { data } = await apiClient.get(`/warehouses/${id}`);
    return data.data;
};

export const createWarehouse = async (warehouse) => {
    const { data } = await apiClient.post("/warehouses", warehouse);
    return data.data;
};

export const updateWarehouse = async (id, warehouse) => {
    const { data } = await apiClient.put(`/warehouses/${id}`, warehouse);
    return data.data;
};
