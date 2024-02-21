const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const {
  celebrate,
  Joi,
} = require('celebrate');
const { errors } = require('celebrate');
const dotenv = require('dotenv');
const {
  signIn,
  createUser,
} = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const errorHandler = require('./middlewares/err-handler');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const constants = require('./utils/constants');
const rateLimiter = require('./middlewares/rate-limiter')

dotenv.config();

const { PORT = 3000, NODE_ENV, ENV_DB_URL } = process.env;
const app = express();

const currentDBUrl = NODE_ENV === 'production' ? ENV_DB_URL : constants.DB_URL;

mongoose.connect(currentDBUrl);

app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

app.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string()
          .required()
          .email(),
        password: Joi.string()
          .required(),
      }),
  }),
  signIn,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string()
          .required(),
        name: Joi.string()
          .min(2)
          .max(30),
      }),
  }),
  createUser,
);

app.use(authMiddleware);

app.use('/', usersRouter);

app.use('/', moviesRouter);

app.use('*', (req, res, next) => {
  next({
    status: constants.HTTP_STATUS.NOT_FOUND,
    message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
  });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
