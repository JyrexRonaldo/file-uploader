const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");

// indexRouter.route("/").get(indexController.getHomePage);

indexRouter
  .route("/log-in")
  .get(indexController.getLogInPage)
  .post(indexController.authenticateUser);

indexRouter
  .route("/")
  .get(indexController.getSignUpPage)
  .post(indexController.addNewUser, indexController.authenticateUser);

indexRouter.get("/log-out", indexController.logOutUser);

module.exports = indexRouter;
