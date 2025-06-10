const { selectAllUsers, selectUserById } = require("../models/users.model");

exports.getAllUsers = async (request, response, next) => {
    try {
        const users = await selectAllUsers();
        response.status(200).send({ users });
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (request, response, next) => {
    const { username } = request.params;

    try {
        const user = await selectUserById(username);
        response.status(200).send({ user });
    } catch (err) {
        next(err);
    }
};
