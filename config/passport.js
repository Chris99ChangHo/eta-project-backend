const passport = require("passport");
const NaverStrategy = require("passport-naver").Strategy;
const User = require("../models/User");
require("dotenv").config();

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/auth/naver/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
          return done(new Error("이메일 정보를 가져올 수 없습니다."));
        }

        let user = await User.findOne({ email });

        if (!user) {
          // 비밀번호 required 방지 위해 기본값 삽입
          const userData = {
            name: profile.displayName || "네이버사용자",
            email,
            naverId: profile.id,
            password: "naver_oauth_placeholder", // 스키마가 필수 요구시 대비
          };

          user = new User(userData);
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 세션 유지를 위한 serialize/deserialize 설정
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
