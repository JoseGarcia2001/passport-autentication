const passport = require("passport");
const axios = require("axios");
const boom = require("@hapi/boom");
const { get } = require("lodash");
const { Strategy: TwitterStrategy } = require("passport-twitter");

const { config } = require("../../../config");

passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.twitterApiKey,
      consumerSecret: config.twitterSecretKey,
      callbackURL: "/auth/twitter/callback",
      includeEmail: true,
    },
    async function (token, tokenSecret, profile, done) {
      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: "post",
        data: {
          name: profile.displayName,
          email: get(
            profile,
            "emails.0.value",
            `${profile.username}@twitter.com`
          ),
          password: profile.id,
          apiKeyToken: config.apiKeyToken,
        },
      });

      if (!data || status !== 200) {
        return done(boom.unauthorized(), null);
      }

      return done(null, data);
    }
  )
);
