const articlesRouter = require("express").Router();

const {
    getAllArticles,
    getArticleById,
    patchArticleVotes,
    postArticle,
    deleteArticleById,
} = require("../controllers/articles.controller");

const {
    getCommentsByArticle,
    postCommentByArticle,
} = require("../controllers/comments.controller");

const {
    getArticleEmojis,
    postArticleEmoji,
} = require("../controllers/emojis.controller");

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleVotes)
    .delete(deleteArticleById);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticle)
    .post(postCommentByArticle);

articlesRouter
    .route("/:article_id/emojis")
    .get(getArticleEmojis)
    .post(postArticleEmoji);
module.exports = articlesRouter;
