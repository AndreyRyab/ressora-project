const NOT_FOUND_USER = 'Пользователь не найден';
const NOT_FOUND = 'Ресурс не найден';
const LOGIN_PASSWORD_ERR = 'Неправильные логин или пароль';
const SERVER_ERR = 'На сервере произошла ошибка';
const JWT_ERROR = 'Проблема с jwt-токеном';
const AUTH_ERROR = 'Необходима авторизация';
const CONFLICT_ERROR = 'Пользователь с такими параметрами уже есть в базе данных';
const BAD_REQUEST = 'Переданы некорректные или неполные данные';
const REMOVAL_FAILED = 'Не смогли удалить пользователя, попробуйте ещё раз.';

const SUCCESS_PASSWORD = 'Пароль подтверждён!';
const SUCCESS_LOGOUT = 'Вы успешно разлогинились';

module.exports = {
  NOT_FOUND_USER,
  NOT_FOUND,
  LOGIN_PASSWORD_ERR,
  SERVER_ERR,
  JWT_ERROR,
  SUCCESS_PASSWORD,
  AUTH_ERROR,
  CONFLICT_ERROR,
  BAD_REQUEST,
  SUCCESS_LOGOUT,
  REMOVAL_FAILED,
}
