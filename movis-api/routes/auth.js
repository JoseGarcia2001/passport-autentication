const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');

const { config } = require('../config');
const UsersService = require('../services/users');

//Basic Strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeyService = new ApiKeysService();
  const usersService = new UsersService();

  router.post('/sign-in/test', async (req, res, next) => {
    const { apiKeyToken } = req.body;

    try {
      const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });
      const user = await usersService.getUser({ email: 'root@undefined.sh' });

      res.status(200).json({
        apiKeyToken: apiKeyToken,
        apiKey: apiKey,
        user: user,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/sign-in', async function (req, res, next) {
    const { apiKeyToken } = req.body;

    if (!apiKeyToken) {
      next(boom.unauthorized('apiKeyToken is required'));
    }

    passport.authenticate('basic', function (error, user) {
      try {
        if (error || !user) {
          next(boom.unauthorized('not user or error'));
        }

        req.login(user, { session: false }, async function (error) {
          if (error) {
            next(error);
          }
          const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

          if (!apiKey) {
            next(boom.unauthorized('no apiKey'));
          }

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes,
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m',
          });

          return res.status(200).json({ token, user: { id, name, email } });
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });
}

module.exports = authApi;
