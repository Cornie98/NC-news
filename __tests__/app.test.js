const request = require("supertest");
const app = require("../app.js");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

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

    test("200: articles are sorted by created_at in descending order", () => {
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
    test("200: articles are sorted by votes ascending ", () => {
        return request(app)
            .get("/api/articles?sort_by=votes&order=ASC")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    const current = articles[i].votes;
                    const next = articles[i + 1].votes;
                    expect(current).toBeLessThanOrEqual(next);
                }
            });
    });
    test("200: articles are sorted by comment count descending ", () => {
        return request(app)
            .get("/api/articles?sort_by=comment_count&order=DESC")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    const current = articles[i].comment_count;
                    const next = articles[i + 1].comment_count;
                    expect(current).toBeGreaterThanOrEqual(next);
                }
            });
    });
    test("400: responds with invalid query if invalid sort_by", () => {
        return request(app)
            .get("/api/articles?sort_by=char_count&order=DESC")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid query");
            });
    });
    test("400: responds with invalid query if invalid order", () => {
        return request(app)
            .get("/api/articles?sort_by=title&order=cat")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid query");
            });
    });
    test("200: responds with the articles filtered by topic", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                articles.forEach((article) => {
                    expect(article.topic).toBe("cats");
                });
            });
    });
    test("404: responds error msg topic not found", () => {
        return request(app)
            .get("/api/articles?topic=plants")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Topic not found");
            });
    });
});
describe("GET /api/users", () => {
    test("200: responds with an array of user objects", () => {
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
                    comment_count,
                } = article;

                expect(article_id).toBe(1);
                expect(typeof title).toBe("string");
                expect(typeof topic).toBe("string");
                expect(typeof author).toBe("string");
                expect(typeof body).toBe("string");
                expect(typeof created_at).toBe("string");
                expect(typeof votes).toBe("number");
                expect(typeof article_img_url).toBe("string");
                expect(typeof comment_count).toBe("number");
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
});
describe("GET/api/articles/:article_id/comments", () => {
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
    test("200: returns empty array when article exists but has no comments", () => {
        return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.comments)).toBe(true);
                expect(body.comments.length).toBe(0);
            });
    });
});
describe("POST /api/articles/:article_id/comments", () => {
    test("201: responds with the posted comment", () => {
        const newComment = {
            username: "lurker",
            body: "i am commenting on this article...",
        };

        return request(app)
            .post("/api/articles/3/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(typeof body.comment.comment_id).toBe("number");
                expect(body.comment.article_id).toBe(3);
                expect(typeof body.comment.body).toBe("string");
                expect(typeof body.comment.votes).toBe("number");
            });
    });
});
describe("PATCH /api/articles/:article_id", () => {
    test("200: responds with an updated article", () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                const article = body.article;
                expect(article.article_id).toBe(3);
                expect(typeof article.votes).toBe("number");
                expect(article.votes).toBe(1);
            });
    });
    test("404: responds with error if article doesn't exist", () => {
        return request(app)
            .patch("/api/articles/1234")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
    test("400: responds with error if invalid vote", () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: "cats" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid vote input");
            });
    });
});
describe("DELETE /api/comments/:comment_id", () => {
    test("204: responds with no content ", () => {
        return request(app)
            .delete("/api/comments/2")
            .expect(204)
            .then(({ body }) => {
                console.log(body.msg);
            });
    });
    test("404: comment not found", () => {
        return request(app)
            .delete("/api/comments/1000")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found");
            });
    });
    test("400: Invalid comment ID", () => {
        return request(app)
            .delete("/api/comments/peanut")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid comment ID");
            });
    });
});
describe("GET /api/users/:user_id", () => {
    test("200: responds with user", () => {
        return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
                const user = body.user;
                expect(user.username).toBe("butter_bridge");
                expect(typeof user.name).toBe("string");
                expect(typeof user.avatar_url).toBe("string");
            });
    });
    test("404: user not found", () => {
        return request(app)
            .get("/api/users/cornlover")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found");
            });
    });
});
describe("PATCH /api/comments/:comment_id", () => {
    test("200: responds with comment with vote appended", () => {
        return request(app)
            .get("/api/comments/5")
            .then(({ body }) => {
                const originalVotes = body.comment.votes;
                return request(app)
                    .patch("/api/comments/5")
                    .send({ inc_votes: 1 })
                    .expect(200)
                    .then(({ body }) => {
                        const comment = body.comment;
                        expect(comment.comment_id).toBe(5);
                        expect(typeof comment.votes).toBe("number");
                        expect(comment.votes).toBe(originalVotes + 1);
                    });
            });
    });

    test("200: responds with comment with vote appended", () => {
        return request(app)
            .get("/api/comments/1")
            .then(({ body }) => {
                const originalVotes = body.comment.votes;
                return request(app)
                    .patch("/api/comments/1")
                    .send({ inc_votes: -1 })
                    .expect(200)
                    .then(({ body }) => {
                        const comment = body.comment;
                        expect(comment.comment_id).toBe(1);
                        expect(typeof comment.votes).toBe("number");
                        expect(comment.votes).toBe(originalVotes - 1);
                    });
            });
    });

    test("400: responds with error invalid comment id", () => {
        return request(app)
            .patch("/api/comments/cat")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid comment ID");
            });
    });
    test("400: responds with error invalid vote input", () => {
        return request(app)
            .patch("/api/comments/5")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid vote input");
            });
    });
    test("404: responds with comment not found", () => {
        return request(app)
            .patch("/api/comments/500")
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found");
            });
    });
});
describe("POST /api/articles", () => {
    test("201: responds with new article data", () => {
        const newArticle = {
            author: "rogersop",
            title: "New Article Title",
            body: "This is the body of the new article.",
            topic: "paper",
            article_img_url: "https://example.com/cat.jpg",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                const article = body.article;
                expect(article.author).toBe(newArticle.author);
                expect(article.title).toBe(newArticle.title);
                expect(article.body).toBe(newArticle.body);
                expect(article.topic).toBe(newArticle.topic);
                expect(article.article_img_url).toBe(
                    newArticle.article_img_url
                );
                expect(article.votes).toBe(0);
                expect(article).toHaveProperty("created_at");
                expect(article.comment_count).toBe(0);
            });
    });
});
describe("DELETE /api/articles/articleId", () => {
    test("201: responds with new article data", () => {
        return request(app)
            .delete("/api/articles/3")
            .expect(204)
            .then(({ body }) => {
                console.log(body.msg);
            });
    });
});
