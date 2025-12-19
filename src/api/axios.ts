import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://daniyaalbackend-env.eba-ip8muxxp.us-east-1.elasticbeanstalk.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
