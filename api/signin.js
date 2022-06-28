const { signin } = require('./_controllers/users');

module.exports = function(req, res) {
  req.body = JSON.stringify(req.body);
  try {
    console.log('signin from signin/api');

    /* const result = await  */return signin(req, res);
    /* console.log('result from signin: ', result);
    if (!result) {
      throw new Error('Пользователь с таким логином не найден');
    } */
  } catch ({ message }) {
    console.log('error from signin sf: ', message);
  }
};
