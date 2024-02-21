const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /^[\u0400-\u04FF0-9]+$/.test(value);
      },
      message: 'Название фильма на русском должно содержать только кириллические символы и цифры.',
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /^[a-zA-Z0-9]+$/.test(value);
      },
      message: 'Название фильма на английском должно содержать только латинские символы и цифры.',
    },
  },
}, {
  versionKey: false,
});

movieSchema.set('versionKey', false);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
