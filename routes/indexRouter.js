const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

indexRouter.route("/").get(indexController.getHomePage);

indexRouter
  .route("/log-in")
  .get(indexController.getLogInPage)
  .post(indexController.authenticateuser);

indexRouter
  .route("/sign-up")
  .get(indexController.getSignUpPage)
  .post(indexController.addNewUser, indexController.authenticateuser);

module.exports = indexRouter;
