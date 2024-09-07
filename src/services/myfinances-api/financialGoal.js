import axiosClient from "../../config/axiosClient";

export async function create(payload, config) {
    const data = await axiosClient.post("/financialgoal/create", payload, config);
    return data;
}

export async function getAll(payload, page, pageSize, config) {
    const data = await axiosClient.post(`/financialgoal/getbyuserid?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function getByState(payload, page, pageSize, config) {
    const data = await axiosClient.post(`/financialgoal/getbystate?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function withdrawGoal(goalId, config) {
    const data = await axiosClient.delete(`/financialgoal/withdraw/${goalId}`, config);
    return data;
}

export async function modifyGoal(goalId, payload, config) {
    const data = await axiosClient.put(`/financialgoal/modify/${goalId}`, payload, config);
    return data;
}

export async function deleteGoal(goalId, config) {
    const data = await axiosClient.delete(`/financialgoal/delete/${goalId}`, config);
    return data;
}