const { findAllUsers, createUser } = require('./controllers/users');


/* const User = mongoose.model(
  'User',
  userSchema,
  'Users',
); */

/* module.exports = async function(req, res) {
  if (req.method === 'GET') {
    User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => res.status(500).json(error.message));
  }
  if (req.method === 'POST') {
    User.create(req.body)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => res.status(500).json(error.message));
  }
} */

module.exports = async function(req, res) {
  if (req.method === 'GET') {
    try {
      await findAllUsers(req, res);
    } catch (error) {
      console.log(error.message);
    }
  } if (req.method === 'POST') {
    try {
      await createUser(req, res);
    } catch (error) {
      console.log('error: ', error);
    }
  }
};
