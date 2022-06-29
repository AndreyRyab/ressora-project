const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret' } = process.env;

module.exports.auth = (req, res) => {
  if (!req.cookies.jwt) {
    throw new Error(`Необходима авторизация cookies.jwt: ${req.cookies.jwt}`);
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log('auth ok, payload: ', payload);
  } catch (err) {
    throw new Error(`Необходима авторизация cookies.jwt: ${req.cookies.jwt}`);
  }
  return payload;
};
