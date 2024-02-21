const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next({ status: 401, message: 'Требуется авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  const secretKey = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    return next();
  } catch (error) {
    return next({ status: 401, message: 'Требуется авторизация' });
  }
};
