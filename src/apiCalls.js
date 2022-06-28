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

export const signin = async (data) => {
  try {
    console.log('apiCalls signin');
    /* const result = */ return api(apiSignin, 'post', data);
    /* console.log('apiCalls signin result: ', result);
    return result; */
  } catch ({ message }) {
    console.log(message);
    /* throw new Error('Error from apiCalls signin'); */
  }
};

export const logout = async (data) => {
  try {
    console.log('apiCalls logout');
    return api(apiLogout, 'post', data);
  } catch ({ message }) {
    console.log(message);
  }
};

export const getAllUsers = async () => {
  try {
    console.log('apiCall getAllUsers');
    return api(apiUser, 'post', null);
  } catch ({ message }) {
    console.log(message);
  }
};

export const getCurrentUser = (data) => {
  try {
    console.log('apiCall getCurrentUser');
    return api(apiUser, 'post', data);
  } catch ({ message }) {
    console.log(message);
  }
};
