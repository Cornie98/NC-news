const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

console.log("Current NODE_ENV:", process.env.NODE_ENV);

const runSeed = () => {
    return seed(devData).then(() => db.end());
};

runSeed();
