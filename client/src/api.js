import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const registerUser = async (email, password, fullName, role) => {
  return axios.post(`${API_BASE}/auth/register`, { email, password, fullName, role });
};

export const loginUser = async (email, password, role) => {
  return axios.post(`${API_BASE}/auth/login`, { email, password, role });
};

export const bookRide = async (user_id, pickup, dropoff, fare) => {
  return axios.post(`${API_BASE}/rides/book`, { user_id, pickup, dropoff, fare });
};

export const getRideHistory = async (user_id) => {
  return axios.get(`${API_BASE}/rides/history`, { params: { user_id } });
};
