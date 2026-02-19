import axiosInstance from "../axiosInstance";

export const getTotalOrdersAPI = async (adminId) => {
  const response = await axiosInstance.get(`/api/total_order/${adminId}`);
  return response.data;
};

export const getTotalDeliveredOrdersAPI = async () => {
  const response = await axiosInstance.get("/api/total/delivered");
  return response.data;
};

export const getTotalPendingOrdersAPI = async () => {
  const response = await axiosInstance.get("/api/total/pending");
  return response.data;
};

export const getTotalShippingOrdersAPI = async () => {
  const response = await axiosInstance.get("/api/total/shipping");
  return response.data;
};

export default {
  getTotalOrdersAPI,
  getTotalDeliveredOrdersAPI,
  getTotalPendingOrdersAPI,
  getTotalShippingOrdersAPI,
};
