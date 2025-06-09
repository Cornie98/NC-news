const {
    selectCommentsByArticle,
    insertCommentByArticle,
    selectCommentById,
    removeComment,
    updateCommentVotes,
} = require("../models/comments.model");

exports.getCommentsByArticle = async (req, res, next) => {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: "Invalid article ID" });
    }

    try {
        const comments = await selectCommentsByArticle(article_id);
        res.status(200).send({ comments });
    } catch (err) {
        next(err);
    }
};

exports.postCommentByArticle = async (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;

    if (isNaN(article_id)) {
        return res.status(400).send({ msg: "Invalid article ID" });
    }

    try {
        const comment = await insertCommentByArticle(article_id, newComment);
        res.status(201).send({ comment });
    } catch (err) {
        next(err);
    }
};

exports.getCommentById = async (req, res, next) => {
    const { comment_id } = req.params;

    if (isNaN(comment_id)) {
        return res.status(400).send({ msg: "Invalid comment ID" });
    }

    try {
        const comment = await selectCommentById(comment_id);
        res.status(200).send({ comment });
    } catch (err) {
        next(err);
    }
};

exports.deleteCommentById = async (req, res, next) => {
    const { comment_id } = req.params;

    if (isNaN(comment_id)) {
        return res.status(400).send({ msg: "Invalid comment ID" });
    }

    try {
        await removeComment(comment_id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

exports.patchCommentById = async (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    if (isNaN(comment_id)) {
        return res.status(400).send({ msg: "Invalid comment ID" });
    }
    if (typeof inc_votes !== "number") {
        return res.status(400).send({ msg: "Invalid vote input" });
    }

    try {
        const comment = await updateCommentVotes(comment_id, inc_votes);
        res.status(200).send({ comment });
    } catch (err) {
        next(err);
    }
};
