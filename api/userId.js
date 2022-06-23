const { getCurrentUser } = require('./_controllers/users');

module.exports = async function(req, res) {
  if (req.method === 'POST') {
    console.log('getCurrentUser from userId, req.body: ', req.body);
    try {
      /* req.body = JSON.stringify(req.body); */
      await getCurrentUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  }
};
