import axios from 'axios';

// Backend server manzili (Render Live Production)
const API = axios.create({
  baseURL: 'https://usa-backend-7teh.onrender.com/api',
});

export default API;