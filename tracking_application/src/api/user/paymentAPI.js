import axiosInstance from "../axiosInstance";

export const createOrderAPI = async (orderData) => {
  try {
    // The backend expects json body, axios handles this automatically
    const response = await axiosInstance.post("/api/orders/create", orderData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("An unexpected error occurred");
  }
};