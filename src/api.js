import axios from 'axios';

// Backend server manzili
const API = axios.create({
  baseURL: 'http://192.168.1.51:5000/api',
});

export default API;