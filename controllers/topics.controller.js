const { selectAllTopics } = require("../models/topics.model");

exports.getAllTopics = async (request, response, next) => {
    try {
        const topics = await selectAllTopics();
        response.status(200).send({ topics });
    } catch (err) {
        next(err);
    }
};
