const api = '/api/user';

export const createNewUser = async (form) => {
  try {
    const res = await fetch(api, {
      body: JSON.stringify(form),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  } catch ({ message }) {
    errorMessage = message;
  }
}

export const getAllUsers = async (form) => {
  try {
    const res = await fetch(api, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.json();
  } catch ({ message }) {
    errorMessage = message;
  }
}
