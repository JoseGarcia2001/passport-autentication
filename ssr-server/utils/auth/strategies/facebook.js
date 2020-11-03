const passport = require("passport");
const { Strategy: FacebookStrategy } = require("passport-facebook");
const axios = require("axios");
const boom = require("@hapi/boom");

const { config } = require("../../../config");

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookKey,
      clientSecret: config.facebookSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async function (accesToken, refreshToken, profile, done) {
      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: "post",
        data: {
          name: profile.displayName,
          email: profile.emails[0].value,
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
