import axios from 'axios';

const api = async (url, method = 'post', data = {}) => {
  try {
    const res = await axios.request({
      url,
      method,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
    return res;
  } catch ({ message }) {
    throw new Error(message);
  }
};

export default api;
