# NC News Seeding

## Environment Setup

`.env.*` files are ignored by Git so create them yourself to run the project locally.

### What to do:

1. Create two files in the root directory:

    `.env.development`

    `.env.test`

2. Add your database names like this:

    `PGDATABASE=your_dev_db_name`

    `PGDATABASE=your_test_db_name`

3. Then run:

    `npm run setup-dbs`
