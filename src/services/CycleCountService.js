import { apiClient } from "./ApiClient";

export const getCycleCounts = async () => {
    const { data } = await apiClient.get("/cycle-counts");
    return data.data;
};

export const createCycleCount = async (cycleCount) => {
    const { data } = await apiClient.post("/cycle-counts", cycleCount);
    return data.data;
};

export const getCycleCountDetail = async (cycleCountId) => {
    const { data } = await apiClient.get(`/cycle-counts/${cycleCountId}`);
    return data.data;
};

export const getMyCountTasks = async () => {
    const { data } = await apiClient.get("/cycle-counts/my-tasks");
    return data.data;
};

export const getCountTaskDetail = async (taskId) => {
    const { data } = await apiClient.get(`/cycle-counts/my-tasks/${taskId}`);
    return data.data;
};

export const saveCountItem = async (taskId, item) => {
    const { data } = await apiClient.patch(
        `/cycle-counts/my-tasks/${taskId}/items`,
        item
    );

    return data.data;
};

export const saveCountObservation = async (taskId, observation) => {
    const { data } = await apiClient.patch(
        `/cycle-counts/my-tasks/${taskId}/observations`,
        observation
    );

    return data.data;
};

export const finishCountTask = async (taskId) => {
    const { data } = await apiClient.patch(
        `/cycle-counts/my-tasks/${taskId}/finish`
    );

    return data.data;
};


export const createThirdCountTask = async (cycleCountId, group3Operators) => {
    const { data } = await apiClient.post(
        `/cycle-counts/${cycleCountId}/third-count`,
        { group3Operators }
    );

    return data.data;
};

export const justifyStockDifference = async (cycleCountId, justification) => {
    const { data } = await apiClient.patch(
        `/cycle-counts/${cycleCountId}/justify`,
        justification
    );

    return data.data;
};

export const closeCycleCount = async (cycleCountId) => {
    const { data } = await apiClient.patch(
        `/cycle-counts/${cycleCountId}/close`
    );

    return data.data;
};
