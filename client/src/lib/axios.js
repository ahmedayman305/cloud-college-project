import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create(
  {
    baseURL: apiUrl,
    withCredentials: true,
  },
  () => {
    console.log(process.env.REACT_APP_API_URL);
  }
);

export default axiosInstance;
