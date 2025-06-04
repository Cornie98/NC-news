const request = require("supertest");
const app = require("../app.js");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const devData = require("../db/data/development-data");

beforeEach(() => {
    return seed(devData);
});

afterAll(() => {
    return db.end();
});

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
                expect(typeof body.topics[0].img_url).toBe("string");
            });
    });
});
