import axiosInstance from "../axiosInstance";

const addProductAPI = async (formData) => {
  // Note: We don't set Content-Type here because axios
  // automatically sets it to multipart/form-data when it sees FormData
  const response = await axiosInstance.post("/api/add-product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default addProductAPI;
