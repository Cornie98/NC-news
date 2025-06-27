const usersRouter = require("express").Router();

const {
    getAllUsers,
    getUserById,
    postUser,
    patchUserByUsername,
} = require("../controllers/users.controller");

usersRouter.route("/").get(getAllUsers).post(postUser);
usersRouter.route("/:username").get(getUserById).patch(patchUserByUsername);

module.exports = usersRouter;
