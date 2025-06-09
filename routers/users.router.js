const usersRouter = require("express").Router();

const { getAllUsers, getUserById } = require("../controllers/users.controller");

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:username").get(getUserById);

module.exports = usersRouter;
