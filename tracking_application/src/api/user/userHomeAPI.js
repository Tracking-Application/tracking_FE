import axiosInstance from "../axiosInstance";

export const getProductsAPI = async () => {
  const response = await axiosInstance.get("/api/get-product");
  return response.data;
};
