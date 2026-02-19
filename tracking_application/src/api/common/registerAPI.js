import axiosInstance from "../axiosInstance";

const normalizePayload = (payload = {}) => {
  const role = payload.role === "admin" ? "admin" : "customer";

  if (role === "admin") {
    return {
      role,
      endpoint: "/api/register/admin",
      body: {
        name: payload.name || "",
        email: payload.email || "",
        password: payload.password || "",
        admin_secret: payload.admin_secret || payload.adminCode || "",
      },
    };
  }

  return {
    role,
    endpoint: "/api/register/user",
    body: {
      name: payload.name || "",
      email: payload.email || "",
      phone: payload.phone || "",
      password: payload.password || "",
    },
  };
};

export const registerAPI = async (payload) => {
  const { endpoint, role, body } = normalizePayload(payload);
  const response = await axiosInstance.post(endpoint, body);

  return {
    role,
    message: response?.data?.message || "Registered successfully",
    raw: response?.data || null,
  };
};

export default registerAPI;
