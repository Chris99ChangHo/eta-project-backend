const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const User = require("../models/User"); // User 모델 불러오기
require("dotenv").config();

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/auth/naver/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userData = {
        naverId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      let user = await User.findOne({ email: userData.email });

      if (!user) {
        user = new User(userData);
        await user.save();
      }

      return done(null, user);
    }
  )
);

module.exports = passport;
