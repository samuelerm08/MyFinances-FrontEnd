import axiosClient from "../../config/AxiosClient";

export async function login(payload) {
    const data = await axiosClient.post("/user/login", payload);
    return data;
}

export async function register(payload) {
    const data = await axiosClient.post("/user/SignUp", payload);
    return data;
}

export async function modifyProfile(userId, payload, config) {
    const data = await axiosClient.put(`/user/modify/${userId}`, payload, config);
    return data;
}

export async function deleteUser(userId, config) {
    console.log(userId);
    const data = await axiosClient.delete(`user/delete/${userId}`, config);
    return data;
}