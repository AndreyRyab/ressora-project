import api from './helpers/api';

const signinEndPoint = '/api/signin';
const logoutEndPoint = '/api/logout';
const userEndPoint = '/api/user';

export const signin = (data) => {
  return api(signinEndPoint, 'post', data);
};

export const logout = async (data) => {
  return api(logoutEndPoint, 'post', data);
};

export const createNewUser = async (data) => {
  return api(userEndPoint, 'post', data);
};

export const getAllUsers = async () => {
  return api(userEndPoint, 'post', null);
};

export const getCurrentUser = () => {
  return api(userEndPoint, 'post', { getCurrentUser: true });
};

export const deleteUser = async (data) => {
  return api(userEndPoint, 'delete', data);
};
