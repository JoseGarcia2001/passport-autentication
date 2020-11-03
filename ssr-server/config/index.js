require("dotenv").config();

const config = {
  dev: process.env.NODE_ENV !== "production",
  port: process.env.PORT,
  apiUrl: process.env.API_URL,
  apiKeyToken: process.env.API_KEY_TOKEN,
  adminApiKeyToken: process.env.ADMIN_API_KEY_TOKEN,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  twitterApiKey: process.env.TWITTER_API_KEY,
  twitterSecretKey: process.env.TWITTER_SECRET_KEY,
  sessionSecret: process.env.SESSION_SECRET,
  facebookKey: process.env.FACEBOOK_KEY,
  facebookSecret: process.env.FACEBOOK_SECRET,
};

module.exports = { config };
