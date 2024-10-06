import axiosClient from "../../config/AxiosClient";

export async function getBalanceByUserId(userId, config) {
    const data = await axiosClient(`/balance/getbyuserid/${userId}`, config);
    return data;
}