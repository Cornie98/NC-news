//const { response, request } = require("../app");
const {
    selectAllArticles,
    selectArticlesById,
    updateArticleVotes,
} = require("../models/articles.model");

exports.getAllArticles = (request, response, next) => {
    selectAllArticles().then((articles) => {
        response.status(200).send({ articles });
    });
};
exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;

    if (isNaN(article_id)) {
        return response.status(400).send({ msg: "Invalid article ID" });
    }

    selectArticlesById(article_id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch(next);
};
exports.patchArticleVotes = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;

    if (isNaN(article_id)) {
        return response.status(400).send({ msg: "Invalid article ID" });
    }
    if (typeof inc_votes !== "number") {
        return response.status(400).send({ msg: "Invalid vote input" });
    }
    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            response.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};
