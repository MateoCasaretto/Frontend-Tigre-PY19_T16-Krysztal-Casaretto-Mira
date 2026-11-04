import { apiClient } from "./ApiClient";

export const downloadCatalogTemplate = async () => {
    const { data } = await apiClient.get("/catalog/imports/template", { responseType: "blob" });
    return data;
};

export const importCatalog = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    // Sin límite de tiempo: un catálogo grande tarda más que una llamada común
    const { data } = await apiClient.post("/catalog/imports", formData, { timeout: 0 });
    return data.data;
};
