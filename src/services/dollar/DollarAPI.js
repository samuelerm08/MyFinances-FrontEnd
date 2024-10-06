import axiosClient from "../../config/AxiosClient";

export async function getDollarExchangeRate() {
    const data = await axiosClient("https://api.bluelytics.com.ar/v2/latest");
    return data;
}