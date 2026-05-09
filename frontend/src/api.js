// Central API base — reads from env var in production (Render), falls back to '' (CRA proxy) in dev
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

export default api;
