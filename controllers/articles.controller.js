const {
    selectAllArticles,
    selectArticleById,
    updateArticleVotes,
    insertArticle,
} = require("../models/articles.model");

exports.getAllArticles = async (request, response, next) => {
    try {
        const { sort_by = "created_at", order = "DESC", topic } = request.query;
        const articles = await selectAllArticles(
            sort_by,
            order.toUpperCase(),
            topic
        );
        response.status(200).send({ articles });
    } catch (err) {
        next(err);
    }
};

exports.getArticleById = async (request, response, next) => {
    try {
        const { article_id } = request.params;

        if (isNaN(article_id)) {
            return response.status(400).send({ msg: "Invalid article ID" });
        }

        const article = await selectArticleById(article_id);
        response.status(200).send({ article });
    } catch (err) {
        next(err);
    }
};

exports.patchArticleVotes = async (request, response, next) => {
    try {
        const { article_id } = request.params;
        const { inc_votes } = request.body;

        if (isNaN(article_id)) {
            return response.status(400).send({ msg: "Invalid article ID" });
        }

        if (inc_votes === undefined) {
            const article = await selectArticleById(article_id);
            return response.status(200).send({ article });
        }

        if (typeof inc_votes !== "number") {
            return response.status(400).send({ msg: "Invalid vote input" });
        }

        const updatedArticle = await updateArticleVotes(article_id, inc_votes);
        response.status(200).send({ article: updatedArticle });
    } catch (err) {
        next(err);
    }
};

exports.postArticle = async (request, response, next) => {
    try {
        const {
            author,
            title,
            body,
            topic,
            article_img_url,
            topic_description,
        } = request.body;

        if (!author || !title || !body || !topic) {
            return Promise.reject({
                status: 400,
                msg: "Missing one or more required fields",
            });
        }

        const defaultImageUrl =
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";
        const imgUrl = article_img_url || defaultImageUrl;

        const insertedArticle = await insertArticle({
            author,
            title,
            body,
            topic,
            article_img_url: imgUrl,
            topic_description,
        });

        const newArticle = await selectArticleById(insertedArticle.article_id);

        response.status(201).send({ article: newArticle });
    } catch (err) {
        next(err);
    }
};
