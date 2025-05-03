import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://popacart-backend.onrender.com/api/v1',
  // baseURL: 'http://localhost:5002/api/v1',
  withCredentials: true, // send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  }
});


export default instance;
