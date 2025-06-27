const usersRouter = require("express").Router();

const {
    getAllUsers,
    getUserById,
    postUser,
    patchUserByUsername,
} = require("../controllers/users.controller");

usersRouter.route("/").get(getAllUsers, postUser);
usersRouter.route("/:username").get(getUserById, patchUserByUsername);

module.exports = usersRouter;
