const Movie = require('../models/movie');
const constants = require('../utils/constants');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.status(constants.HTTP_STATUS.OK)
      .json(movies);
  } catch (error) {
    next(error);
  }
};

const postMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const ownerId = req.user._id;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: ownerId,
    });
    res.status(constants.HTTP_STATUS.CREATED)
      .json(movie);
  } catch (error) {
    next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
    }

    if (movie.owner.toString() !== userId) {
      return next({
        status: constants.HTTP_STATUS.NO_ACCESS,
        message: constants.ERROR_MESSAGES.NO_ACCESS,
      });
    }

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (deletedMovie) {
      res.status(constants.HTTP_STATUS.OK)
          .json(deletedMovie);
    } else {
      return next({
        status: constants.HTTP_STATUS.NOT_FOUND,
        message: constants.ERROR_MESSAGES.NOT_FOUND_MESSAGE,
      });
    }
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
