import axios from 'axios';

import {
  NOT_FOUND_USER,
  LOGIN_PASSWORD_ERR,
  SERVER_ERR,
  JWT_ERROR,
} from '../errors/errors-constants';

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
  } catch (err) {
    console.log('error message from api: ', err.response.status);
    if (err.response.status === 404) {
      throw new Error(NOT_FOUND_USER);
    } else if (err.response.status === 401) {
      throw new Error(LOGIN_PASSWORD_ERR);
    } else if (err.response.status === 501) {
      throw new Error(JWT_ERROR);
    } throw new Error(SERVER_ERR);
  }
};

export default api;
