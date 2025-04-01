const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const NaverStrategy = require("passport-naver").Strategy;
const User = require("../models/User");

// Google OAuth 설정
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = new User({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value });
    await user.save();
  }
  return done(null, user);
}));

// Naver OAuth 설정
passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: "/auth/naver/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ naverId: profile.id });
  if (!user) {
    user = new User({ naverId: profile.id, name: profile.displayName, email: profile.emails[0].value });
    await user.save();
  }
  return done(null, user);
}));

module.exports = passport;
