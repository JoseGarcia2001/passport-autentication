const express = require('express');
const UserMoviesService = require('../services/userMovies');

const validationHandler = require('../utils/middleware/validationHandler');
const { createUserMovieSchema } = require('../utils/schemas/userMovies');
const { userIdSchema } = require('../utils/schemas/users');
const { movieIdSchema } = require('../utils/schemas/movies');

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

  router.post('/', validationHandler(createUserMovieSchema), async (req, res, next) => {
    const { body: userMovie } = req;

    try {
      const createdMovieId = await userMoviesService.createUserMovie({ userMovie })

      res.status(201).json({
        data: createdMovieId,
        message: 'User movie created'
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:userMovieId', validationHandler({ userMovieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      const { userMovieId } = req.params

      try {
        const deletedUserMovieId = await userMoviesService.deleteUserMovie({ userMovieId })

        res.status(200).json({
          data: deletedUserMovieId,
          message: 'User movie deleted'
        })
      } catch (error) {
        next(error)
      }
    }
  )
};


module.exports = userMoviesApi;