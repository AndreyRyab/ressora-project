const {
  createUser,
  findAllUsers,
  getCurrentUser,
  deleteUser,
} = require('./_controllers/users');

const { auth } = require('./_utils/authentication');

module.exports = async function(req, res) {
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
      const user = await auth(req, res);
      return findAllUsers({ ...req, user }, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.body.getCurrentUser) {
    try {
      console.log('getCurrentUser from user/api');
      let newReq = { ...req };
      req.body = JSON.stringify(req.body);
      const { _id } = await auth(req, res);
      const updReq = { ...newReq, body: { _id } };
      return getCurrentUser(updReq, res);
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
