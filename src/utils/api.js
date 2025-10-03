import axios from 'axios';

 //const base ="http://localhost:5000/api";
const base ="https://backend-tw4p.onrender.com/api";

const api = axios.create({
  baseURL: base,
});

// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem('token');
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
