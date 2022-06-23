import axios from 'axios';

const apiUser = '/api/user';

export const createNewUser = async (data) => {
  try {
    const res = await axios.request({
      url: apiUser,
      method: 'post',
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

export const getCurrentUser = async (data) => {
  try {
    const res = await axios.request({
      url: apiUser,
      method: 'post',
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
}

export const signin = async (data) => {
  try {
    const res = await axios.request({
      url: apiUser,
      method: 'post',
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
}


export const getAllUsers = async () => {
  try {
    const res = await axios.request({
      url: apiUser,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    });
    return res;
  } catch ({ message }) {
    throw new Error(message);
  }
}

export const handleFetch = async (data = {}) => {
  
}

/* export const getCurrentUser = async (data) => {
  console.log('getCurrentUser in apiCalls, data: ', data);
  try {
    const res = await fetch(apiUserId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch ({ message }) {
    throw new Error(message);
  }
} */

/* export const createNewUser = async (data) => {
  try {
    const res = await fetch(apiUser, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  } catch ({ message }) {
    throw new Error(message);
  }
} */

/* export const getAllUsers = async () => {
  try {
    const res = await fetch(apiUser, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  } catch ({ message }) {
    throw new Error(message);
  }
} */
