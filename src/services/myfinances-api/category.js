import clienteAxios from "../../config/clienteAxios";

export async function getCategories(config) {
    const data = await clienteAxios("/category/getall", config);
    return data;
}