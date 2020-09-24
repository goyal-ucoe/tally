
exports.GOOGLE_CONFIG = {
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
  };
  
exports.FACEBOOK_CONFIG = {
    clientID: process.env.F_APP_ID,
    clientSecret: process.env.F_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["id", "displayName", "photos", "email"],
  };