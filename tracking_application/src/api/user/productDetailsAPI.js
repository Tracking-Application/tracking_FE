import axiosInstance from "../axiosInstance";

export const getProductDetailsAPI = async (productId) => {
  const response = await axiosInstance.get(`/api/product/${productId}`);
  return response.data;
};
