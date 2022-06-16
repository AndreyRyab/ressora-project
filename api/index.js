const { findAllUsers, createUser, getCurrentUser } = require('./controllers/users');
const { auth } = require('./utils/authentication');

module.exports = async function(req, res) {
  try {
    /* await auth(req, res); */
    if (req.method === 'GET') {
      const user = await auth(req, res);
      /* await getCurrentUser({ ...req, user }, res); */
      await findAllUsers(req, res);
    } if (req.method === 'POST') {
      await createUser(req, res);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
  
};
