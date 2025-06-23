const articlesRouter = require("express").Router();

const {
    getAllArticles,
    getArticleById,
    patchArticleVotes,
    postArticle,
} = require("../controllers/articles.controller");

const {
    getCommentsByArticle,
    postCommentByArticle,
} = require("../controllers/comments.controller");

const { postArticleEmoji } = require("../controllers/emojis.controller");

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleVotes);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticle)
    .post(postCommentByArticle);

articlesRouter.route("/:article_id/emojis").post(postArticleEmoji);
module.exports = articlesRouter;
