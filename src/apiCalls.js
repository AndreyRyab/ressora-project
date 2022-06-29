import api from './helpers/api';

const apiUser = '/api/user';
const apiSignin = '/api/signin';
const apiLogout = '/api/logout';

export const createNewUser = async (data) => {
  try {
    console.log('apiCalls createNewUser');
    return api(apiUser, 'post', data);
  } catch ({ message }) {
    console.log(message);
  }
};

export const deleteUser = async (data) => {
  try {
    console.log('apiCalls deleteUser');
    return api(apiUser, 'delete', data);
  } catch ({ message }) {
    console.log(message);
  }
};

export const signin = (data) => {
  return api(apiSignin, 'post', data);
};

export const logout = async (data) => {
  return api(apiLogout, 'post', data);
};

export const getAllUsers = async () => {
  return api(apiUser, 'post', null);
};

export const getCurrentUser = (data) => {
  try {
    console.log('apiCall getCurrentUser');
    return api(apiUser, 'post', data);
  } catch ({ message }) {
    console.log(message);
  }
};
