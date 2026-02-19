import axiosInstance from "../axiosInstance";

const normalizeRole = (rawRole) => {
  const value = String(rawRole || "customer").toLowerCase();

  if (value.includes("admin")) return "admin";
  if (value.includes("customer") || value.includes("user")) return "customer";
  return "customer";
};

export const loginAPI = async (payload) => {
  const response = await axiosInstance.post("/api/login", {
    email: payload.email,
    password: payload.password,
  });

  return {
    message: response?.data?.message || "Login successful",
    userId:
      response?.data?.user_id ||
      response?.data?.userId ||
      response?.data?.id ||
      (response?.data?.user && response.data.user.id) ||
      null,
    name: response?.data?.name || "",
    role: normalizeRole(response?.data?.role),
    raw: response?.data || null,
  };
};

export default loginAPI;
