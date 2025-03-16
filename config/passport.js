const bcrypt = require("bcryptjs");
// const db = require("../db/queries");
const prisma = require("./prisma");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      //   const user = await db.getUserByUserName(username);

      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      // const match = await bcrypt.compare(password, user.password);

      const match = true

      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const user = await db.getUserByUserId(id);

    const user = await prisma.user.findFirst({
      Where: {
        id,
      },
    });

    done(null, user);
  } catch (err) {
    done(err);
  }
});
module.exports = passport;
