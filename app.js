require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./config/prisma");
const indexRouter = require("./routes/indexRouter")

const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 24 * 60 * 60 * 1000, // 1 day
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

const assetsPath = path.join(__dirname, "public");
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app running at port: ${PORT}`);
});
