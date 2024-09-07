import axiosClient from "../../config/axiosClient";

export async function getAll(payload, page, pageSize, config) {
    const data = await axiosClient.post(`/transaction/getallbyuserid?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function filterTransactions(payload, page, pageSize, config) {
    const data = await axiosClient.post(`/transaction/filter?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function filterByType(payload, page, pageSize, config) {
    const data = await axiosClient.post(`/transaction/getbytype?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function newTransaction(payload, config) {
    const data = await axiosClient.post("/transaction/create", payload, config);
    return data;
}

export async function deleteTransaction(id, config) {
    const data = await axiosClient.delete(`/transaction/delete/${id}`, config);
    return data;
}

export async function modifyTransaction(id, payload, config) {
    const data = await axiosClient.put(`/transaction/modify/${id}`, payload, config);
    return data;
}