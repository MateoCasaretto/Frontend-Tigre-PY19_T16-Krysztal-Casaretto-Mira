import { apiClient } from "./ApiClient";

export const searchProducts = async (filters) => {
    const { data } = await apiClient.get("/products", { params: filters });
    return data; // { message, data, pagination }
};

export const assignBarcode = async (id, barcode) => {
    const { data } = await apiClient.put(`/products/${id}/barcode`, { barcode });
    return data.data;
};
