const {
  createUser,
  findAllUsers,
  getCurrentUser,
  deleteUser,
} = require('./_controllers/users');

module.exports = function(req, res) {
  if (req.method === 'DELETE') {
    try {
      console.log('deleteUser from user/api');

      req.body = JSON.stringify(req.body);
      return deleteUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  }
  if (!req.body) {
    try {
      console.log('getAllUsers from user/api');
      
      return findAllUsers(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.body.userId) {
    try {
      console.log('getCurrentUser from user/api');

      req.body = JSON.stringify(req.body);
      return getCurrentUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.body.name) {
    console.log('createUser from user/api');
    try {
      req.body = JSON.stringify(req.body);
      return createUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  }
};
