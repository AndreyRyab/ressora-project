const { signin, createUser, getCurrentUser, findAllUsers } = require('./_controllers/users');

module.exports = async function(req, res) {
  if (req.method === 'GET') {
    console.log('getAllUsers from user/api');
    try {
      await findAllUsers(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.method === 'POST') {
    console.log('createUser from user/api');
    try {
      req.body = JSON.stringify(req.body);
      await createUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  }
};
