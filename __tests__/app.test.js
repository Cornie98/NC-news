const request = require("supertest");
const app = require("../app.js");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body: { endpoints } }) => {
                expect(endpoints).toEqual(endpointsJson);
            });
    });
});
describe("GET /api/topics", () => {
    test("200: responds with an array of topic objects", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.topics)).toBe(true);
                expect(body.topics.length).toBe(3);
                expect(typeof body.topics[0].description).toBe("string");
                expect(typeof body.topics[0].slug).toBe("string");
            });
    });
});
describe("GET /api/articles", () => {
    test("200: responds with an array of article objects with expected properties", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;

                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBeGreaterThan(0);

                articles.forEach((article) => {
                    expect(article).toHaveProperty("author");
                    expect(article).toHaveProperty("title");
                    expect(article).toHaveProperty("article_id");
                    expect(article).toHaveProperty("topic");
                    expect(article).toHaveProperty("created_at");
                    expect(article).toHaveProperty("votes");
                    expect(article).toHaveProperty("article_img_url");
                    expect(article).toHaveProperty("comment_count");

                    expect(typeof article.author).toBe("string");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.topic).toBe("string");
                    expect(new Date(article.created_at)).not.toBe(
                        "Invalid Date"
                    );
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                    expect(!isNaN(Number(article.comment_count))).toBe(true);
                });
            });
    });

    test("articles are sorted by created_at in descending order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    const current = new Date(articles[i].created_at).getTime();
                    const next = new Date(articles[i + 1].created_at).getTime();
                    expect(current).toBeGreaterThanOrEqual(next);
                }
            });
    });
});
describe("GET /api/users", () => {
    test("200: responds with an array of topic objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.users)).toBe(true);
                expect(body.users.length).toBe(4);
                expect(typeof body.users[0].username).toBe("string");
                expect(typeof body.users[0].name).toBe("string");
                expect(typeof body.users[0].avatar_url).toBe("string");
            });
    });
});
describe("GET /api/articles/:article_id", () => {
    test("200: responds with the article data of of article id", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: result }) => {
                const { article } = result;
                const {
                    article_id,
                    title,
                    topic,
                    author,
                    body,
                    created_at,
                    votes,
                    article_img_url,
                } = article;

                expect(article_id).toBe(1);
                expect(typeof title).toBe("string");
                expect(typeof topic).toBe("string");
                expect(typeof author).toBe("string");
                expect(typeof body).toBe("string");
                expect(typeof created_at).toBe("string");
                expect(typeof votes).toBe("number");
                expect(typeof article_img_url).toBe("string");
            });
    });
    test("404: article doesn't exist", () => {
        return request(app)
            .get("/api/articles/1000")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
    test("400: invalid article id", () => {
        return request(app)
            .get("/api/articles/a")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid article ID");
            });
    });

    describe("Get /api/articles/:article_id/comments", () => {
        test("200:returns with comment data from, an article id", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.comments.length).toBe(11);
                    body.comments.forEach((comment) => {
                        expect(typeof comment.votes).toBe("number");
                        expect(typeof comment.author).toBe("string");
                        expect(typeof comment.body).toBe("string");
                    });
                });
        });
        test("404: article doesn't exist", () => {
            return request(app)
                .get("/api/articles/1000/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Article not found");
                });
        });
    });
});
