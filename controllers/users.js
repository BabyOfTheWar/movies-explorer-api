const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const constants = require('../utils/constants');

const getUserMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user) {
      res.status(constants.HTTP_STATUS.OK)
        .json(user);
    } else {
      next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  const {
    name,
    email,
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (updatedUser) {
      res.status(constants.HTTP_STATUS.OK)
        .json(updatedUser);
    } else {
      next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
    }
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const {
    name = '',
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const userWithoutPassword = {
      ...user.toObject(),
      password: undefined,
    };

    res.status(constants.HTTP_STATUS.CREATED)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  try {
    const user = await User.findOne({ email })
      .select('+password');

    if (!user) {
      next({
        status: constants.HTTP_STATUS.UNAUTHORIZED,
        message: 'Неправильные почта или пароль',
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        next({
          status: constants.HTTP_STATUS.UNAUTHORIZED,
          message: 'Неправильные почта или пароль',
        });
      } else {
        const secretKey = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';
        const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });

        res.cookie('jwt', token, { httpOnly: true });
        res.status(constants.HTTP_STATUS.OK)
          .send({ token });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  getUserMe,
  createUser,
  signIn,
};
