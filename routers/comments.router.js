const commentsRouter = require("express").Router();

const {
    getCommentById,
    deleteCommentById,
    patchCommentById,
} = require("../controllers/comments.controller");

commentsRouter
    .route("/:comment_id")
    .get(getCommentById)
    .delete(deleteCommentById)
    .patch(patchCommentById);

module.exports = commentsRouter;
