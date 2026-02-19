import axiosInstance from "../axiosInstance";

// Get all products
export const getAllProductsAPI = async () => {
  const response = await axiosInstance.get("/api/get-product");
  return response.data;
};

// Update product
export const updateProductAPI = async (productId, formData) => {
  const response = await axiosInstance.put(
    `/api/update-product/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Delete product
export const deleteProductAPI = async (productId) => {
  const response = await axiosInstance.delete(`/api/delete-product/${productId}`);
  return response.data;
};

export default {
  getAllProductsAPI,
  updateProductAPI,
  deleteProductAPI,
};
