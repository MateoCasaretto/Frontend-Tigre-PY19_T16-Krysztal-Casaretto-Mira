import { apiClient } from "./ApiClient";

const elementsUrl = (warehouseId) => `/warehouses/${warehouseId}/elements`;

export const listElements = async (warehouseId) => {
    const { data } = await apiClient.get(elementsUrl(warehouseId));
    return data.data;
};

export const createElement = async (warehouseId, element) => {
    const { data } = await apiClient.post(elementsUrl(warehouseId), element);
    return data.data;
};

export const updateElement = async (warehouseId, elementId, element) => {
    const { data } = await apiClient.put(`${elementsUrl(warehouseId)}/${elementId}`, element);
    return data.data;
};

export const updateLayout = async (warehouseId, layout) => {
    const { data } = await apiClient.put(`${elementsUrl(warehouseId)}/layout`, layout);
    return data.data;
};

export const deleteElement = async (warehouseId, elementId) => {
    await apiClient.delete(`${elementsUrl(warehouseId)}/${elementId}`);
};
