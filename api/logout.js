const { logout } = require('./_controllers/users');

module.exports = async function(req, res) {
  req.body = JSON.stringify(req.body);
  try {
    console.log('logout from logout/api');

    await logout(req, res);
  } catch (error) {
    console.log('error: ', error);
  }
};
