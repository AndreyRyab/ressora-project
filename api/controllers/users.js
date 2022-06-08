const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.findAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      console.log(error.message);;
    });
};

exports.createUser = (req, res) => {
  if (!req.body.login || !req.body.name || !req.body.password || !req.body.admin) {
    return res.status(400).send({
      message: 'Введите все параметры нового пользователя',
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        login: req.body.login,
        name: req.body.name,
        password: hash,
        admin: req.body.admin,
      })
    )
    .then((user) =>
      res.status(200).send({
        login: user.login,
        name: user.name,
        admin: user.admin,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: `Пользователь с таким ${Object.keys(err.keyValue)[0] === 'name' ? 'именем' : 'логином'} уже есть в базе`,
        });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};
