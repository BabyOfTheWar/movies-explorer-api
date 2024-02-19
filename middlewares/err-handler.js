const constants = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(constants.HTTP_STATUS.BAD_REQUEST).json({ message: 'Неверный запрос' });
  }

  if (err.code === 11000) {
    return res.status(constants.HTTP_STATUS.CONFLICT).json({ message: 'Пользователь с таким email уже существует' });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(constants.HTTP_STATUS.BAD_REQUEST).json({ message: 'Некорректный формат ID' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({ message: 'Некорректный токен' });
  }

  if (err.message === 'Требуется авторизация') {
    return res.status(constants.HTTP_STATUS.UNAUTHORIZED).json({ message: 'Требуется авторизация' });
  }

  if (err.name === 'NotFoundError' || err.code === 404) {
    return res.status(constants.HTTP_STATUS.NOT_FOUND).json({ message: 'Пользователь не найден' });
  }

  if (err.name === 'nameLengthErr') {
    return res.status(constants.HTTP_STATUS.NOT_FOUND).json({ message: 'Некорректная длина поля name' });
  }

  return next(err);
};

module.exports = errorHandler;
