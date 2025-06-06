const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listener(PORT, () => console.log(`Listening on ${PORT}...`));
