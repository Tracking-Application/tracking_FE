import axiosInstance from "../axiosInstance";

export const fetchMyOrders = async (userId) => {
  const response = await axiosInstance.get(`/api/my-orders/${userId}`);
  return response.data;
};
