import axios from 'axios';

// In production (GitHub Pages), REACT_APP_API_BASE_URL is your Render backend URL.
// In development, it's empty so the CRA proxy (localhost:5000) kicks in.
if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
}

export default axios;
