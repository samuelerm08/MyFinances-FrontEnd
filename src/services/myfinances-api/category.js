import axiosClient from "../../config/AxiosClient";

export async function getCategories(config) {
    const data = await axiosClient("/category/getall", config);
    return data;
}