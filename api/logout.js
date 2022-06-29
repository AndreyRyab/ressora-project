const { logout } = require('./_controllers/users');

module.exports = async function(req, res) {
  console.log('logout from logout/api');
  req.body = JSON.stringify(req.body);
  return logout(req, res);
};
