const { signin } = require('./_controllers/users');

module.exports = async function(req, res) {
  req.body = JSON.stringify(req.body);
  try {
    console.log('signin from signin/api');

    await signin(req, res);
  } catch (error) {
    console.log('error: ', error);
  }
};
