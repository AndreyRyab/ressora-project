import axios from 'axios';

const api = (url, method = 'post', data = {}) => {
  return axios.request({
    url,
    method,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  });
};

export default api;
