const { signin } = require('./_controllers/users');

module.exports = function(req, res) {
  console.log('signin from signin/api');
  req.body = JSON.stringify(req.body);
  return signin(req, res);
};
