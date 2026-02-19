import axiosInstance from "../axiosInstance";

export const getAdminOrders = async (adminId) => {
  const response = await axiosInstance.get(`/api/admin/order/${adminId}`);
  return response.data;
};

export const updateOrderStatus = async (adminId, orderId, status) => {
  const response = await axiosInstance.put(`/api/${adminId}/update-status/${orderId}`, {
    status: status,
  });
  return response.data;
};
