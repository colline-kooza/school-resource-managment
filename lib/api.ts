import axios from "axios";
import { BASE_URL } from "./globalUrl";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      toast.error("Access denied. Please login to continue.");
    } else if (status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

export default api;
