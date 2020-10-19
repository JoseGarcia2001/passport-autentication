const express = require('express');
const UserMoviesService = require('../services/userMovies');

const validationHandler = require('../utils/middleware/validationHandler');

// const { movieIdSchema } = require('../utils/schemas/movies');
const { userIdSchema } = require('../utils/schemas/users');

function userMoviesApi(app) {
  const router = express.Router()

  app.use('/api/user-movies', router)

  const userMoviesService = new UserMoviesService()

  router.get('/', validationHandler({ userId: userIdSchema }, 'query'),
    async (req, res, next) => {
      const { userId } = req.query

      try {
        const userMovies = await userMoviesService.getUserMovies({ userId })

        res.status(200).json({
          data: userMovies,
          message: 'User movies listed'
        })
      } catch (error) {
        next(error)
      }
  })
};

module.exports = userMoviesApi;