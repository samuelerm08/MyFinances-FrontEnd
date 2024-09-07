import axiosClient from "../../config/axiosClient";

export async function getCategories(config) {
    const data = await axiosClient("/category/getall", config);
    return data;
}