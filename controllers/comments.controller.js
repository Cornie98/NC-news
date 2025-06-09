//const { response } = require("../app");
const {
    selectCommentsByArticle,
    insertCommentByArticle,
    selectCommentById,
    removeComment,
    updateCommentVotes,
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
exports.getCommentById = (request, response, next) => {
    const { comment_id } = request.params;

    if (isNaN(comment_id)) {
        return response.status(400).send({ msg: "Invalid comment ID" });
    }

    selectCommentById(comment_id)
        .then((comment) => {
            return response.status(200).send({ comment });
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

exports.patchCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    const { inc_votes } = request.body;

    if (isNaN(comment_id)) {
        return response.status(400).send({ msg: "Invalid comment ID" });
    }
    if (typeof inc_votes !== "number") {
        return response.status(400).send({ msg: "Invalid vote input" });
    }

    updateCommentVotes(comment_id, inc_votes)
        .then((comment) => {
            response.status(200).send({ comment });
        })
        .catch(next);
};
