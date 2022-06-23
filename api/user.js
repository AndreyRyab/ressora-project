const {
  createUser,
  findAllUsers,
  getCurrentUser,
  signin,
} = require('./_controllers/users');

module.exports = async function(req, res) {
  if (!req.body) {
    try {
      console.log('getAllUsers from user/api');
      
      await findAllUsers(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.body.signin) {
    try {
      console.log('signin from user/api');

      req.body = JSON.stringify(req.body);
      await signin(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.body.userId) {
    try {
      console.log('getCurrentUser from user/api');
      
      req.body = JSON.stringify(req.body);
      await getCurrentUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  } else if (req.body.name) {
    console.log('createUser from user/api');
    try {
      req.body = JSON.stringify(req.body);
      await createUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  }
};
