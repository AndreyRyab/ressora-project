const { login } = require('./controllers/users');

module.exports = async function(req, res) {
  try {
      await login(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
};
