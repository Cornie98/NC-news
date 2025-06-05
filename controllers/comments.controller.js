//const { response } = require("../app");
const { selectCommentsByArticle } = require("../models/comments.model");

exports.getCommentsByArticle = (request, response, next) => {
    const { article_id } = request.params;

    if (isNaN(article_id)) {
        return response.status(400).send({ msg: "Invalid article ID" });
    }
    selectCommentsByArticle(article_id)
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch(next);
};
