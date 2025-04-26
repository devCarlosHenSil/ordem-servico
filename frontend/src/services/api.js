import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // porta onde o servidor Express está rodando
});

export default api;
