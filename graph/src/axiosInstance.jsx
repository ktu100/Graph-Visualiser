import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://graph-visualiser-fullbackend.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
