import clienteAxios from "../../config/clienteAxios";

export async function create(payload, config) {
    const data = await clienteAxios.post("/financialgoal/create", payload, config);
    return data;
}

export async function getAll(payload, page, pageSize, config) {
    const data = await clienteAxios.post(`/financialgoal/getbyuserid?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function getByState(payload, page, pageSize, config) {
    const data = await clienteAxios.post(`/financialgoal/getbystate?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function withdrawGoal(goalId, config) {
    const data = await clienteAxios.delete(`/financialgoal/withdraw/${goalId}`, config);
    return data;
}

export async function modifyGoal(goalId, payload, config) {
    const data = await clienteAxios.put(`/financialgoal/modify/${goalId}`, payload, config);
    return data;
}

export async function deleteGoal(goalId, config) {
    const data = await clienteAxios.delete(`/financialgoal/delete/${goalId}`, config);
    return data;
}