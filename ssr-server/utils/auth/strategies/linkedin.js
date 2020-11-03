const passport = require("passport");
const axios = require("axios");
const boom = require("@hapi/boom");
const { Strategy: LinkedInStrategy } = require("passport-linkedin-oauth2");
const { config } = require("../../../config");

passport.use(
  new LinkedInStrategy(
    {
      clientID: config.linkedinClientId,
      clientSecret: config.linkedinSecret,
      callbackURL: "auth/linkedin/callback",
    },
    async function (token, tokenSecret, profile, done) {
      console.log(profile);
      const { data, status } = await axios({
        url: `${config.apiUrl}/api/auth/sign-provider`,
        method: "post",
        data: {
          name: profile.username,
          email: profile.email,
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
