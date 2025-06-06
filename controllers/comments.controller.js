//const { response } = require("../app");
const {
    selectCommentsByArticle,
    insertCommentByArticle,
    removeComment,
} = require("../models/comments.model");

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

exports.postCommentByArticle = (request, response, next) => {
    const { article_id } = request.params;
    const newComment = request.body;

    if (isNaN(article_id)) {
        return response.status(400).send({ msg: "Invalid article ID" });
    }

    insertCommentByArticle(article_id, newComment)
        .then((comment) => {
            response.status(201).send({ comment });
        })
        .catch(next);
};

exports.deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params;

    if (isNaN(comment_id)) {
        return response.status(400).send({ msg: "Invalid comment ID" });
    }

    removeComment(comment_id)
        .then(() => {
            response.status(204).send();
        })
        .catch(next);
};
