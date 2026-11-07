import { apiClient } from "./ApiClient";

// CU03: posiciones ocupadas y productos de cada estantería o zona de piso
export const getWarehouseOccupancy = async (warehouseId) => {
    const { data } = await apiClient.get(`/warehouses/${warehouseId}/occupancy`);
    return data.data;
};

// CU08: productos con stock en una estantería (todas sus posiciones) o en una zona de piso
export const listElementStock = async (warehouseId, elementId) => {
    const { data } = await apiClient.get(`/warehouses/${warehouseId}/elements/${elementId}/stock`);
    return data.data;
};
