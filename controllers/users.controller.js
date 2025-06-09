const { selectAllUsers, selectUserById } = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
    selectAllUsers()
        .then((users) => {
            response.status(200).send({ users });
        })
        .catch(next);
};

exports.getUserById = (request, response, next) => {
    const { username } = request.params;

    selectUserById(username)
        .then((user) => {
            response.status(200).send({ user });
        })
        .catch(next);
};
