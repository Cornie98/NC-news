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
const { insertUser } = require("../models/users.model");

exports.postUser = async (request, response, next) => {
    try {
        const { username, name, avatar_url } = request.body;

        if (!username || !name) {
            return response.status(400).send({
                msg: "Missing required fields: 'username' and 'name' are required",
            });
        }

        const defaultAvatarUrl =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Yh-Mv83l7uZQf8wBaKtQw25dsDP1l7WXKw&s";
        const imgUrl = avatar_url || defaultAvatarUrl;

        try {
            const newUser = await insertUser({
                username,
                name,
                avatar_url: imgUrl,
            });
            response.status(201).send({ user: newUser });
        } catch (error) {
            if (error.status === 409) {
                return response.status(409).send({ msg: error.msg });
            }
            throw error;
        }
    } catch (err) {
        next(err);
    }
};

const { updateUser } = require("../models/users.model");

exports.patchUserByUsername = async (request, response, next) => {
    try {
        const { username: originalUsername } = request.params;
        const { username, name, avatar_url } = request.body;

        if (!username || !name || !avatar_url) {
            return Promise.reject({
                status: 400,
                msg: "All fields (username, name, avatar_url) are required for update",
            });
        }

        const updatedUser = await updateUser(originalUsername, {
            username,
            name,
            avatar_url,
        });

        response.status(200).send({ user: updatedUser });
    } catch (err) {
        next(err);
    }
};
