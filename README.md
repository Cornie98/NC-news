# 📰 NC News API

_An API for a news website inspired by Reddit built with Node.js, Express and PostgreSQL._

A link to the hosted version can be found [here](https://nc-news-api-jqsh.onrender.com/api)

---

## Project Summary

This is a RESTful API which powers a news app where users can:

- View articles by topic through GET requests
- Post comments under articles with POST requests
- Up/down vote articles using a PATCH request
- Sort articles by date, topic or comment count through queries

The project was built as part of the Northcoders bootcamp to demonstrate the use of Express and PostgreSQL, including RESTful design and testing with Jest and Supertest.

## How to setup locally

### Package versions

- **Node.js** `v20.11.1` (or later)
- **PostgreSQL** `v15.0` (or later)

### Cloning & installing

In the terminal:

```bash
git clone https://github.com/Cornie98/NC-news
cd NC-news
npm install
```

### Seeding

#### Environment Setup

`.env.*` files are ignored by Git so create them yourself to run the project locally.

#### What to do:

1. Create two files in the root directory:

    `.env.development`

    `.env.test`

2. Add your database names like this:

    `PGDATABASE=your_dev_db_name`

    `PGDATABASE=your_test_db_name`

3. Then run:

    `npm run setup-dbs`
    `npm run seed`

### Run the server

`npm start`

### Testing

This project uses Jest and Supertest:

```bash
npm test
```
