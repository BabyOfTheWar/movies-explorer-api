const express = require('express');

const router = express.Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const authMiddleware = require('../middlewares/auth');

const {
  getUserMe,
  updateProfile,
} = require('../controllers/users');

router.get('/users/me', authMiddleware, getUserMe);

router.patch('/users/me', authMiddleware, celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      email: Joi.string()
        .min(2)
        .email(),
    }),
}), updateProfile);

module.exports = router;
