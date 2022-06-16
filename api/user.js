const { signin, createUser, getCurrentUser } = require('./controllers/users');

module.exports = async function(req, res) {
  if (req.method === 'GET') {
    if (req.body.userId) {
      try {
        await getCurrentUser(req, res);
      } catch (error) {
        console.log('error: ', error);
      }
    } else {
      try {
          await signin(req, res);
        } catch (error) {
          console.log('error: ', error);
        }
    }
  } else if (req.method === 'POST') {
    await createUser(req, res);
  }
};
