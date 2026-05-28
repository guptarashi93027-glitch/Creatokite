const passport = require("passport");

const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

const { User } = require("../models");

passport.use(

  new GoogleStrategy(

    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

      callbackURL:
        "https://creatokite-backend-nw8l.onrender.com/api/auth/google/callback",

      proxy: true,

      state: false,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      try {

        const email =
          profile.emails[0].value;

        let user =
          await User.findOne({ email });

        if (!user) {

          user =
            await User.create({

              displayName:
                profile.displayName,

              email,

              password:
                "googleauth123",

              role:
                "creator",

              provider:
                "google",

              profilePic:
                profile.photos[0].value,
            });
        }

        return done(null, user);

      } catch (error) {

        console.error(error);

        return done(error, null);
      }
    }
  )
);

module.exports = passport;