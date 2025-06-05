//const { response, request } = require("../app");
const {
    selectAllArticles,
    selectArticlesById,
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
