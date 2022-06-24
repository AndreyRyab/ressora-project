const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var cookie = require('cookie');

const User = require('../_models/user');

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  secure: true,
}

exports.findAllUsers = (req, res) => {
  console.log('contr, findAllUsers');
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      res.status(400).send({ message: error.message });
      console.log(error.message);;
    });
};

exports.signin = (req, res) => {
  console.log('signin from controllers');
  req.body = JSON.parse(req.body);
  const { login, password } = req.body;
  console.log('signin: ', { login, password });
  User.findOne({ login })
    .select('+password')
    .then((user) => {
      if (!user) {
        return res.status(404)
          .send({ message: 'Пользователь с таким логином не найден' })
      }
      bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return res
          .status(401)
          .send({ message: 'Неправильные логин или пароль' })
        }
          const token = jwt.sign(
            { _id: user._id },
            process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
            );
            try {
              return res
              .setHeader('Set-Cookie', cookie.serialize('jwt', token, {
                ...cookieOptions,
                maxAge: 3600000 * 24 * 7,
                sameSite: false,
            }))
            .status(200)
            .send({ message: 'С паролем всё ок!' });
          } catch(error) {
            console.log(error.message);
            res.status(500).send({ message: 'Проблема с jwt-токеном'})
          }
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

exports.logout = (req, res) => {
  req.body = JSON.parse(req.body);
  console.log('logout from controllers: ', req.body.userId);
  User.findById({ _id: req.body.userId })
    .then((user) => {
      if (!user) {
        return res.status(404)
          .send({ message: 'Пользователь не найден' })
      }
      try {
        return res
          .setHeader('Set-Cookie', cookie.serialize('jwt', null, {
            maxAge: 0,
            ...cookieOptions,
          }))
          .send({ message: 'Вы успешно разлогинились' })
          .end();
      } catch(error) {
        if (error.name === 'CastError') {
          throw new Error('Переданы некорректные данные');
        }
        console.log(error.message);
        res.status(500).send({ message: 'Проблема с jwt-токеном'})
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

exports.getCurrentUser = (req, res) => {
  req.body = JSON.parse(req.body);
  User.findById({ _id: req.body.userId })
    .then((user) => {
      if (!user) {
        throw new Error('Пользователя с таким id нет в базе');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err.message)
      if (err.name === 'CastError') {
        throw new Error('Переданы некорректные данные');
      }
    })
};

exports.createUser = (req, res) => {
  req.body = JSON.parse(req.body);
  if (!req.body.login || !req.body.name || !req.body.password) {
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
          message: `Пользователь с таким ${
            Object.keys(err.keyValue)[0] === 'name' ? 'именем' : 'логином'
          } уже есть в базе`,
        });
      } else {
        return res.status(500).send({
          message: `Ошибка на сервере: ${err.message}`,
        });
      }
    })
};
