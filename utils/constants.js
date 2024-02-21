module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NO_ACCESS: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
  },
  ERROR_MESSAGES: {
    INVALID_REQUEST: 'Неверный запрос',
    EMAIL_CONFLICT: 'Пользователь с таким email уже существует',
    INVALID_ID_FORMAT: 'Некорректный формат ID',
    NOT_FOUND_MESSAGE: 'Не найдено',
    NO_ACCESS: 'У вас нет прав на это действие',
  },
  DB_URL: 'mongodb://127.0.0.1:27017/bitfilmsdb',
};
