const mongoose = require('mongoose');

const clientPromise = require('./mongodb-client');

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
  },
  password: String,
  admin: Boolean,
})

const User = mongoose.model(
  'User',
  userSchema,
  'Users',
);

/* mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, 
  function(error) {
    if (error) {
      console.log("Error!" + error);
    } else {
      console.log("Mongo connected");
    };
  }
); */

module.exports = async function(req, res) {
  const client = await clientPromise;

  const connection = mongoose.createConnection().setClient(client);

  if (connection.readyState === 1) {
    console.log('Mongo reusable connection is opened');
  }

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
}
