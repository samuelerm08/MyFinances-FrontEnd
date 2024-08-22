import clienteAxios from "../../config/clienteAxios";

export async function getAll(payload, page, pageSize, config) {
    const data = await clienteAxios.post(`/transaction/getallbyuserid?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function filterTransactions(payload, page, pageSize, config) {
    const data = await clienteAxios.post(`/transaction/filter?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function filterByType(payload, page, pageSize, config) {
    const data = await clienteAxios.post(`/transaction/getbytype?page=${page}&pageSize=${pageSize}`, payload, config);
    return data;
}

export async function newTransaction(payload, config) {
    const data = await clienteAxios.post("/transaction/create", payload, config);
    return data;
}

export async function deleteTransaction(id, config) {
    const data = await clienteAxios.delete(`/transaction/delete/${id}`, config);
    return data;
}

export async function modifyTransaction(id, payload, config) {
    const data = await clienteAxios.put(`/transaction/modify/${id}`, payload, config);
    return data;
}