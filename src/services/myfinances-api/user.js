import clienteAxios from "../../config/clienteAxios";

export async function login(payload) {
    const data = await clienteAxios.post("/user/login", payload);
    return data;
}

export async function register(payload) {
    const data = await clienteAxios.post("/user/signup", payload);
    return data;
}

export async function modifyProfile(userId, payload, config) {
    const data = await clienteAxios.put(`/user/modify/${userId}`, payload, config);
    return data;
}

export async function deleteUser(userId, config) {
    console.log(userId);
    const data = await clienteAxios.delete(`user/delete/${userId}`, config);
    return data;
}